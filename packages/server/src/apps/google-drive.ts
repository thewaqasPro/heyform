import { FieldKindEnum } from '@heyform-inc/shared-types-enums'
import { google } from 'googleapis'
import got from 'got'
import { Readable } from 'stream'

import { helper } from '@heyform-inc/utils'
import { FormModel, SubmissionModel } from '@model'

export interface GoogleDriveConfig {
  folderId: string
  clientEmail: string
  privateKey: string
}

interface RunArgs {
  config: GoogleDriveConfig
  submission: SubmissionModel
  form: FormModel
}

export default {
  id: 'google-drive',
  name: 'Google Drive',
  description:
    'Automatically upload form responses and respondent-uploaded files directly into your Google Drive folder.',
  icon: '/static/google-drive.png',
  settings: [
    {
      type: 'text',
      name: 'folderId',
      label: 'Google Drive Folder ID',
      placeholder: 'e.g. 1a2b3c4d5e6f7g8h9i0j',
      required: true,
      description:
        'The Folder ID from your Google Drive URL (make sure the folder is shared with the Service Account email)'
    },
    {
      type: 'text',
      name: 'clientEmail',
      label: 'Google Service Account Email',
      placeholder: 'your-service-account@project.iam.gserviceaccount.com',
      required: true
    },
    {
      type: 'textarea',
      name: 'privateKey',
      label: 'Google Service Account Private Key',
      placeholder: '-----BEGIN PRIVATE KEY-----\n...',
      required: true
    }
  ],
  run: async ({ config, submission, form }: RunArgs) => {
    if (!config?.folderId || !config?.clientEmail || !config?.privateKey) return

    const auth = new google.auth.JWT({
      email: config.clientEmail,
      key: config.privateKey.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive'
      ]
    })

    const drive = google.drive({ version: 'v3', auth })

    // 1. Upload Submission Summary as a structured JSON file
    try {
      const summaryData = {
        formId: form.id,
        formName: form.name,
        submissionId: submission.id,
        submittedAt: new Date().toISOString(),
        answers: submission.answers,
        hiddenFields: submission.hiddenFields,
        variables: submission.variables
      }

      const summaryStream = new Readable()
      summaryStream.push(JSON.stringify(summaryData, null, 2))
      summaryStream.push(null)

      const safeFormName = (form.name || 'form').replace(/[^a-zA-Z0-9_-]/g, '_')

      await drive.files.create({
        requestBody: {
          name: `Submission_${safeFormName}_${submission.id}.json`,
          parents: [config.folderId]
        },
        media: {
          mimeType: 'application/json',
          body: summaryStream
        }
      })
    } catch (err) {
      console.error('[GoogleDrive] Failed to create submission JSON:', err)
    }

    // 2. Upload any uploaded file attachments
    const fileAnswers =
      submission.answers?.filter(
        a => a.kind === FieldKindEnum.FILE_UPLOAD && helper.isValid(a.value)
      ) || []

    for (const fileAnswer of fileAnswers) {
      try {
        let fileUrl = ''
        let filename = 'attachment'

        if (typeof fileAnswer.value === 'string' && helper.isURL(fileAnswer.value)) {
          fileUrl = fileAnswer.value
        } else if (fileAnswer.value && typeof fileAnswer.value === 'object') {
          fileUrl = fileAnswer.value.url
          filename = fileAnswer.value.filename || 'attachment'
        }

        if (fileUrl) {
          const fileStream = got.stream(fileUrl, { timeout: 10000 })
          await drive.files.create({
            requestBody: {
              name: `${submission.id}_${filename}`,
              parents: [config.folderId]
            },
            media: {
              body: fileStream
            }
          })
        }
      } catch (err) {
        console.error('[GoogleDrive] Failed to upload attachment:', err)
      }
    }
  }
}

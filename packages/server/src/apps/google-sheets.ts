import { google } from 'googleapis'

import { FormModel, SubmissionModel } from '@model'

export interface GoogleSheetsConfig {
  spreadsheetId: string
  sheetName?: string
  clientEmail: string
  privateKey: string
}

interface RunArgs {
  config: GoogleSheetsConfig
  submission: SubmissionModel
  form: FormModel
}

export default {
  id: 'google-sheets',
  name: 'Google Sheets',
  description: 'Send form responses directly to a Google Sheets spreadsheet in real-time.',
  icon: '/static/google-sheets.png',

  // Settings rendered in the KyndForm Integrations UI
  settings: [
    {
      type: 'text',
      name: 'spreadsheetId',
      label: 'Spreadsheet ID',
      placeholder: 'e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
      required: true
    },
    {
      type: 'text',
      name: 'sheetName',
      label: 'Sheet Name (Tab)',
      placeholder: 'Sheet1',
      required: false
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

  // Execution handler called automatically upon form submission
  run: async ({ config, submission, form }: RunArgs) => {
    const auth = new google.auth.JWT({
      email: config.clientEmail,
      key: config.privateKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    })

    const sheets = google.sheets({ version: 'v4', auth })
    const sheetName = config.sheetName || 'Sheet1'

    // Format submission answers into row columns matching form fields
    const rowValues = form.fields.map(field => {
      const answer = submission.answers?.find(a => a.id === field.id)
      if (!answer) return ''
      if (typeof answer.value === 'object') return JSON.stringify(answer.value)
      return String(answer.value ?? '')
    })

    // Append submission ID and submission date
    const rowData = [submission.id, new Date().toISOString(), ...rowValues]

    await sheets.spreadsheets.values.append({
      spreadsheetId: config.spreadsheetId,
      range: `${sheetName}!A:A`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowData]
      }
    })
  }
}

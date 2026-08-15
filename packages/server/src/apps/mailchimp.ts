import { FieldKindEnum } from '@heyform-inc/shared-types-enums'
import got from 'got'

import { helper } from '@heyform-inc/utils'
import { FormModel, SubmissionModel } from '@model'

export interface MailchimpConfig {
  apiKey: string
  listId: string
}

interface RunArgs {
  config: MailchimpConfig
  submission: SubmissionModel
  form: FormModel
}

export default {
  id: 'mailchimp',
  name: 'Mailchimp',
  description: 'Add new respondents and form leads as subscribers to your Mailchimp Audience.',
  icon: '/static/mailchimp.svg',
  settings: [
    {
      type: 'text',
      name: 'apiKey',
      label: 'Mailchimp API Key',
      placeholder: 'e.g. 1a2b3c4d5e6f7g8h9i0j-us1',
      required: true,
      description: 'API key from your Mailchimp Account Settings > Extras > API keys'
    },
    {
      type: 'text',
      name: 'listId',
      label: 'Audience / List ID',
      placeholder: 'e.g. a1b2c3d4e5',
      required: true,
      description: 'Unique ID of the Audience in Mailchimp Audience Settings'
    }
  ],
  run: async ({ config, submission }: RunArgs) => {
    if (!config?.apiKey || !config?.listId) return

    const datacenter = config.apiKey.split('-')[1] || 'us1'

    // Look for email and name fields in answers
    let email = ''
    let firstName = ''
    let lastName = ''

    if (Array.isArray(submission.answers)) {
      for (const a of submission.answers) {
        if (a.kind === FieldKindEnum.EMAIL && helper.isEmail(a.value)) {
          email = String(a.value).trim().toLowerCase()
        } else if (a.kind === FieldKindEnum.FULL_NAME && a.value && typeof a.value === 'object') {
          firstName = a.value.firstName || ''
          lastName = a.value.lastName || ''
        } else if (a.title && /email/i.test(a.title) && helper.isEmail(a.value)) {
          email = String(a.value).trim().toLowerCase()
        }
      }
    }

    if (!email) return

    const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${config.listId}/members`

    await got.post(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`any:${config.apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      json: {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      },
      timeout: 15000,
      retry: 1
    })
  }
}

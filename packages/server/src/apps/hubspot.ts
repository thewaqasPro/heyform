import { FieldKindEnum } from '@heyform-inc/shared-types-enums'
import got from 'got'

import { helper } from '@heyform-inc/utils'
import { FormModel, SubmissionModel } from '@model'

export interface HubspotConfig {
  accessToken: string
}

interface RunArgs {
  config: HubspotConfig
  submission: SubmissionModel
  form: FormModel
}

export default {
  id: 'hubspot',
  name: 'HubSpot',
  description: 'Create or update contacts in HubSpot CRM from form submissions.',
  icon: '/static/hubspot.svg',
  settings: [
    {
      type: 'textarea',
      name: 'accessToken',
      label: 'HubSpot Private App Access Token',
      placeholder: 'pat-na1-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
      required: true,
      description:
        'Create a Private App in HubSpot Settings > Integrations > Private Apps with crm.objects.contacts.write scope'
    }
  ],
  run: async ({ config, submission }: RunArgs) => {
    if (!config?.accessToken) return

    let email = ''
    let firstname = ''
    let lastname = ''
    let phone = ''
    let company = ''

    if (Array.isArray(submission.answers)) {
      for (const a of submission.answers) {
        if (a.kind === FieldKindEnum.EMAIL && helper.isEmail(a.value)) {
          email = String(a.value).trim().toLowerCase()
        } else if (a.kind === FieldKindEnum.FULL_NAME && a.value && typeof a.value === 'object') {
          firstname = a.value.firstName || ''
          lastname = a.value.lastName || ''
        } else if (a.kind === FieldKindEnum.PHONE_NUMBER && a.value) {
          phone = typeof a.value === 'object' ? a.value.phone : String(a.value)
        } else if (a.title && /company|organization/i.test(a.title)) {
          company = String(a.value || '')
        }
      }
    }

    if (!email) return

    const properties: Record<string, string> = {
      email,
      ...(firstname ? { firstname } : {}),
      ...(lastname ? { lastname } : {}),
      ...(phone ? { phone } : {}),
      ...(company ? { company } : {})
    }

    await got.post('https://api.hubapi.com/crm/v3/objects/contacts', {
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json'
      },
      json: {
        properties
      },
      timeout: 15000,
      retry: 1
    })
  }
}

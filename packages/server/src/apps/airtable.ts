import got from 'got'

import { FormModel, SubmissionModel } from '@model'

export interface AirtableConfig {
  baseId: string
  tableName: string
  token: string
}

interface RunArgs {
  config: AirtableConfig
  submission: SubmissionModel
  form: FormModel
}

export default {
  id: 'airtable',
  name: 'Airtable',
  description: 'Automatically insert form submissions as new records in your Airtable base.',
  icon: '/static/airtable.svg',
  settings: [
    {
      type: 'text',
      name: 'baseId',
      label: 'Airtable Base ID',
      placeholder: 'e.g. appXXXXXXXXXXXXXX',
      required: true,
      description: 'The Base ID from your Airtable URL or API documentation'
    },
    {
      type: 'text',
      name: 'tableName',
      label: 'Table Name / Table ID',
      placeholder: 'e.g. Table 1 or tblXXXXXXXXXXXXXX',
      required: true,
      description: 'The exact name or ID of the table in your Airtable base'
    },
    {
      type: 'textarea',
      name: 'token',
      label: 'Airtable Personal Access Token',
      placeholder: 'patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXX',
      required: true,
      description: 'Token with data.records:write scope generated in airtable.com/create/tokens'
    }
  ],
  run: async ({ config, submission }: RunArgs) => {
    if (!config?.baseId || !config?.tableName || !config?.token) return

    const fields: Record<string, unknown> = {}

    // Map each answer to a column matching the field title
    if (Array.isArray(submission.answers)) {
      submission.answers.forEach(a => {
        if (!a.title) return
        if (typeof a.value === 'object' && a.value !== null) {
          fields[a.title] = JSON.stringify(a.value)
        } else if (a.value !== undefined && a.value !== null) {
          fields[a.title] = String(a.value)
        }
      })
    }

    const url = `https://api.airtable.com/v0/${encodeURIComponent(config.baseId)}/${encodeURIComponent(config.tableName)}`

    await got.post(url, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json'
      },
      json: {
        fields
      },
      timeout: 15000,
      retry: 1
    })
  }
}

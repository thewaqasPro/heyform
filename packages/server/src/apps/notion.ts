import got from 'got'

import { FormModel, SubmissionModel } from '@model'

export interface NotionConfig {
  databaseId: string
  apiKey: string
}

interface RunArgs {
  config: NotionConfig
  submission: SubmissionModel
  form: FormModel
}

export default {
  id: 'notion',
  name: 'Notion',
  description: 'Create a new database page in Notion whenever a form response is submitted.',
  icon: '/static/notion.svg',
  settings: [
    {
      type: 'text',
      name: 'databaseId',
      label: 'Notion Database ID',
      placeholder: '32-character ID from your Notion database URL',
      required: true,
      description: 'Make sure your Notion integration has been invited/shared to this database'
    },
    {
      type: 'textarea',
      name: 'apiKey',
      label: 'Notion Internal Integration Secret',
      placeholder: 'secret_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      required: true,
      description: 'API key created in notion.so/profile/integrations'
    }
  ],
  run: async ({ config, submission, form }: RunArgs) => {
    if (!config?.databaseId || !config?.apiKey) return

    // Clean database ID (strip dashes or format standard UUID)
    const rawDbId = config.databaseId.replace(/-/g, '')
    const database_id = `${rawDbId.slice(0, 8)}-${rawDbId.slice(8, 12)}-${rawDbId.slice(12, 16)}-${rawDbId.slice(16, 20)}-${rawDbId.slice(20)}`

    // Generate block paragraphs for all answers
    const childrenBlocks = (submission.answers || []).map(answer => {
      let text = String(answer.value ?? '')
      if (typeof answer.value === 'object' && answer.value !== null) {
        text = JSON.stringify(answer.value)
      }
      return {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: `${answer.title || 'Question'}: ` },
              annotations: { bold: true }
            },
            {
              type: 'text',
              text: { content: text }
            }
          ]
        }
      }
    })

    const payload = {
      parent: { database_id },
      properties: {
        title: {
          title: [
            {
              text: {
                content: `Response #${submission.id.slice(-6)} - ${form.name}`
              }
            }
          ]
        }
      },
      children: childrenBlocks
    }

    await got.post('https://api.notion.com/v1/pages', {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      json: payload,
      timeout: 15000,
      retry: 1
    })
  }
}

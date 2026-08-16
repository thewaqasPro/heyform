import got from 'got'

import { FormModel, SubmissionModel } from '@model'
import { assertSafeOutboundRequest } from '@utils'

export interface LarkSuiteConfig {
  webhookUrl: string
}

interface RunArgs {
  config: LarkSuiteConfig
  submission: SubmissionModel
  form: FormModel
}

export default {
  id: 'lark-suite',
  name: 'Lark Suite (Feishu)',
  description:
    'Forward new form responses to your Lark Suite group chats using custom bot webhooks.',
  icon: '/static/lark-suite.svg',
  settings: [
    {
      type: 'url',
      name: 'webhookUrl',
      label: 'Lark / Feishu Bot Webhook URL',
      placeholder: 'https://open.larksuite.com/open-apis/bot/v2/hook/XXXXXX',
      required: true,
      description: 'Webhook URL generated when adding a custom bot to your Lark group'
    }
  ],
  run: async ({ config, submission, form }: RunArgs) => {
    if (!config?.webhookUrl) return

    const { lookup, url } = await assertSafeOutboundRequest(config.webhookUrl)

    const content = (submission.answers || []).map(a => [
      {
        tag: 'text',
        text: `• ${a.title || 'Question'}: `
      },
      {
        tag: 'text',
        text: typeof a.value === 'object' ? JSON.stringify(a.value) : String(a.value ?? '')
      }
    ])

    const payload = {
      msg_type: 'post',
      content: {
        post: {
          zh_cn: {
            title: `📋 New Submission: ${form.name}`,
            content: [
              [
                {
                  tag: 'text',
                  text: `Submission ID: ${submission.id}\nTime: ${new Date().toISOString()}\n\n`
                }
              ],
              ...content
            ]
          }
        }
      }
    }

    await got.post(url.toString(), {
      lookup,
      json: payload,
      timeout: 10000,
      retry: 1
    })
  }
}

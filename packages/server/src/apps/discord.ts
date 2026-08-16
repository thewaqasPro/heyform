import got from 'got'

import { FormModel, SubmissionModel } from '@model'
import { assertSafeOutboundRequest } from '@utils'

export interface DiscordConfig {
  webhookUrl: string
}

interface RunArgs {
  config: DiscordConfig
  submission: SubmissionModel
  form: FormModel
}

export default {
  id: 'discord',
  name: 'Discord',
  description:
    'Post structured form submission alerts to your Discord channels using Discord Webhooks.',
  icon: '/static/discord.svg',
  settings: [
    {
      type: 'url',
      name: 'webhookUrl',
      label: 'Discord Webhook URL',
      placeholder: 'https://discord.com/api/webhooks/123456789/abcdef...',
      required: true,
      description: 'Webhook URL created in your Discord Channel Settings > Integrations'
    }
  ],
  run: async ({ config, submission, form }: RunArgs) => {
    if (!config?.webhookUrl) return

    const { lookup, url } = await assertSafeOutboundRequest(config.webhookUrl)

    const fields = (submission.answers || []).slice(0, 25).map(answer => {
      let val = String(answer.value ?? '')
      if (typeof answer.value === 'object' && answer.value !== null) {
        val = JSON.stringify(answer.value)
      }
      return {
        name: answer.title || 'Question',
        value: val.slice(0, 1024) || '—',
        inline: false
      }
    })

    const payload = {
      embeds: [
        {
          title: `📋 New Form Submission: ${form.name}`,
          description: `A new response has been submitted on KyndForm.`,
          color: 0x5865f2,
          fields,
          footer: {
            text: `Submission ID: ${submission.id}`
          },
          timestamp: new Date().toISOString()
        }
      ]
    }

    await got.post(url.toString(), {
      lookup,
      json: payload,
      timeout: 10000,
      retry: 1
    })
  }
}

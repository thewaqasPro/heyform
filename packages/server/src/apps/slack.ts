import got from 'got'

import { FormModel, SubmissionModel } from '@model'

export interface SlackConfig {
  webhookUrl: string
}

interface RunArgs {
  config: SlackConfig
  submission: SubmissionModel
  form: FormModel
}

export default {
  id: 'slack',
  name: 'Slack',
  description:
    'Send form submission alerts and answer summaries directly to a Slack channel via Webhook.',
  icon: '/static/slack.svg',
  settings: [
    {
      type: 'url',
      name: 'webhookUrl',
      label: 'Slack Webhook URL',
      placeholder: 'https://hooks.slack.com/services/T000/B000/XXXX',
      required: true,
      description: 'Incoming Webhook URL configured in your Slack app / workspace'
    }
  ],
  run: async ({ config, submission, form }: RunArgs) => {
    if (!config?.webhookUrl) return

    const fields = (submission.answers || []).map(answer => {
      let val = String(answer.value ?? '')
      if (typeof answer.value === 'object' && answer.value !== null) {
        val = JSON.stringify(answer.value)
      }
      return {
        type: 'mrkdwn',
        text: `*${answer.title || 'Question'}*\n${val || '_Empty_'}`
      }
    })

    const payload = {
      text: `New submission received for *${form.name}*`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `📋 New Submission: ${form.name}`,
            emoji: true
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Submission ID:* \`${submission.id}\` | *Date:* <!date^${Math.floor(Date.now() / 1000)}^{date_num} {time_secs}|${new Date().toISOString()}>`
          }
        },
        {
          type: 'divider'
        },
        ...(fields.length > 0
          ? [
              {
                type: 'section',
                fields: fields.slice(0, 10)
              }
            ]
          : [])
      ]
    }

    await got.post(config.webhookUrl, {
      json: payload,
      timeout: 10000,
      retry: 1
    })
  }
}

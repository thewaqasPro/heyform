import got from 'got'

import { answersToHtml } from '@heyform-inc/answer-utils'
import { FormModel, SubmissionModel } from '@model'

export interface TelegramConfig {
  botToken: string
  chatId: string
}

interface RunArgs {
  config: TelegramConfig
  submission: SubmissionModel
  form: FormModel
}

function escapeTelegramHtml(str: string): string {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function stripHtml(html: string): string {
  return html
    .replace(
      /<li>[\s\S]*?<h3>([\s\S]*?)<\/h3>[\s\S]*?<p>([\s\S]*?)<\/p>[\s\S]*?<\/li>/gi,
      '• <b>$1</b>: $2\n'
    )
    .replace(/<[^>]+>/g, '')
    .trim()
}

export default {
  id: 'telegram',
  name: 'Telegram',
  description:
    'Receive instant notifications in your Telegram chat, group, or channel when someone submits a form.',
  icon: '/static/telegram.svg',
  settings: [
    {
      type: 'text',
      name: 'botToken',
      label: 'Telegram Bot Token',
      placeholder: '123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ',
      required: true,
      description: 'The API Token obtained from @BotFather'
    },
    {
      type: 'text',
      name: 'chatId',
      label: 'Chat / Channel ID',
      placeholder: 'e.g. -1001234567890 or @your_channel',
      required: true,
      description: 'Your user ID, group ID, or public channel username'
    }
  ],
  run: async ({ config, submission, form }: RunArgs) => {
    if (!config?.botToken || !config?.chatId) return

    const htmlAnswers = answersToHtml(submission.answers || [])
    const textAnswers = stripHtml(htmlAnswers)

    const message = `📋 <b>New Submission: ${escapeTelegramHtml(form.name)}</b>\n\n${textAnswers}\n\n<i>Submission ID: ${escapeTelegramHtml(submission.id)}</i>`

    await got.post(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
      json: {
        chat_id: config.chatId,
        text: message,
        parse_mode: 'HTML'
      },
      timeout: 10000,
      retry: 1
    })
  }
}

import got from 'got'

import { FormModel, SubmissionModel } from '@model'

export interface ZapierConfig {
  webhookUrl: string
}

interface RunArgs {
  config: ZapierConfig
  submission: SubmissionModel
  form: FormModel
}

export default {
  id: 'zapier',
  name: 'Zapier',
  description: 'Connect HeyForm to 5,000+ apps on Zapier using a Zapier Catch Hook.',
  icon: '/static/zapier.svg',
  settings: [
    {
      type: 'url',
      name: 'webhookUrl',
      label: 'Zapier Webhook URL',
      placeholder: 'https://hooks.zapier.com/hooks/catch/123456/abcdef/',
      required: true,
      description: 'The Catch Hook URL generated when creating your Zap in Zapier'
    }
  ],
  run: async ({ config, submission, form }: RunArgs) => {
    if (!config?.webhookUrl) return

    const answersMap: Record<string, unknown> = {}
    if (Array.isArray(submission.answers)) {
      submission.answers.forEach(a => {
        const key = a.title || a.id
        answersMap[key] = a.value
      })
    }

    const payload = {
      id: submission.id,
      formId: form.id,
      formName: form.name,
      submittedAt: new Date().toISOString(),
      answers: answersMap,
      rawAnswers: submission.answers,
      hiddenFields: submission.hiddenFields,
      variables: submission.variables
    }

    await got.post(config.webhookUrl, {
      json: payload,
      timeout: 15000,
      retry: 1
    })
  }
}

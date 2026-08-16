const recaptchaClientIds: Record<'standard' | 'enterprise', number | null> = {
  standard: null,
  enterprise: null
}
const RECAPTCHA_CONTAINER_ID = 'kyndform-recaptcha-container'

function hasNoClientsError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err || '')
  return message.includes('No reCAPTCHA clients exist')
}

function ensureRecaptchaContainer(): HTMLElement {
  let container = document.getElementById(RECAPTCHA_CONTAINER_ID)

  if (!container) {
    container = document.createElement('div')
    container.id = RECAPTCHA_CONTAINER_ID
    container.style.display = 'none'
    document.body.appendChild(container)
  }

  return container
}

function ensureWidgetClient(
  instance: Any,
  siteKey: string,
  kind: 'standard' | 'enterprise'
): number {
  if (recaptchaClientIds[kind] !== null) {
    return recaptchaClientIds[kind] as number
  }

  const container = ensureRecaptchaContainer()

  recaptchaClientIds[kind] = instance.render(container, {
    sitekey: siteKey,
    size: 'invisible'
  })

  return recaptchaClientIds[kind] as number
}

function resetWidgetClient(kind: 'standard' | 'enterprise') {
  recaptchaClientIds[kind] = null
}

export function recaptchaToken(instance: Any): Promise<string> {
  return new Promise((resolve, reject) => {
    instance.ready(() => {
      const key = window.kyndform.googleRecaptchaKey

      if (!key) {
        reject(new Error('Google reCAPTCHA key is not configured'))
        return
      }

      const standard = instance
      const enterprise = instance?.enterprise
      const executors = [
        { client: standard, kind: 'standard' as const },
        { client: enterprise, kind: 'enterprise' as const }
      ].filter(executor => typeof executor.client?.execute === 'function')

      if (executors.length < 1) {
        reject(new Error('reCAPTCHA execute API is unavailable'))
        return
      }

      const executeScoreFlow = async () => {
        let lastError: unknown

        for (const executor of executors) {
          try {
            return await executor.client.execute(key, { action: 'submit' })
          } catch (err) {
            lastError = err
          }
        }

        throw lastError
      }

      executeScoreFlow()
        .then(resolve)
        .catch(async (scoreErr: unknown) => {
          if (!hasNoClientsError(scoreErr)) {
            reject(scoreErr)
            return
          }

          try {
            for (const executor of executors) {
              if (typeof executor.client?.render !== 'function') {
                continue
              }

              let clientId = ensureWidgetClient(executor.client, key, executor.kind)
              let token: string

              try {
                token = await executor.client.execute(clientId)
              } catch (widgetErr) {
                // Recreate widget client once if Google reports stale/missing clients.
                if (!hasNoClientsError(widgetErr)) {
                  throw widgetErr
                }

                resetWidgetClient(executor.kind)
                clientId = ensureWidgetClient(executor.client, key, executor.kind)
                token = await executor.client.execute(clientId)
              }

              resolve(token)
              return
            }

            reject(scoreErr)
          } catch (fallbackErr) {
            reject(fallbackErr)
          }
        })
    })
  })
}

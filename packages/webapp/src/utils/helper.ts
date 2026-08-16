import { getTheme, getThemeStyle } from '@kyndform/form-renderer'
import { FormTheme } from '@kyndform/shared-types-enums'

import { isMobilePhone } from '@kyndform/answer-utils'
import { helper } from '@kyndform/utils'

import { STRIPE_PUBLISHABLE_KEY } from '@/consts'

export {
  getFileUploadValue,
  isAllowedUrlOrigin,
  isHttpUrl,
  isTrustedStripeReceiptUrl,
  urlBuilder
} from './file-upload'

const LOADED_SCRIPTS = new Set<string>()

export function loadScript(
  name: string,
  src: string,
  callback: (err?: Error) => void,
  attempts = 0
) {
  if (LOADED_SCRIPTS.has(src)) {
    return callback()
  }

  let script = document.getElementById(name) as HTMLScriptElement

  if (!script) {
    script = document.createElement('script')
    script.id = name
    script.src = src
    document.head.appendChild(script)
  }

  script.onload = () => {
    LOADED_SCRIPTS.add(src)
    callback()
  }

  script.onerror = () => {
    script.onload = null
    script.onerror = null
    document.head.removeChild(script)

    if (attempts >= 3) {
      return callback(new Error(`Failed to load script ${name}`))
    }

    attempts += 1

    setTimeout(() => {
      loadScript(name, src, callback, attempts)
    }, attempts * 50)
  }
}

export function redirectToStripeCheckout(sessionId: string) {
  return new Promise((resolve, reject) => {
    loadScript('stripe-v3', 'https://js.stripe.com/v3/', err => {
      if (err) {
        return reject(err)
      }

      const stripe = (window as any).Stripe(STRIPE_PUBLISHABLE_KEY)

      stripe.redirectToCheckout({
        sessionId
      })
      resolve(null)
    })
  })
}

export function insertStyle(id: string, style: string) {
  let styleElement = document.getElementById(id)

  if (!styleElement) {
    styleElement = document.createElement('style')
    styleElement.id = id

    document.head.appendChild(styleElement)
  }

  styleElement.textContent = style
}

export function isPhoneNumber(arg: any): boolean {
  return helper.isValid(arg) && isMobilePhone(arg)
}

const SECOND = 1
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

export class SecondUtils {
  static parse(num: number, unit: string): number {
    if (unit === 'd') {
      return num * DAY
    }
    if (unit === 'h') {
      return num * HOUR
    }
    if (unit === 'm') {
      return num * MINUTE
    }
    return num * SECOND
  }

  static stringify(hs: number): [number, string] {
    if (hs >= DAY) {
      return [Math.round(hs / DAY), 'd']
    }
    if (hs >= HOUR) {
      return [Math.round(hs / HOUR), 'h']
    }
    if (hs >= MINUTE) {
      return [Math.round(hs / MINUTE), 'm']
    }
    return [hs, 's']
  }
}

export function insertThemeStyle(customTheme?: FormTheme) {
  const theme = getTheme(customTheme)
  let content = getThemeStyle(theme)

  let style = document.getElementById('kyndform-theme')

  if (!style) {
    style = document.createElement('style')
    style.id = 'kyndform-theme'

    document.head.appendChild(style)
  }

  if (customTheme?.customCSS) {
    content += customTheme!.customCSS
  }

  style.textContent = content
}

export function getUrlValue(v: any) {
  if (helper.isURL(v)) {
    return v
  }
}

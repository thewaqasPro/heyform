import { helper, qs, removeObjectNil } from '@kyndform/utils'

interface FileUploadDisplayValue {
  filename: string
  url: string
}

export function isHttpUrl(value: string): boolean {
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

export function isAllowedUrlOrigin(
  value: string,
  allowedOrigins: string[],
  baseUrl?: string
): boolean {
  try {
    const url = new URL(value, baseUrl)

    return allowedOrigins.some(origin => {
      try {
        return url.origin === new URL(origin).origin
      } catch {
        return false
      }
    })
  } catch {
    return false
  }
}

export function isTrustedStripeReceiptUrl(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false
  }

  try {
    const url = new URL(value)
    const hostname = url.hostname.toLowerCase().replace(/\.$/, '')

    return (
      url.protocol === 'https:' &&
      url.port === '' &&
      url.username === '' &&
      url.password === '' &&
      (hostname === 'stripe.com' || hostname.endsWith('.stripe.com'))
    )
  } catch {
    return false
  }
}

export function urlBuilder(prefix: string, query: Record<string, unknown>): string {
  const hashIndex = prefix.indexOf('#')
  const url = hashIndex < 0 ? prefix : prefix.slice(0, hashIndex)
  const hash = hashIndex < 0 ? '' : prefix.slice(hashIndex)
  const separator = url.includes('?') ? '&' : '?'

  return url + separator + qs.stringify(removeObjectNil(query), { encode: true }) + hash
}

export function getFileUploadValue(
  value: unknown,
  allowedOrigins?: string[],
  baseUrl?: string
): FileUploadDisplayValue | undefined {
  let filename = 'Attachment'
  let url: string | undefined

  if (typeof value === 'string') {
    url = value
  } else if (helper.isObject(value)) {
    const file = value as Record<string, unknown>

    if (typeof file.filename === 'string' && helper.isValid(file.filename)) {
      filename = file.filename
    }

    if (typeof file.url === 'string') {
      url = file.url
    } else {
      const prefix = file.urlPrefix || file.cdnUrlPrefix
      const key = file.key || file.cdnKey

      if (typeof prefix === 'string' && typeof key === 'string') {
        url = `${prefix.replace(/\/$/, '')}/${key.replace(/^\//, '')}`
      }
    }
  }

  if (typeof url !== 'string') {
    return
  }

  if (
    (isHttpUrl(url) || /^\/{1,2}[^/]/.test(url)) &&
    (!allowedOrigins || isAllowedUrlOrigin(url, allowedOrigins, baseUrl))
  ) {
    return {
      filename,
      url: urlBuilder(url, {
        attname: filename
      })
    }
  }
}

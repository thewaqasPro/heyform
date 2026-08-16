import { helper } from '@kyndform/utils'

interface RequestLike {
  body?: Record<string, unknown>
  query?: Record<string, unknown>
  params?: Record<string, unknown>
}

export function requestParser(req: RequestLike | undefined, keys: string[]): string | undefined {
  const sources: Array<keyof RequestLike> = ['body', 'query', 'params']
  let value: string | undefined

  for (const source of sources) {
    for (const key of keys) {
      const searchValue = req?.[source]?.[key]

      if (typeof searchValue === 'string' && helper.isValid(searchValue)) {
        value = searchValue
        break
      }
    }
  }

  return value
}

import { expect, test } from 'vitest'

import { LRU, LRUMemoryStore } from '../src/utils/lru'

import { getStorage } from '../src/store'

test('autosave cache defaults to a one-hour maximum lifetime', () => {
  const store = new LRUMemoryStore()
  const before = Math.floor(Date.now() / 1_000)
  const cache = new LRU({ bucket: 'test', store })

  cache.put('form_1', { email: 'respondent@example.com' })

  const persisted = store.getItem('test')
  expect(persisted.items.form_1.expiresAt).toBeGreaterThanOrEqual(before + 3_599)
  expect(persisted.items.form_1.expiresAt).toBeLessThanOrEqual(before + 3_601)
})

test('renderer initialization purges the legacy localStorage answer bucket', () => {
  const removed: string[] = []

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      localStorage: {
        removeItem: (key: string) => removed.push(key)
      }
    }
  })

  try {
    expect(getStorage('form_1', false)).toEqual({})
    expect(removed).toEqual(['KYNDFORM_DATA'])
  } finally {
    Reflect.deleteProperty(globalThis, 'window')
  }
})

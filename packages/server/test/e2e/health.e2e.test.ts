import * as assert from 'assert'

import { E2EClient } from './helpers/client'
import { defineSuite } from './helpers/runner'

export function build(baseUrl: string) {
  const { suite, test } = defineSuite('health')
  const client = new E2EClient({ baseUrl })

  test('GET /health returns 200 with service info', async () => {
    const res = await client.restGet<{ status: string; service: string; uptime: number }>('/health')
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.status, 'ok')
    assert.strictEqual(res.body.service, 'kyndform-server')
    assert.strictEqual(typeof res.body.uptime, 'number')
  })

  test('GET /health/ready reports mongo + redis up', async () => {
    const res = await client.restGet<{
      status: string
      checks: { mongo: string; redis: string }
    }>('/health/ready')
    assert.strictEqual(res.status, 200, `body: ${res.text.slice(0, 200)}`)
    assert.strictEqual(res.body.status, 'ok')
    assert.strictEqual(res.body.checks.mongo, 'up')
    assert.strictEqual(res.body.checks.redis, 'up')
  })

  return suite
}

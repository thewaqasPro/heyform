import * as assert from 'assert'

const Module = require('module')
const originalLoad = Module._load

Module._load = function (request: string, parent: any, isMain: boolean) {
  if (request === '@config') {
    return {
      COOKIE_DEVICE_ID_NAME: 'KYNDFORM_DEVICE_ID',
      COOKIE_LOGIN_IN_NAME: 'KYNDFORM_LOGGED_IN',
      COOKIE_SESSION_NAME: 'KYNDFORM_SESSION',
      CookieOptionsFactory: (options = {}) => options,
      SessionOptionsFactory: (options = {}) => options
    }
  }

  if (request === '@environments') {
    return {
      SESSION_KEY: 'test-session-key',
      SESSION_MAX_AGE: '15d',
      VERIFICATION_CODE_EXPIRE: '5m',
      VERIFICATION_CODE_LIMIT: 5,
      VERIFY_EMAIL_RESEND_COOLDOWN: '1m',
      VERIFY_EMAIL_RESEND_DAILY_LIMIT: 10
    }
  }

  return originalLoad.call(this, request, parent, isMain)
}

const { AuthService } = require('../src/service/auth.service')

function createAuthService() {
  const values = new Map<string, string>()
  const cookies: Record<string, string> = {}
  const cleared: string[] = []

  const redisService = {
    set: async ({ key, value }: { key: string; value: string }) => {
      values.set(key, value)
      return 'OK'
    },
    get: async (key: string) => values.get(key) || null,
    del: async (key: string) => {
      values.delete(key)
      return 1
    }
  }
  const service = new AuthService({} as any, redisService as any)
  const res = {
    cookie: (key: string, value: string) => {
      cookies[key] = value
    },
    clearCookie: (key: string) => {
      cleared.push(key)
    }
  }

  return {
    service,
    values,
    cookies,
    cleared,
    res
  }
}

async function testVerifiesStoredOAuthState() {
  const { service, values, cookies, cleared, res } = createAuthService()
  const req: Record<string, any> = {
    cookies: {},
    headers: {
      'x-device-id': 'device_1'
    }
  }

  const state = await service.createOAuthState(req, res, 'device_1')

  assert.strictEqual(cookies.KYNDFORM_OAUTH_STATE, state)
  assert.strictEqual(values.get(`oauth_state:${state}`), 'device_1')

  req.cookies.KYNDFORM_OAUTH_STATE = state
  await service.verifyOAuthState(req, res, state)

  assert.strictEqual(values.has(`oauth_state:${state}`), false)
  assert.strictEqual(req.headers['x-device-id'], 'device_1')
  assert.strictEqual(req.cookies.KYNDFORM_DEVICE_ID, 'device_1')
  assert.deepStrictEqual(cleared, ['KYNDFORM_OAUTH_STATE'])
}

async function testRejectsMismatchedOAuthState() {
  const { service, res } = createAuthService()
  const req: Record<string, any> = {
    cookies: {
      KYNDFORM_OAUTH_STATE: 'state_1'
    },
    headers: {}
  }

  await assert.rejects(
    async () => service.verifyOAuthState(req, res, 'state_2'),
    (error: any) => error?.message === 'Invalid OAuth state'
  )
}

async function run() {
  await testVerifiesStoredOAuthState()
  await testRejectsMismatchedOAuthState()
}

if (require.main === module) {
  run().catch(error => {
    // eslint-disable-next-line no-console
    console.error(error)
    process.exitCode = 1
  })
}

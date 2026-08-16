import { FieldKindEnum } from '@kyndform/shared-types-enums'
import * as assert from 'assert'

import {
  getUploadContentDisposition,
  getUploadType,
  isUploadFileContentValid,
  sanitizeUploadFilename
} from '../src/config/upload'
import { UploadController } from '../src/controller/upload.controller'
import { isAllowedUploadField } from '../src/utils/upload'

function testAllowsOnlyUploadAndSignatureFields() {
  const form = {
    fields: [
      {
        id: 'text_1',
        kind: FieldKindEnum.SHORT_TEXT
      },
      {
        id: 'file_1',
        kind: FieldKindEnum.FILE_UPLOAD
      },
      {
        id: 'group_1',
        kind: FieldKindEnum.GROUP,
        properties: {
          fields: [
            {
              id: 'signature_1',
              kind: FieldKindEnum.SIGNATURE
            }
          ]
        }
      }
    ]
  }

  assert.strictEqual(isAllowedUploadField(form, 'file_1'), true)
  assert.strictEqual(isAllowedUploadField(form, 'signature_1'), true)
  assert.strictEqual(isAllowedUploadField(form, 'text_1'), false)
  assert.strictEqual(isAllowedUploadField(form, 'missing'), false)
}

function testRequiresMatchingSafeExtensionAndMimeType() {
  assert.ok(getUploadType('photo.png', 'image/png'))
  assert.ok(getUploadType('notes.txt', 'text/plain; charset=utf-8'))
  assert.strictEqual(getUploadType('payload.html', 'image/png'), undefined)
  assert.strictEqual(getUploadType('payload.png', 'text/html'), undefined)
  assert.strictEqual(getUploadType('payload.svg', 'image/svg+xml'), undefined)
  assert.strictEqual(getUploadType('payload.png.exe', 'image/png'), undefined)
}

function testRequiresMatchingFileSignature() {
  assert.strictEqual(
    isUploadFileContentValid({
      buffer: Buffer.from('<script>alert(document.domain)</script>'),
      mimetype: 'image/png',
      originalname: 'payload.png'
    }),
    false
  )
  assert.strictEqual(
    isUploadFileContentValid({
      buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      mimetype: 'image/png',
      originalname: 'photo.png'
    }),
    true
  )
  assert.strictEqual(
    isUploadFileContentValid({
      buffer: Buffer.from('safe plain text'),
      mimetype: 'text/plain',
      originalname: 'notes.txt'
    }),
    true
  )
  assert.strictEqual(
    isUploadFileContentValid({
      buffer: Buffer.from([0x73, 0x61, 0x66, 0x65, 0x00, 0x74, 0x65, 0x78, 0x74]),
      mimetype: 'text/plain',
      originalname: 'notes.txt'
    }),
    false
  )
}

function testSanitizesDownloadMetadata() {
  assert.strictEqual(sanitizeUploadFilename('../bad\r\n"name.txt'), 'bad___name.txt')
  assert.strictEqual(
    getUploadContentDisposition('photo.png', 'image/png'),
    `inline; filename="attachment"; filename*=UTF-8''photo.png`
  )
  assert.match(
    getUploadContentDisposition('invoice.csv', 'text/csv'),
    /^attachment; filename="attachment";/
  )
}

async function testUploadAdmissionAndDistributedQuota() {
  const rateLimitKeys: string[] = []
  const redisService = {
    throttler: async (key: string) => {
      rateLimitKeys.push(key)
    }
  }
  const authenticatedController = new UploadController(
    {
      getSession: () => ({ deviceId: 'device_1', id: 'session_1' }),
      isExpired: async () => false
    } as any,
    {} as any,
    {} as any,
    redisService as any
  )

  await (authenticatedController as any).assertUploadAllowed({
    cookies: {},
    get: (name: string) => (name === 'x-device-id' ? 'device_1' : undefined),
    query: {}
  })
  assert.strictEqual(rateLimitKeys.length, 1)
  assert.match(rateLimitKeys[0], /^upload:session:/)

  let assertedToken = false
  const anonymousController = new UploadController(
    {
      getSession: () => undefined
    } as any,
    {
      assertOpenToken: () => {
        assertedToken = true
      },
      decryptToken: () => ({ formId: 'form_1', timestamp: Math.floor(Date.now() / 1_000) })
    } as any,
    {
      findById: async () => ({
        fields: [{ id: 'file_1', kind: FieldKindEnum.FILE_UPLOAD }],
        settings: { active: true },
        suspended: false
      })
    } as any,
    redisService as any
  )
  const headers: Record<string, string> = {
    'x-kyndform-field-id': 'file_1',
    'x-kyndform-form-id': 'form_1',
    'x-kyndform-open-token': 'encrypted_token'
  }

  await (anonymousController as any).assertUploadAllowed({
    cookies: {},
    get: (name: string) => headers[name],
    query: {}
  })
  assert.strictEqual(assertedToken, true)
  assert.strictEqual(rateLimitKeys.filter(key => key === 'upload:form:form_1').length, 1)
  assert.strictEqual(rateLimitKeys.filter(key => key.startsWith('upload:token:')).length, 1)
}

async function run() {
  testAllowsOnlyUploadAndSignatureFields()
  testRequiresMatchingSafeExtensionAndMimeType()
  testRequiresMatchingFileSignature()
  testSanitizesDownloadMetadata()
  await testUploadAdmissionAndDistributedQuota()
}

if (require.main === module) {
  run().catch(error => {
    // eslint-disable-next-line no-console
    console.error(error)
    process.exitCode = 1
  })
}

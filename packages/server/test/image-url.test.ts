import * as assert from 'assert'
import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'

import { ImageResizingDto } from '../src/common/dto'
import { sanitizeRemoteImage } from '../src/config/upload/image'

type DtoModule = typeof import('../src/common/dto')

async function withImageUrlEnvironment<T>(
  callback: (dto: DtoModule) => T | Promise<T>
): Promise<T> {
  const previousNodeEnv = process.env.NODE_ENV
  const previousHomepageUrl = process.env.APP_HOMEPAGE_URL
  const previousS3PublicUrl = process.env.S3_PUBLIC_URL
  const previousS3Endpoint = process.env.S3_ENDPOINT

  process.env.NODE_ENV = 'production'
  process.env.APP_HOMEPAGE_URL = 'http://192.168.112.4:9157'
  delete process.env.S3_PUBLIC_URL
  delete process.env.S3_ENDPOINT

  delete require.cache[require.resolve('../src/environments')]
  delete require.cache[require.resolve('../src/common/dto')]

  try {
    return await callback(require('../src/common/dto') as DtoModule)
  } finally {
    if (previousNodeEnv === undefined) {
      delete process.env.NODE_ENV
    } else {
      process.env.NODE_ENV = previousNodeEnv
    }

    if (previousHomepageUrl === undefined) {
      delete process.env.APP_HOMEPAGE_URL
    } else {
      process.env.APP_HOMEPAGE_URL = previousHomepageUrl
    }

    if (previousS3PublicUrl === undefined) {
      delete process.env.S3_PUBLIC_URL
    } else {
      process.env.S3_PUBLIC_URL = previousS3PublicUrl
    }

    if (previousS3Endpoint === undefined) {
      delete process.env.S3_ENDPOINT
    } else {
      process.env.S3_ENDPOINT = previousS3Endpoint
    }

    delete require.cache[require.resolve('../src/environments')]
    delete require.cache[require.resolve('../src/common/dto')]
  }
}

async function testFirstPartyPrivateImageUrlPolicy() {
  await withImageUrlEnvironment(dto => {
    assert.strictEqual(dto.isAllowedImageUrl('http://192.168.112.4:9157/static/webhook.png'), true)
    assert.strictEqual(dto.isAllowedImageUrl('http://192.168.112.4:9158/static/webhook.png'), false)
    assert.strictEqual(dto.isAllowedImageUrl('http://192.168.112.5:9157/static/webhook.png'), false)
    assert.strictEqual(dto.isAllowedImageUrl('https://images.unsplash.com/photo.jpg'), true)
  })
}

function testBoundsResizeDimensions() {
  const valid = plainToInstance(ImageResizingDto, {
    url: 'https://images.unsplash.com/photo.jpg',
    w: '640',
    h: '480'
  })
  const negative = plainToInstance(ImageResizingDto, {
    url: 'https://images.unsplash.com/photo.jpg',
    w: '-1'
  })
  const excessive = plainToInstance(ImageResizingDto, {
    url: 'https://images.unsplash.com/photo.jpg',
    h: '4097'
  })
  const malformed = plainToInstance(ImageResizingDto, {
    url: 'https://images.unsplash.com/photo.jpg',
    w: '10junk'
  })

  assert.strictEqual(validateSync(valid).length, 0)
  assert.ok(validateSync(negative).length > 0)
  assert.ok(validateSync(excessive).length > 0)
  assert.ok(validateSync(malformed).length > 0)
}

async function testRemoteImagesRejectActiveOrMalformedContent() {
  await assert.rejects(
    sanitizeRemoteImage(
      Buffer.from(
        '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><script>alert(1)</script></svg>'
      )
    ),
    /Unsupported or malformed image/
  )
  await assert.rejects(sanitizeRemoteImage(Buffer.from('not an image')))
}

async function run() {
  await testFirstPartyPrivateImageUrlPolicy()
  testBoundsResizeDimensions()
  await testRemoteImagesRejectActiveOrMalformedContent()
}

if (require.main === module) {
  run().catch(error => {
    // eslint-disable-next-line no-console
    console.error(error)
    process.exitCode = 1
  })
}

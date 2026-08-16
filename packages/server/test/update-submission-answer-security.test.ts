import { FieldKindEnum } from '@kyndform/shared-types-enums'
import { BadRequestException } from '@nestjs/common'
import * as assert from 'assert'

import { UpdateSubmissionAnswerResolver } from '../src/resolver/submission/update-submission-answer.resolver'

function createService(existingAnswer = true) {
  const writes: Array<{ kind: 'create' | 'update'; answer: any }> = []
  const service = {
    async findByFormId() {
      return {
        answers: existingAnswer ? [{ id: 'url_1' }] : []
      }
    },
    async createAnswer(_submissionId: string, answer: any) {
      writes.push({ kind: 'create', answer })
      return true
    },
    async updateAnswer(_submissionId: string, answer: any) {
      writes.push({ kind: 'update', answer })
      return true
    }
  }

  return { service, writes }
}

const form = {
  fields: [
    {
      id: 'url_1',
      kind: FieldKindEnum.URL,
      properties: { sourceUrl: 'https://example.com' },
      title: 'Website',
      validations: { required: true }
    },
    {
      id: 'signature_1',
      kind: FieldKindEnum.SIGNATURE,
      title: 'Signature'
    },
    {
      id: 'file_1',
      kind: FieldKindEnum.FILE_UPLOAD,
      title: 'Attachment'
    },
    {
      id: 'payment_1',
      kind: FieldKindEnum.PAYMENT,
      title: 'Payment'
    }
  ]
} as any

async function testRejectsUnsafeValueUsingServerFieldKind() {
  const { service, writes } = createService()
  const resolver = new UpdateSubmissionAnswerResolver(service as any)

  await assert.rejects(
    () =>
      resolver.updateSubmissionAnswer(form, {
        answer: {
          id: 'url_1',
          kind: FieldKindEnum.SHORT_TEXT,
          properties: {},
          value: 'javascript:alert(document.domain)'
        },
        formId: 'form_1',
        submissionId: 'submission_1'
      }),
    (error: unknown) =>
      error instanceof BadRequestException &&
      JSON.stringify(error.getResponse()).includes('Please enter a valid url')
  )
  assert.deepStrictEqual(writes, [])
}

async function testPersistsOnlyServerDerivedAnswerMetadata() {
  const { service, writes } = createService()
  const resolver = new UpdateSubmissionAnswerResolver(service as any)

  const result = await resolver.updateSubmissionAnswer(form, {
    answer: {
      id: 'url_1',
      kind: FieldKindEnum.SHORT_TEXT,
      properties: { sourceUrl: 'https://attacker.example' },
      value: 'https://legit.example/path'
    },
    formId: 'form_1',
    submissionId: 'submission_1'
  })

  assert.strictEqual(result, true)
  assert.deepStrictEqual(writes, [
    {
      kind: 'update',
      answer: {
        id: 'url_1',
        kind: FieldKindEnum.URL,
        properties: { sourceUrl: 'https://example.com' },
        title: 'Website',
        value: 'https://legit.example/path'
      }
    }
  ])
}

async function testRejectsUnknownAndUnsafeSpecialFields() {
  const { service, writes } = createService(false)
  const resolver = new UpdateSubmissionAnswerResolver(service as any)

  await assert.rejects(
    () =>
      resolver.updateSubmissionAnswer(form, {
        answer: {
          id: 'missing',
          value: 'https://example.com'
        },
        formId: 'form_1',
        submissionId: 'submission_1'
      }),
    /field does not exist/
  )
  await assert.rejects(
    () =>
      resolver.updateSubmissionAnswer(form, {
        answer: {
          id: 'signature_1',
          value: 'https://attacker.example/tracker.gif'
        },
        formId: 'form_1',
        submissionId: 'submission_1'
      }),
    /Invalid field value/
  )
  await assert.rejects(
    () =>
      resolver.updateSubmissionAnswer(form, {
        answer: {
          id: 'file_1',
          value: {
            filename: 'Signed_Contract.pdf',
            url: 'https://attacker.example/phish'
          }
        },
        formId: 'form_1',
        submissionId: 'submission_1'
      }),
    /Invalid field value/
  )
  await assert.rejects(
    () =>
      resolver.updateSubmissionAnswer(form, {
        answer: {
          id: 'payment_1',
          value: {
            amount: 100,
            currency: 'usd',
            paymentIntentId: 'pi_fake',
            receiptUrl: 'javascript:alert(document.domain)'
          }
        },
        formId: 'form_1',
        submissionId: 'submission_1'
      }),
    /Invalid field value/
  )
  assert.deepStrictEqual(writes, [])
}

async function run() {
  await testRejectsUnsafeValueUsingServerFieldKind()
  await testPersistsOnlyServerDerivedAnswerMetadata()
  await testRejectsUnknownAndUnsafeSpecialFields()
}

if (require.main === module) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}

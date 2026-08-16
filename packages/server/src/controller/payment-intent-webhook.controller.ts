import { BadRequestException, Controller, Headers, Post, Req } from '@nestjs/common'

import { STRIPE_WEBHOOK_SECRET_KEY } from '@environments'
import { helper } from '@kyndform/utils'
import { PaymentService, SubmissionService } from '@service'

@Controller()
export class PaymentIntentWebhookController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly submissionService: SubmissionService
  ) {}

  @Post('/payment/intent/webhook')
  async webhook(@Headers('stripe-signature') signature: string, @Req() req: any) {
    const event = this.paymentService.constructEvent(req.body, signature, STRIPE_WEBHOOK_SECRET_KEY)
    const object: Record<string, any> = event.data.object

    if (event.type === 'payment_intent.succeeded') {
      return await this._paymentIntentSucceeded(object)
    }

    return 'success'
  }

  private async _paymentIntentSucceeded(object: any) {
    const { id: paymentIntentId, metadata } = object

    if (helper.isEmpty(metadata) || helper.isEmpty(metadata.submissionId)) {
      throw new BadRequestException('Invalid payment metadata')
    }

    const { submissionId, fieldId } = metadata
    const submission = await this.submissionService.findById(submissionId)

    if (helper.isEmpty(submission)) {
      throw new BadRequestException('Submission not found')
    }

    const answer = submission.answers.find(a => a.id === fieldId)

    if (helper.isEmpty(answer)) {
      throw new BadRequestException('Field not found')
    }

    const charge = object.charges.data[0]
    const answerValue = { ...answer.value }
    delete answerValue.clientSecret

    await this.submissionService.updateAnswer(submissionId, {
      ...answer,
      value: {
        ...answerValue,
        paymentIntentId,
        billingDetails: {
          name: charge.billing_details.name
        },
        receiptUrl: charge.receipt_url
      }
    })
  }
}

import { Answer } from '@kyndform/shared-types-enums'
import { BadRequestException } from '@nestjs/common'

import { Auth, Form, FormGuard } from '@decorator'
import { UpdateSubmissionAnswerInput } from '@graphql'
import {
  ValidateError,
  fieldsToValidateRules,
  flattenFields,
  validate
} from '@kyndform/answer-utils'
import { FormModel } from '@model'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { SubmissionService } from '@service'
import { assertSafeSpecialFieldAnswers } from '@utils'

@Resolver()
@Auth()
export class UpdateSubmissionAnswerResolver {
  constructor(private readonly submissionService: SubmissionService) {}

  @Mutation(returns => Boolean)
  @FormGuard()
  async updateSubmissionAnswer(
    @Form() form: FormModel,
    @Args('input') input: UpdateSubmissionAnswerInput
  ): Promise<boolean> {
    const rule = fieldsToValidateRules(flattenFields(form.fields, true)).find(
      row => row.id === input.answer.id
    )

    if (!rule) {
      throw new BadRequestException('The field does not exist on this form')
    }

    try {
      assertSafeSpecialFieldAnswers([rule], {
        [rule.id]: input.answer.value
      })
      validate(rule, input.answer.value)
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error
      }

      if (error instanceof ValidateError) {
        throw new BadRequestException(error.response)
      }

      throw error
    }

    const submission = await this.submissionService.findByFormId(input.formId, input.submissionId)

    if (!submission) {
      throw new BadRequestException('The submission dose not exist.')
    }

    const existsAnswer = submission.answers.find(row => row.id === input.answer.id)
    const answer: Answer = {
      id: rule.id,
      kind: rule.kind,
      properties: rule.properties || {},
      title: rule.title,
      value: input.answer.value
    }

    if (existsAnswer) {
      return this.submissionService.updateAnswer(input.submissionId, answer)
    } else {
      return this.submissionService.createAnswer(input.submissionId, answer)
    }
  }
}

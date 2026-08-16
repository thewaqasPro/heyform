import { AnswerValue, FormField } from '@heyform-inc/shared-types-enums'

import { FieldsToValidateRules } from './fields-to-validate-rules'

export interface ValidateErrorResponse {
  id: string
  kind: string
  title?: string
  message: string
  value?: any
}
export declare class ValidateError extends Error {
  response: ValidateErrorResponse
  constructor(response: ValidateErrorResponse)
}
export declare function validate(rule: FieldsToValidateRules, value: AnswerValue): void
export declare function validateFields(
  fields: FormField[],
  values: Record<string, AnswerValue>
): void
export declare function validateRequiredField(field: FormField, values: any): boolean

import { AnswerValue, FormField, Logic, Variable } from '@heyform-inc/shared-types-enums'

interface IFormField extends FormField {
  parent?: FormField
  isTouched?: boolean
}
export interface PickAndCalcFieldsResult {
  fields: IFormField[]
  variables: Record<string, AnswerValue>
}
export declare function applyLogicToFields(
  fields?: IFormField[],
  logics?: Logic[],
  parameters?: Variable[],
  values?: Record<string, AnswerValue>
): PickAndCalcFieldsResult
export {}

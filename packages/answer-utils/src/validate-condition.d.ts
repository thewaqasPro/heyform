import { AnswerValue, FormField, LogicCondition } from '@heyform-inc/shared-types-enums'

export declare function validateCondition(
  field: FormField,
  condition: LogicCondition,
  values?: Record<string, AnswerValue>
): boolean

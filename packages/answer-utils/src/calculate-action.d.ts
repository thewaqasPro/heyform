import {
  AnswerValue,
  NumberCalculateAction,
  StringCalculateAction,
  Variable
} from '@heyform-inc/shared-types-enums'

export declare function calculateAction(
  action: NumberCalculateAction | StringCalculateAction,
  parameters?: Variable[],
  data?: Record<string, string | number>,
  values?: Record<string, AnswerValue>
): Record<string, string | number>

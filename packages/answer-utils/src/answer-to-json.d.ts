import { Answer } from '@heyform-inc/shared-types-enums'

interface AnswersToJsonOptions {
  plain?: boolean
}
export declare function answersToJson(
  answers: Answer[],
  options?: AnswersToJsonOptions
): Record<string, any>
export {}

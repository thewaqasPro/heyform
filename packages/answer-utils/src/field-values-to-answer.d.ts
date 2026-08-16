import { Answer, FormField } from '@heyform-inc/shared-types-enums'

export declare function fieldValuesToAnswers(
  fields: FormField[],
  values: Record<string, any>,
  partialSubmission?: boolean
): Answer[]

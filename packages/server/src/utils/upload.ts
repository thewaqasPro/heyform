import { FieldKindEnum, FormField, FormModel } from '@heyform-inc/shared-types-enums'

import { flattenFields } from '@heyform-inc/answer-utils'
import { helper, parseJson } from '@heyform-inc/utils'

const UPLOAD_FIELD_KINDS = new Set([FieldKindEnum.FILE_UPLOAD, FieldKindEnum.SIGNATURE])

export function isAllowedUploadField(
  form: Pick<FormModel, 'fields'> & Record<string, any>,
  fieldId?: string
): boolean {
  if (!fieldId) {
    return false
  }

  const draftFields = helper.isValid(form._drafts) ? (parseJson(form._drafts) as any[]) : []
  const allCandidateFields: FormField[] = [
    ...(form.fields || []),
    ...(form.drafts || []),
    ...(helper.isValidArray(draftFields) ? (draftFields as FormField[]) : [])
  ]

  return flattenFields(allCandidateFields, true).some(
    field => field.id === fieldId && UPLOAD_FIELD_KINDS.has(field.kind)
  )
}

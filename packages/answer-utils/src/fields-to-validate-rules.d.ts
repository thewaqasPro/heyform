import { FormField, Property, Validation } from '@heyform-inc/shared-types-enums'

export interface FieldsToValidateRules
  extends FormField, Validation, Partial<Omit<Property, 'choices' | 'tableColumns'>> {
  title: string
  description: string
  choices?: string[]
}
export declare function fieldsToValidateRules(fields: FormField[]): FieldsToValidateRules[]

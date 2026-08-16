import { FieldKindEnum } from '../enums/form'

export const OTHER_FIELD_KINDS = [FieldKindEnum.WELCOME, FieldKindEnum.THANK_YOU]
export const STATEMENT_FIELD_KINDS = [FieldKindEnum.STATEMENT, ...OTHER_FIELD_KINDS]
export const QUESTION_FIELD_KINDS = [
  FieldKindEnum.GROUP,
  FieldKindEnum.SHORT_TEXT,
  FieldKindEnum.LONG_TEXT,
  FieldKindEnum.NUMBER,
  FieldKindEnum.YES_NO,
  FieldKindEnum.MULTIPLE_CHOICE,
  FieldKindEnum.PICTURE_CHOICE,
  FieldKindEnum.FILE_UPLOAD,
  FieldKindEnum.OPINION_SCALE,
  FieldKindEnum.RATING,
  FieldKindEnum.DATE,
  FieldKindEnum.DATE_RANGE,
  FieldKindEnum.TIME,
  FieldKindEnum.INPUT_TABLE,
  FieldKindEnum.PAYMENT,
  FieldKindEnum.FULL_NAME,
  FieldKindEnum.ADDRESS,
  FieldKindEnum.EMAIL,
  FieldKindEnum.URL,
  FieldKindEnum.PHONE_NUMBER,
  FieldKindEnum.COUNTRY,
  FieldKindEnum.SIGNATURE,
  FieldKindEnum.LEGAL_TERMS
]
export const INPUT_FIELD_KINDS = [
  FieldKindEnum.SHORT_TEXT,
  FieldKindEnum.LONG_TEXT,
  FieldKindEnum.NUMBER,
  FieldKindEnum.EMAIL,
  FieldKindEnum.URL
]
export const CHOICES_FIELD_KINDS = [FieldKindEnum.MULTIPLE_CHOICE, FieldKindEnum.PICTURE_CHOICE]
export const FORM_FIELD_KINDS = [...QUESTION_FIELD_KINDS, ...STATEMENT_FIELD_KINDS]
export const CHOICE_FIELD_KINDS = [FieldKindEnum.YES_NO, ...CHOICES_FIELD_KINDS]
export const RATING_FIELD_KINDS = [FieldKindEnum.RATING, FieldKindEnum.OPINION_SCALE]
export const UNSELECTABLE_FIELD_KINDS = [
  FieldKindEnum.WELCOME,
  FieldKindEnum.THANK_YOU,
  FieldKindEnum.GROUP,
  FieldKindEnum.STATEMENT
]
//# sourceMappingURL=form.js.map

export declare enum InteractiveModeEnum {
  GENERAL = 1,
  INTERACTIVE = 2,
  POPUP = 3
}
export declare enum FormLayoutModeEnum {
  CONVERSATIONAL = 'conversational',
  CLASSIC = 'classic'
}
export declare enum FormKindEnum {
  SURVEY = 1,
  QUIZ = 2,
  CONTACT = 3
}
export declare enum FormStatusEnum {
  NORMAL = 1,
  TRASH = 2
}
export declare enum CaptchaKindEnum {
  NONE = 0,
  GOOGLE_RECAPTCHA = 1
}
export declare enum FieldKindEnum {
  GROUP = 'group',
  WELCOME = 'welcome',
  THANK_YOU = 'thank_you',
  STATEMENT = 'statement',
  SHORT_TEXT = 'short_text',
  LONG_TEXT = 'long_text',
  NUMBER = 'number',
  YES_NO = 'yes_no',
  MULTIPLE_CHOICE = 'multiple_choice',
  PICTURE_CHOICE = 'picture_choice',
  FILE_UPLOAD = 'file_upload',
  OPINION_SCALE = 'opinion_scale',
  RATING = 'rating',
  DATE = 'date',
  DATE_RANGE = 'date_range',
  TIME = 'time',
  INPUT_TABLE = 'input_table',
  PAYMENT = 'payment',
  FULL_NAME = 'full_name',
  ADDRESS = 'address',
  EMAIL = 'email',
  URL = 'url',
  PHONE_NUMBER = 'phone_number',
  COUNTRY = 'country_selector',
  SIGNATURE = 'signature',
  LEGAL_TERMS = 'legal_terms',
  SUBMIT_DATE = 'submit_date',
  HIDDEN_FIELDS = 'hidden_fields',
  VARIABLE = 'variable',
  HIDDEN_CHECKBOX = 'hidden_checkbox',
  CUSTOM_TEXT = 'custom_text',
  CUSTOM_SINGLE = 'custom_single',
  CUSTOM_MULTIPLE = 'custom_multiple',
  CUSTOM_DATE = 'custom_date',
  CUSTOM_NUMBER = 'custom_number',
  CUSTOM_CHECKBOX = 'custom_checkbox'
}
export declare enum ChoiceBadgeEnum {
  LETTER = 'letter',
  NUMBER = 'number'
}
export declare enum FieldLayoutAlignEnum {
  INLINE = 'inline',
  FLOAT_LEFT = 'float_left',
  FLOAT_RIGHT = 'float_right',
  SPLIT_LEFT = 'split_left',
  SPLIT_RIGHT = 'split_right',
  COVER = 'cover'
}
export declare enum ComparisonEnum {
  IS = 'is',
  IS_NOT = 'is_not',
  CONTAINS = 'contains',
  DOES_NOT_CONTAIN = 'does_not_contain',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  EQUAL = 'equal',
  NOT_EQUAL = 'not_equal',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_OR_EQUAL_THAN = 'greater_or_equal_than',
  LESS_OR_EQUAL_THAN = 'less_or_equal_than',
  IS_BEFORE = 'is_before',
  IS_AFTER = 'is_after',
  IS_EMPTY = 'is_empty',
  IS_NOT_EMPTY = 'is_not_empty'
}
export declare enum CalculateEnum {
  ADDITION = 'addition',
  SUBTRACTION = 'subtraction',
  MULTIPLICATION = 'multiplication',
  DIVISION = 'division',
  ASSIGNMENT = 'assignment'
}
export declare enum ActionEnum {
  NAVIGATE = 'navigate',
  CALCULATE = 'calculate'
}

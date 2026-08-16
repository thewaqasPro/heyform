'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.validateRequiredField =
  exports.validateFields =
  exports.validate =
  exports.ValidateError =
    void 0
const tslib_1 = require('tslib')
const shared_types_enums_1 = require('@heyform-inc/shared-types-enums')
const dayjs_1 = tslib_1.__importDefault(require('dayjs'))
const utils_1 = require('@heyform-inc/utils')
const fields_to_validate_rules_1 = require('./fields-to-validate-rules')
const helper_1 = require('./helper')
class ValidateError extends Error {
  constructor(response) {
    super()
    this.message = response.message
    this.response = response
  }
}
exports.ValidateError = ValidateError
function validate(rule, value) {
  if (!rule.required) {
    if (utils_1.helper.isNil(value)) {
      return
    }
  } else {
    if (utils_1.helper.isEmpty(value)) {
      throw new ValidateError({
        id: rule.id,
        kind: rule.kind,
        title: rule.title,
        message: 'This field is required'
      })
    }
  }
  switch (rule.kind) {
    case shared_types_enums_1.FieldKindEnum.SHORT_TEXT:
    case shared_types_enums_1.FieldKindEnum.LONG_TEXT:
    case shared_types_enums_1.FieldKindEnum.COUNTRY:
      validateText(rule, value)
      break
    case shared_types_enums_1.FieldKindEnum.NUMBER:
      validateNumber(rule, value)
      break
    case shared_types_enums_1.FieldKindEnum.PHONE_NUMBER:
      validatePhoneNumber(rule, value)
      break
    case shared_types_enums_1.FieldKindEnum.EMAIL:
      validateEmail(rule, value)
      break
    case shared_types_enums_1.FieldKindEnum.URL:
      validateUrl(rule, value)
      break
    case shared_types_enums_1.FieldKindEnum.YES_NO:
      validateSingleChoice(rule, value)
      break
    case shared_types_enums_1.FieldKindEnum.MULTIPLE_CHOICE:
    case shared_types_enums_1.FieldKindEnum.PICTURE_CHOICE:
      validateMultipleChoice(rule, value)
      break
    case shared_types_enums_1.FieldKindEnum.RATING:
    case shared_types_enums_1.FieldKindEnum.OPINION_SCALE:
      validateRating(rule, value)
      break
    case shared_types_enums_1.FieldKindEnum.DATE:
      validateDate(rule, value)
      break
    case shared_types_enums_1.FieldKindEnum.DATE_RANGE:
      validateDateRange(rule, value)
      break
    case shared_types_enums_1.FieldKindEnum.FILE_UPLOAD:
      validateFile(rule, value)
      break
    case shared_types_enums_1.FieldKindEnum.PAYMENT:
      validatePayment(rule, value)
      break
    case shared_types_enums_1.FieldKindEnum.FULL_NAME:
      validateFullName(rule, value)
      break
    case shared_types_enums_1.FieldKindEnum.ADDRESS:
      validateAddress(rule, value)
      break
    case shared_types_enums_1.FieldKindEnum.LEGAL_TERMS:
      validateLegalTerms(rule, value)
      break
    case shared_types_enums_1.FieldKindEnum.INPUT_TABLE:
      validateInputTable(rule, value)
      break
    case shared_types_enums_1.FieldKindEnum.SIGNATURE:
      validateSignature(rule, value)
      break
  }
}
exports.validate = validate
function validateFields(fields, values) {
  const rules = (0, fields_to_validate_rules_1.fieldsToValidateRules)(fields)
  for (const rule of rules) {
    validate(rule, values[rule.id])
  }
}
exports.validateFields = validateFields
function validateRequiredField(field, values) {
  const _field = Object.assign(Object.assign({}, field), {
    validations: Object.assign(Object.assign({}, field.validations), { required: true })
  })
  try {
    validateFields([_field], values)
    return true
  } catch (err) {
    return false
  }
}
exports.validateRequiredField = validateRequiredField
function validateText(rule, value) {
  if (!utils_1.helper.isString(value)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'This field is required'
    })
  }
  if (!validateLength(value, rule.min, rule.max)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: `The text length must be between ${rule.min} to ${rule.max}`
    })
  }
}
function validateNumber(rule, value) {
  if (!utils_1.helper.isNumeric(String(value))) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: `This field should be a number`
    })
  }
  if (!validateInt(value, rule.min, rule.max)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: `The number must be between ${rule.min} to ${rule.max}`
    })
  }
}
function validatePhoneNumber(rule, value) {
  if (!(0, helper_1.isMobilePhone)(value)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'Please enter a valid mobile phone number'
    })
  }
}
function validateEmail(rule, value) {
  if (!utils_1.helper.isString(value)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'This field is required'
    })
  }
  if (!utils_1.helper.isEmail(value)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'Please enter a valid email address'
    })
  }
}
function validateUrl(rule, value) {
  if (!utils_1.helper.isString(value)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'This field is required'
    })
  }
  if (!utils_1.helper.isURL(value)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'Please enter a valid url'
    })
  }
}
function validateSingleChoice(rule, value) {
  if (utils_1.helper.isEmpty(rule.choices)) {
    return
  }
  if (!rule.choices.includes(value)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'Please choose you choice'
    })
  }
}
function validateMultipleChoice(rule, value) {
  if (utils_1.helper.isEmpty(rule.choices)) {
    return
  }
  if (!utils_1.helper.isValidArray(value.value)) {
    if (!utils_1.helper.isObject(value)) {
      value = {}
    }
    value.value = []
  }
  if (
    value.value.length < 1 &&
    utils_1.helper.isEmpty(value === null || value === void 0 ? void 0 : value.other)
  ) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'This field is required'
    })
  }
  let isOtherExists = false
  if (!rule.allowOther) {
    if (utils_1.helper.isValid(value === null || value === void 0 ? void 0 : value.other)) {
      throw new ValidateError({
        id: rule.id,
        kind: rule.kind,
        title: rule.title,
        message: 'Other value is not allowed'
      })
    }
  } else {
    if (
      !(
        utils_1.helper.isNil(value === null || value === void 0 ? void 0 : value.other) ||
        (isOtherExists = utils_1.helper.isValid(
          value === null || value === void 0 ? void 0 : value.other
        ))
      )
    ) {
      throw new ValidateError({
        id: rule.id,
        kind: rule.kind,
        title: rule.title,
        message: 'Other value should not be empty'
      })
    }
  }
  const count = value.value.length + (isOtherExists ? 1 : 0)
  if (!rule.allowMultiple) {
    if (count > 1) {
      throw new ValidateError({
        id: rule.id,
        kind: rule.kind,
        title: rule.title,
        message: 'Multiple choose is not allowed'
      })
    }
    const result = isOtherExists ? value.value.length === 0 : rule.choices.includes(value.value[0])
    if (!result) {
      throw new ValidateError({
        id: rule.id,
        kind: rule.kind,
        title: rule.title,
        message: 'Cannot select non-specified choices'
      })
    }
  }
  const result =
    validateInt(count, rule.min, rule.max) &&
    value.value.filter(row => !rule.choices.includes(row)).length < 1
  if (!result) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'Cannot select non-specified choices'
    })
  }
}
function validateRating(rule, value) {
  if (!validateInt(value, 1, rule.total)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'Rating value must be number'
    })
  }
}
function validateDate(rule, value) {
  if (!utils_1.helper.isString(value)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'This field is required'
    })
  }
  if (!(0, helper_1.isDate)(value, rule.format)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'Please enter a valid date'
    })
  }
}
function validateDateRange(rule, value) {
  if (!utils_1.helper.isObject(value)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'This field is required'
    })
  }
  if (!(0, helper_1.isDate)(value.start, rule.format)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: "Start date isn't valid"
    })
  }
  if (!(0, helper_1.isDate)(value.end, rule.format)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: "End date isn't valid"
    })
  }
  const start = (0, dayjs_1.default)(value.start, rule.format)
  const end = (0, dayjs_1.default)(value.end, rule.format)
  if (end.isBefore(start)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'End date must be after start date'
    })
  }
}
function validateFile(rule, value) {
  var _a, _b
  let url = value
  if (utils_1.helper.isObject(value)) {
    url = value.url
    if (typeof url !== 'string') {
      const prefix = (_a = value.urlPrefix) !== null && _a !== void 0 ? _a : value.cdnUrlPrefix
      const key = (_b = value.key) !== null && _b !== void 0 ? _b : value.cdnKey
      if (typeof prefix === 'string' && typeof key === 'string' && key.length > 0) {
        url = `${prefix.replace(/\/$/, '')}/${key.replace(/^\//, '')}`
      }
    }
  }
  let valid = false
  if (typeof url === 'string') {
    try {
      valid = ['http:', 'https:'].includes(new URL(url).protocol)
    } catch (_c) {}
  }
  if (!valid) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'Please upload a valid file'
    })
  }
}
function validateFullName(rule, value) {
  if (utils_1.helper.isEmpty(value.firstName)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'Please enter first name'
    })
  }
  if (utils_1.helper.isEmpty(value.lastName)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'Please enter last name'
    })
  }
}
function validateAddress(rule, value) {
  if (utils_1.helper.isEmpty(value.address1)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'Please enter address1'
    })
  }
  if (utils_1.helper.isEmpty(value.city)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'Please enter city'
    })
  }
  if (utils_1.helper.isEmpty(value.state)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'Please enter state'
    })
  }
  if (utils_1.helper.isEmpty(value.zip)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'Please enter zip'
    })
  }
  if (utils_1.helper.isEmpty(value.country)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'Please select country'
    })
  }
}
function validatePayment(rule, value) {
  if (utils_1.helper.isValid(process.env.VALIDATE_CLIENT_SIDE)) {
    if (!utils_1.helper.isValid(value.name)) {
      throw new ValidateError({
        id: rule.id,
        kind: rule.kind,
        title: rule.title,
        message: 'Name on card is incomplete'
      })
    }
    if (!utils_1.helper.isTrue(value.cardNumber)) {
      throw new ValidateError({
        id: rule.id,
        kind: rule.kind,
        title: rule.title,
        message: 'Card number is incomplete'
      })
    }
    if (!utils_1.helper.isTrue(value.cardExpiry)) {
      throw new ValidateError({
        id: rule.id,
        kind: rule.kind,
        title: rule.title,
        message: 'Expiry date is incomplete'
      })
    }
    if (!utils_1.helper.isTrue(value.cardCvc)) {
      throw new ValidateError({
        id: rule.id,
        kind: rule.kind,
        title: rule.title,
        message: 'Card cvc is incomplete'
      })
    }
    return
  }
  if (utils_1.helper.isEmpty(value.amount) || value.amount < 0) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'Invalid payment amount'
    })
  }
  if (utils_1.helper.isEmpty(value.currency)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'Invalid payment currency'
    })
  }
}
function validateInt(value, min, max) {
  const int = parseInt(value)
  return (max ? int <= max : true) && int >= (min || 0)
}
function validateLength(value, min, max) {
  return (max ? value.length <= max : true) && value.length >= (min || 0)
}
function validateLegalTerms(rule, value) {
  if (typeof value !== 'boolean' || (rule.required && value !== true)) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'This field must be accepted'
    })
  }
}
function validateInputTable(rule, value) {
  if (!utils_1.helper.isArray(value) || !value.every(row => utils_1.helper.isPlainObject(row))) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'This field must contain valid table rows'
    })
  }
}
function validateSignature(rule, value) {
  let valid = utils_1.helper.isString(value) && value.startsWith('data:image/png;base64,')
  if (!valid && utils_1.helper.isString(value)) {
    try {
      const url = new URL(value)
      valid = url.protocol === 'http:' || url.protocol === 'https:'
    } catch (_a) {
      valid = false
    }
  }
  if (!valid) {
    throw new ValidateError({
      id: rule.id,
      kind: rule.kind,
      title: rule.title,
      message: 'This field must contain a valid signature'
    })
  }
}
//# sourceMappingURL=validate.js.map

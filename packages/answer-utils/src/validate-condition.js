'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.validateCondition = void 0
const shared_types_enums_1 = require('@heyform-inc/shared-types-enums')
const utils_1 = require('@heyform-inc/utils')
const helper_1 = require('./helper')
const NO_LOGIC_FIELD_KINDS = [
  ...shared_types_enums_1.STATEMENT_FIELD_KINDS,
  shared_types_enums_1.FieldKindEnum.GROUP
]
function validateCondition(field, condition, values) {
  switch (field.kind) {
    case shared_types_enums_1.FieldKindEnum.SHORT_TEXT:
    case shared_types_enums_1.FieldKindEnum.LONG_TEXT:
    case shared_types_enums_1.FieldKindEnum.PHONE_NUMBER:
    case shared_types_enums_1.FieldKindEnum.EMAIL:
    case shared_types_enums_1.FieldKindEnum.URL:
      return validateText(field, condition, values)
    case shared_types_enums_1.FieldKindEnum.MULTIPLE_CHOICE:
    case shared_types_enums_1.FieldKindEnum.PICTURE_CHOICE:
      return validateChoice(field, condition, values)
    case shared_types_enums_1.FieldKindEnum.YES_NO:
    case shared_types_enums_1.FieldKindEnum.LEGAL_TERMS:
      return validateBoolean(field, condition, values)
    case shared_types_enums_1.FieldKindEnum.DATE:
      return validateDate(field, condition, values)
    case shared_types_enums_1.FieldKindEnum.NUMBER:
    case shared_types_enums_1.FieldKindEnum.RATING:
    case shared_types_enums_1.FieldKindEnum.OPINION_SCALE:
      return validateNumber(field, condition, values)
    default:
      return validateDefault(field, condition, values)
  }
}
exports.validateCondition = validateCondition
function validateText(field, condition, values) {
  const value = values === null || values === void 0 ? void 0 : values[field.id]
  const { expected } = condition
  switch (condition.comparison) {
    case shared_types_enums_1.ComparisonEnum.IS:
      return (0, helper_1.isEqual)(value, expected)
    case shared_types_enums_1.ComparisonEnum.IS_NOT:
      return !(0, helper_1.isEqual)(value, expected)
    case shared_types_enums_1.ComparisonEnum.CONTAINS:
      return (0, helper_1.isContains)(value, expected)
    case shared_types_enums_1.ComparisonEnum.DOES_NOT_CONTAIN:
      return !(0, helper_1.isContains)(value, expected)
    case shared_types_enums_1.ComparisonEnum.STARTS_WITH:
      return (0, helper_1.isStartsWith)(value, expected)
    case shared_types_enums_1.ComparisonEnum.ENDS_WITH:
      return (0, helper_1.isEndsWith)(value, expected)
  }
  return false
}
function validateChoice(field, condition, values) {
  var _a
  const rawValue = values === null || values === void 0 ? void 0 : values[field.id]
  const { expected: rawExpected } = condition
  const allowMultiple = utils_1.helper.isTrue(
    (_a = field.properties) === null || _a === void 0 ? void 0 : _a.allowMultiple
  )
  const expected = utils_1.helper.isArray(rawExpected) ? rawExpected : [rawExpected]
  const value = [
    ...((rawValue === null || rawValue === void 0 ? void 0 : rawValue.value) || []),
    rawValue === null || rawValue === void 0 ? void 0 : rawValue.other
  ].filter(utils_1.helper.isValid)
  switch (condition.comparison) {
    case shared_types_enums_1.ComparisonEnum.IS:
      return (0, helper_1.isEqual)(value, expected)
    case shared_types_enums_1.ComparisonEnum.IS_NOT:
      return !(0, helper_1.isEqual)(value, expected)
    case shared_types_enums_1.ComparisonEnum.CONTAINS:
      return allowMultiple && (0, helper_1.isContains)(value, expected)
    case shared_types_enums_1.ComparisonEnum.DOES_NOT_CONTAIN:
      return allowMultiple && !(0, helper_1.isContains)(value, expected)
  }
  return false
}
function validateBoolean(field, condition, values) {
  const value = values === null || values === void 0 ? void 0 : values[field.id]
  const { expected } = condition
  switch (condition.comparison) {
    case shared_types_enums_1.ComparisonEnum.IS:
      return (0, helper_1.isEqual)(value, expected)
    case shared_types_enums_1.ComparisonEnum.IS_NOT:
      return !(0, helper_1.isEqual)(value, expected)
  }
  return false
}
function validateNumber(field, condition, values) {
  const value = values === null || values === void 0 ? void 0 : values[field.id]
  const { expected } = condition
  switch (condition.comparison) {
    case shared_types_enums_1.ComparisonEnum.EQUAL:
      return (0, helper_1.isEqual)(value, expected)
    case shared_types_enums_1.ComparisonEnum.NOT_EQUAL:
      return !(0, helper_1.isEqual)(value, expected)
    case shared_types_enums_1.ComparisonEnum.GREATER_THAN:
      return (0, helper_1.isGreaterThan)(value, expected)
    case shared_types_enums_1.ComparisonEnum.LESS_THAN:
      return (0, helper_1.isLessThan)(value, expected)
    case shared_types_enums_1.ComparisonEnum.GREATER_OR_EQUAL_THAN:
      return (0, helper_1.isGreaterOrEqualThan)(value, expected)
    case shared_types_enums_1.ComparisonEnum.LESS_OR_EQUAL_THAN:
      return (0, helper_1.isLessOrEqualThan)(value, expected)
  }
  return false
}
function validateDate(field, condition, values) {
  var _a, _b, _c, _d, _e, _f, _g, _h
  const value = values === null || values === void 0 ? void 0 : values[field.id]
  const { expected } = condition
  switch (condition.comparison) {
    case shared_types_enums_1.ComparisonEnum.IS:
      return (0, helper_1.isSameDate)(
        value,
        expected,
        (_a = field.properties) === null || _a === void 0 ? void 0 : _a.format,
        (_b = field.properties) === null || _b === void 0 ? void 0 : _b.allowTime
      )
    case shared_types_enums_1.ComparisonEnum.IS_NOT:
      return !(0, helper_1.isSameDate)(
        value,
        expected,
        (_c = field.properties) === null || _c === void 0 ? void 0 : _c.format,
        (_d = field.properties) === null || _d === void 0 ? void 0 : _d.allowTime
      )
    case shared_types_enums_1.ComparisonEnum.IS_BEFORE:
      return (0, helper_1.isBeforeDate)(
        value,
        expected,
        (_e = field.properties) === null || _e === void 0 ? void 0 : _e.format,
        (_f = field.properties) === null || _f === void 0 ? void 0 : _f.allowTime
      )
    case shared_types_enums_1.ComparisonEnum.IS_AFTER:
      return (0, helper_1.isAfterDate)(
        value,
        expected,
        (_g = field.properties) === null || _g === void 0 ? void 0 : _g.format,
        (_h = field.properties) === null || _h === void 0 ? void 0 : _h.allowTime
      )
  }
  return false
}
function validateDefault(field, condition, values) {
  if (NO_LOGIC_FIELD_KINDS.includes(field.kind)) {
    return false
  }
  const value = values === null || values === void 0 ? void 0 : values[field.id]
  switch (condition.comparison) {
    case shared_types_enums_1.ComparisonEnum.IS_EMPTY:
      return utils_1.helper.isEmpty(value)
    case shared_types_enums_1.ComparisonEnum.IS_NOT_EMPTY:
      return !utils_1.helper.isEmpty(value)
    default:
      return false
  }
}
//# sourceMappingURL=validate-condition.js.map

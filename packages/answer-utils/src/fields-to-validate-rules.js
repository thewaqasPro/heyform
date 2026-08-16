'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.fieldsToValidateRules = void 0
const shared_types_enums_1 = require('@heyform-inc/shared-types-enums')
const html_utils_1 = require('./html-utils')
const utils_1 = require('@heyform-inc/utils')
const helper_1 = require('./helper')
function fieldsToValidateRules(fields) {
  var _a, _b
  let rules = []
  for (const field of fields) {
    if (!shared_types_enums_1.QUESTION_FIELD_KINDS.includes(field.kind)) {
      continue
    }
    if (field.kind === shared_types_enums_1.FieldKindEnum.GROUP) {
      rules = [
        ...rules,
        ...((_b =
          ((_a = field.properties) === null || _a === void 0 ? void 0 : _a.fields) || []) ===
          null || _b === void 0
          ? void 0
          : _b.map(field => convert(field)))
      ]
    } else {
      rules.push(convert(field))
    }
  }
  return rules
}
exports.fieldsToValidateRules = fieldsToValidateRules
function convert(field) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o
  let title = field.title || ''
  let description = field.description || ''
  if (utils_1.helper.isValidArray(field.title)) {
    title = html_utils_1.htmlUtils.serialize(field.title, {
      plain: true
    })
  }
  if (utils_1.helper.isValidArray(field.description)) {
    description = html_utils_1.htmlUtils.serialize(field.description, {
      plain: true
    })
  }
  const rule = {
    id: field.id,
    kind: field.kind,
    title,
    description,
    validations: field.validations,
    properties: field.properties
  }
  if (
    utils_1.helper.isBool((_a = field.validations) === null || _a === void 0 ? void 0 : _a.required)
  ) {
    rule.required = field.validations.required
  }
  if (
    utils_1.helper.isValid((_b = field.validations) === null || _b === void 0 ? void 0 : _b.min) &&
    utils_1.helper.isNumeric(
      String((_c = field.validations) === null || _c === void 0 ? void 0 : _c.min),
      { no_symbols: true }
    )
  ) {
    rule.min = field.validations.min
  }
  if (
    utils_1.helper.isValid((_d = field.validations) === null || _d === void 0 ? void 0 : _d.max) &&
    utils_1.helper.isNumeric(
      String((_e = field.validations) === null || _e === void 0 ? void 0 : _e.max),
      { no_symbols: true }
    )
  ) {
    rule.max = field.validations.max
  }
  if (
    utils_1.helper.isBool(
      (_f = field.properties) === null || _f === void 0 ? void 0 : _f.allowMultiple
    )
  ) {
    rule.allowMultiple = field.properties.allowMultiple
  }
  if (
    utils_1.helper.isBool(
      (_g = field.properties) === null || _g === void 0 ? void 0 : _g.allowOther
    )
  ) {
    rule.allowOther = field.properties.allowOther
  }
  if (
    utils_1.helper.isValidArray(
      (_h = field.properties) === null || _h === void 0 ? void 0 : _h.choices
    )
  ) {
    rule.choices = field.properties.choices.map(choice => choice.id)
  }
  if (
    utils_1.helper.isString((_j = field.properties) === null || _j === void 0 ? void 0 : _j.format)
  ) {
    rule.format = (0, helper_1.getDateFormat)(
      field.properties.format,
      (_k = field.properties) === null || _k === void 0 ? void 0 : _k.allowTime
    )
  }
  if (
    utils_1.helper.isNumeric(
      String((_l = field.properties) === null || _l === void 0 ? void 0 : _l.price)
    )
  ) {
    rule.price = field.properties.price
  }
  if (
    utils_1.helper.isValid((_m = field.properties) === null || _m === void 0 ? void 0 : _m.total) &&
    utils_1.helper.isNumeric(
      String((_o = field.properties) === null || _o === void 0 ? void 0 : _o.total),
      { no_symbols: true }
    )
  ) {
    rule.total = field.properties.total
  }
  return rule
}
//# sourceMappingURL=fields-to-validate-rules.js.map

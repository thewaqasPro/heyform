'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.fieldValuesToAnswers = void 0
const shared_types_enums_1 = require('@heyform-inc/shared-types-enums')
const utils_1 = require('@heyform-inc/utils')
const fields_to_validate_rules_1 = require('./fields-to-validate-rules')
const validate_1 = require('./validate')
function fieldValuesToAnswers(fields, values, partialSubmission) {
  const rules = (0, fields_to_validate_rules_1.fieldsToValidateRules)(fields)
  const answers = []
  for (const rule of rules) {
    let value = values[rule.id]
    if (partialSubmission) {
      try {
        ;(0, validate_1.validate)(rule, value)
        answers.push({
          id: rule.id,
          title: rule.title,
          kind: rule.kind,
          properties: rule.properties || {},
          value
        })
      } catch (_) {}
      continue
    }
    ;(0, validate_1.validate)(rule, value)
    if (utils_1.helper.isEmpty(value)) {
      if (shared_types_enums_1.CHOICES_FIELD_KINDS.includes(rule.kind)) {
        value = {
          value: []
        }
      } else {
        value = ''
      }
    }
    answers.push({
      id: rule.id,
      title: rule.title,
      kind: rule.kind,
      properties: rule.properties || {},
      value
    })
  }
  return answers
}
exports.fieldValuesToAnswers = fieldValuesToAnswers
//# sourceMappingURL=field-values-to-answer.js.map

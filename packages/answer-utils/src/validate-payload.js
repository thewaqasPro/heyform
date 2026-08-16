'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.validatePayload = void 0
const shared_types_enums_1 = require('@heyform-inc/shared-types-enums')
const utils_1 = require('@heyform-inc/utils')
const OTHER_COMPARISONS = [
  shared_types_enums_1.ComparisonEnum.IS_EMPTY,
  shared_types_enums_1.ComparisonEnum.IS_NOT_EMPTY
]
function validatePayload(payload) {
  if (
    !payload.action.kind ||
    (!OTHER_COMPARISONS.includes(payload.condition.comparison) &&
      utils_1.helper.isEmpty(payload.condition.expected))
  ) {
    return false
  }
  if (payload.action.kind === shared_types_enums_1.ActionEnum.NAVIGATE) {
    return utils_1.helper.isValid(payload.action.fieldId)
  }
  return (
    utils_1.helper.isValid(payload.action.variable) &&
    utils_1.helper.isValid(payload.action.operator) &&
    utils_1.helper.isValid(payload.action.value)
  )
}
exports.validatePayload = validatePayload
//# sourceMappingURL=validate-payload.js.map

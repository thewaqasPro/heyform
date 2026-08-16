'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.calculateAction = void 0
const shared_types_enums_1 = require('@heyform-inc/shared-types-enums')
const utils_1 = require('@heyform-inc/utils')
const helper_1 = require('./helper')
function calculateAction(action, parameters, data, values) {
  if (
    utils_1.helper.isEmpty(parameters) ||
    utils_1.helper.isEmpty(data) ||
    utils_1.helper.isNil(data[action.variable])
  ) {
    return data || {}
  }
  const variable = parameters.find(v => v.id === action.variable)
  let current = data[action.variable]
  switch (variable.kind) {
    case 'string':
      current = calculateString(current, action, values)
      break
    case 'number':
      current = calculateNumber(current, action, values)
      break
  }
  return Object.assign(Object.assign({}, data), { [action.variable]: current })
}
exports.calculateAction = calculateAction
function calculateString(value, action, values) {
  let newValue = action.value
  if (action.ref) {
    newValue = values === null || values === void 0 ? void 0 : values[action.ref]
  }
  if (!utils_1.helper.isNil(newValue)) {
    switch (action.operator) {
      case shared_types_enums_1.CalculateEnum.ADDITION:
        return value + newValue
      case shared_types_enums_1.CalculateEnum.ASSIGNMENT:
        return newValue
    }
  }
  return value
}
function calculateNumber(value, action, values) {
  let newValue = action.value
  if (action.ref) {
    newValue = values === null || values === void 0 ? void 0 : values[action.ref]
  }
  if (!utils_1.helper.isNil(newValue) && (0, helper_1.isNumber)(newValue)) {
    switch (action.operator) {
      case shared_types_enums_1.CalculateEnum.ADDITION:
        return value + newValue
      case shared_types_enums_1.CalculateEnum.SUBTRACTION:
        return value - newValue
      case shared_types_enums_1.CalculateEnum.MULTIPLICATION:
        return value * newValue
      case shared_types_enums_1.CalculateEnum.DIVISION:
        return newValue !== 0 ? value / newValue : value
      case shared_types_enums_1.CalculateEnum.ASSIGNMENT:
        return newValue
    }
  }
  return value
}
//# sourceMappingURL=calculate-action.js.map

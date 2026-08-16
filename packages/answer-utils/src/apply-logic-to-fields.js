'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.applyLogicToFields = void 0
const shared_types_enums_1 = require('@heyform-inc/shared-types-enums')
const utils_1 = require('@heyform-inc/utils')
const calculate_action_1 = require('./calculate-action')
const validate_1 = require('./validate')
const validate_condition_1 = require('./validate-condition')
function indexFields(fields) {
  const parents = fields.filter(
    f => !f.parent && shared_types_enums_1.QUESTION_FIELD_KINDS.includes(f.kind)
  )
  const children = fields.filter(
    f => f.parent && shared_types_enums_1.QUESTION_FIELD_KINDS.includes(f.kind)
  )
  let index = 1
  const childrenIndexes = {}
  parents.forEach(f => {
    f.index = index++
  })
  children.forEach(f => {
    const parentId = f.parent.id
    const parent = parents.find(p => p.id === parentId)
    if (!childrenIndexes[parentId]) {
      childrenIndexes[parentId] = 1
    }
    f.parent = parent
    f.index = childrenIndexes[parentId]++
  })
}
function applyLogicToFields(fields, logics, parameters, values) {
  const result = {
    fields: [],
    variables: {}
  }
  if (utils_1.helper.isEmpty(fields)) {
    return result
  }
  if (utils_1.helper.isValid(parameters)) {
    for (const variable of parameters) {
      result.variables[variable.id] = variable.value
    }
  }
  if (utils_1.helper.isEmpty(logics) || utils_1.helper.isEmpty(values)) {
    indexFields(fields)
    return Object.assign(Object.assign({}, result), {
      fields: fields.filter(f => f.kind !== shared_types_enums_1.FieldKindEnum.THANK_YOU)
    })
  }
  let index = 0
  while (index < fields.length) {
    const field = fields[index]
    if (field.kind === shared_types_enums_1.FieldKindEnum.THANK_YOU) {
      break
    }
    let isNavigateValidated = false
    const logic = logics.find(l => l.fieldId === field.id)
    if (field.parent && result.fields.findIndex(f => f.id === field.parent.id) < 0) {
      result.fields.push(field.parent)
    }
    if (logic) {
      const { payloads } = logic
      const calculates = payloads.filter(
        p => p.action.kind === shared_types_enums_1.ActionEnum.CALCULATE
      )
      for (const calculate of calculates) {
        const { action, condition } = calculate
        const isValidated = (0, validate_condition_1.validateCondition)(field, condition, values)
        if (isValidated) {
          result.variables = (0, calculate_action_1.calculateAction)(
            action,
            parameters,
            result.variables,
            values
          )
        }
      }
      const navigates = payloads.filter(
        p => p.action.kind === shared_types_enums_1.ActionEnum.NAVIGATE
      )
      for (const navigate of navigates) {
        const { action, condition } = navigate
        field.isTouched = (0, validate_condition_1.validateCondition)(field, condition, values)
        if (field.isTouched) {
          const jumpFieldId = action.fieldId
          const jumpIndex = fields.findIndex(f => f.id === jumpFieldId)
          const isExists = !!result.fields.find(f => f.id === jumpFieldId)
          if (!isExists && jumpIndex > index) {
            index = jumpIndex
            isNavigateValidated = true
            result.fields.push(field)
            break
          }
        } else {
          field.isTouched = (0, validate_1.validateRequiredField)(field, values)
        }
      }
    }
    if (!isNavigateValidated) {
      index += 1
      result.fields.push(field)
    }
  }
  indexFields(result.fields)
  return result
}
exports.applyLogicToFields = applyLogicToFields
//# sourceMappingURL=apply-logic-to-fields.js.map

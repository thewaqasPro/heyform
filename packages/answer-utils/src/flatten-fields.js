'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.flattenFields = void 0
const shared_types_enums_1 = require('@heyform-inc/shared-types-enums')
const utils_1 = require('@heyform-inc/utils')
function flattenFields(fields, withGroup = false) {
  if (utils_1.helper.isEmpty(fields)) {
    return []
  }
  return fields.reduce((prev, curr) => {
    var _a, _b
    if (curr.kind === shared_types_enums_1.FieldKindEnum.GROUP) {
      if (withGroup) {
        const group = Object.assign(Object.assign({}, curr), {
          properties: Object.assign(Object.assign({}, curr.properties), { fields: [] })
        })
        return [
          ...prev,
          group,
          ...(((_a = curr.properties) === null || _a === void 0 ? void 0 : _a.fields) || [])
        ]
      }
      return [
        ...prev,
        ...(((_b = curr.properties) === null || _b === void 0 ? void 0 : _b.fields) || [])
      ]
    }
    return [...prev, curr]
  }, [])
}
exports.flattenFields = flattenFields
//# sourceMappingURL=flatten-fields.js.map

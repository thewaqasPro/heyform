'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const vitest_1 = require('vitest')
const src_1 = require('../src')
const fields_json_1 = tslib_1.__importDefault(require('./fixtures/fields.json'))
const values_json_1 = tslib_1.__importDefault(require('./fixtures/values.json'))
;(0, vitest_1.test)('should convert value to answer', () => {
  ;(0, vitest_1.expect)(
    (0, src_1.fieldValuesToAnswers)(fields_json_1.default, values_json_1.default)
  ).toMatchSnapshot()
})
;(0, vitest_1.test)('should convert partial submission value to answer', () => {
  ;(0, vitest_1.expect)(
    (0, src_1.fieldValuesToAnswers)(
      fields_json_1.default,
      Object.assign(Object.assign({}, values_json_1.default), { MVlZfnmjZlye: undefined }),
      true
    )
  ).toMatchSnapshot()
})
;(0, vitest_1.test)('should throw error with empty multiple choice', () => {
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.fieldValuesToAnswers)(fields_json_1.default, {
      yLxkSvkN7u2N: ''
    })
  }).toThrow('This field is required')
})
//# sourceMappingURL=convert-field-to-answer.test.js.map

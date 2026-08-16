'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const vitest_1 = require('vitest')
const src_1 = require('../src')
const fields_json_1 = tslib_1.__importDefault(require('./fixtures/fields.json'))
const values_json_1 = tslib_1.__importDefault(require('./fixtures/values.json'))
const answers = (0, src_1.fieldValuesToAnswers)(fields_json_1.default, values_json_1.default)
;(0, vitest_1.test)('should convert value to text', () => {
  ;(0, vitest_1.expect)((0, src_1.answersToPlain)(answers)).toMatchSnapshot()
})
;(0, vitest_1.test)('should convert value to html', () => {
  ;(0, vitest_1.expect)((0, src_1.answersToHtml)(answers)).toMatchSnapshot()
})
;(0, vitest_1.test)('should convert value to api object', () => {
  ;(0, vitest_1.expect)((0, src_1.answersToApiObject)(answers)).toMatchSnapshot()
})
;(0, vitest_1.test)('should convert value to json', () => {
  ;(0, vitest_1.expect)((0, src_1.answersToJson)(answers)).toMatchSnapshot()
})
;(0, vitest_1.test)('should convert value to flat json', () => {
  ;(0, vitest_1.expect)((0, src_1.answersToJson)(answers, { plain: true })).toMatchSnapshot()
})
//# sourceMappingURL=transform-answer.test.js.map

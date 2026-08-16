'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const shared_types_enums_1 = require('@heyform-inc/shared-types-enums')
const vitest_1 = require('vitest')
const src_1 = require('../src')
const field = {
  id: 'URL',
  title: 'url.test',
  kind: shared_types_enums_1.FieldKindEnum.URL
}
;(0, vitest_1.test)('correct value should be verified', () => {
  const answer = (0, src_1.fieldValuesToAnswers)(
    [Object.assign(Object.assign({}, field), { validations: { required: true } })],
    {
      URL: 'https://www.google.com'
    }
  )
  ;(0, vitest_1.expect)(answer).toMatchSnapshot()
})
;(0, vitest_1.test)('undefined value should be verified if not required', () => {
  const value = (0, src_1.fieldValuesToAnswers)(
    [Object.assign(Object.assign({}, field), { validations: { required: false } })],
    {}
  )
  ;(0, vitest_1.expect)(value).toMatchSnapshot()
})
;(0, vitest_1.test)('empty value should throw error', () => {
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.fieldValuesToAnswers)([field], {
      URL: ''
    })
  }).toThrow('Please enter a valid url')
})
;(0, vitest_1.test)('invalid value should throw error', () => {
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.fieldValuesToAnswers)([field], {
      URL: '.google.com'
    })
  }).toThrow('Please enter a valid url')
})
//# sourceMappingURL=url.test.js.map

'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const shared_types_enums_1 = require('@heyform-inc/shared-types-enums')
const vitest_1 = require('vitest')
const src_1 = require('../src')
const field = {
  id: 'PHONE_NUMBER',
  title: 'phone-number.test',
  kind: shared_types_enums_1.FieldKindEnum.PHONE_NUMBER
}
;(0, vitest_1.test)('correct value should be verified', () => {
  const answer = (0, src_1.fieldValuesToAnswers)(
    [Object.assign(Object.assign({}, field), { validations: { required: true } })],
    {
      PHONE_NUMBER: '+12015550123'
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
      PHONE_NUMBER: ''
    })
  }).toThrow('Please enter a valid mobile phone number')
})
;(0, vitest_1.test)('invalid value should throw error', () => {
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.fieldValuesToAnswers)([field], {
      PHONE_NUMBER: '+62015550123'
    })
  }).toThrow('Please enter a valid mobile phone number')
})
//# sourceMappingURL=phone-number.test.js.map

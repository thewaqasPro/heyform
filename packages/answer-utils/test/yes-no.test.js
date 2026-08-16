'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const shared_types_enums_1 = require('@heyform-inc/shared-types-enums')
const vitest_1 = require('vitest')
const src_1 = require('../src')
const field = {
  id: 'YES_NO',
  title: 'yes-no.test',
  kind: shared_types_enums_1.FieldKindEnum.YES_NO,
  properties: {
    choices: [
      {
        id: 'id_yes',
        label: 'Yes'
      },
      {
        id: 'id_no',
        label: 'No'
      }
    ]
  }
}
;(0, vitest_1.test)('correct value should be verified', () => {
  const answer = (0, src_1.fieldValuesToAnswers)(
    [Object.assign(Object.assign({}, field), { validations: { required: true } })],
    {
      YES_NO: 'id_yes'
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
      YES_NO: ''
    })
  }).toThrow('Please choose you choice')
})
;(0, vitest_1.test)('invalid value should throw error', () => {
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.fieldValuesToAnswers)([field], {
      YES_NO: 'no'
    })
  }).toThrow('Please choose you choice')
})
//# sourceMappingURL=yes-no.test.js.map

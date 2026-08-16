'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const shared_types_enums_1 = require('@heyform-inc/shared-types-enums')
const vitest_1 = require('vitest')
const src_1 = require('../src')
const field = {
  id: 'FULL_NAME',
  title: 'full_name.test',
  kind: shared_types_enums_1.FieldKindEnum.FULL_NAME
}
;(0, vitest_1.test)('correct value should be verified', () => {
  const answer = (0, src_1.fieldValuesToAnswers)(
    [Object.assign(Object.assign({}, field), { validations: { required: true } })],
    {
      FULL_NAME: {
        firstName: 'firstName',
        lastName: 'lastName'
      }
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
      FULL_NAME: {}
    })
  }).toThrow('Please enter first name')
})
;(0, vitest_1.test)('invalid value should throw error', () => {
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.fieldValuesToAnswers)([field], {
      FULL_NAME: {
        firstName: 'firstName'
      }
    })
  }).toThrow('Please enter last name')
})
;(0, vitest_1.test)('transform full name to text', () => {
  const answer = (0, src_1.fieldValuesToAnswers)(
    [Object.assign(Object.assign({}, field), { validations: { required: true } })],
    {
      FULL_NAME: {
        firstName: 'firstName',
        lastName: 'lastName'
      }
    }
  )
  ;(0, vitest_1.expect)((0, src_1.answersToPlain)(answer)).toMatchSnapshot()
})
;(0, vitest_1.test)('transform full name to html', () => {
  const answer = (0, src_1.fieldValuesToAnswers)(
    [Object.assign(Object.assign({}, field), { validations: { required: true } })],
    {
      FULL_NAME: {
        firstName: 'firstName',
        lastName: 'lastName'
      }
    }
  )
  ;(0, vitest_1.expect)((0, src_1.answersToHtml)(answer)).toMatchSnapshot()
})
//# sourceMappingURL=fullname.test.js.map

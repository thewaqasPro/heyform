'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const shared_types_enums_1 = require('@heyform-inc/shared-types-enums')
const vitest_1 = require('vitest')
const src_1 = require('../src')
const field = {
  id: 'SHORT_TEXT',
  title: 'short-text.test',
  kind: shared_types_enums_1.FieldKindEnum.SHORT_TEXT
}
;(0, vitest_1.test)('correct value should be verified', () => {
  const answer = (0, src_1.fieldValuesToAnswers)(
    [Object.assign(Object.assign({}, field), { validations: { required: true } })],
    {
      SHORT_TEXT: 'hello world'
    }
  )
  ;(0, vitest_1.expect)(answer).toMatchSnapshot()
})
;(0, vitest_1.test)('empty value should be verified if not required', () => {
  const value = (0, src_1.fieldValuesToAnswers)(
    [Object.assign(Object.assign({}, field), { validations: { required: false } })],
    {
      SHORT_TEXT: ''
    }
  )
  ;(0, vitest_1.expect)(value).toMatchSnapshot()
})
;(0, vitest_1.test)('undefined value should be verified if not required', () => {
  const value = (0, src_1.fieldValuesToAnswers)(
    [Object.assign(Object.assign({}, field), { validations: { required: false } })],
    {}
  )
  ;(0, vitest_1.expect)(value).toMatchSnapshot()
})
;(0, vitest_1.test)('should be verified if value length greater then 5', () => {
  const value = (0, src_1.fieldValuesToAnswers)(
    [
      Object.assign(Object.assign({}, field), {
        validations: {
          min: 5
        }
      })
    ],
    {
      SHORT_TEXT: 'hello world'
    }
  )
  ;(0, vitest_1.expect)(value).toMatchSnapshot()
})
;(0, vitest_1.test)('should throw error if value length less then 10', () => {
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.fieldValuesToAnswers)(
      [
        Object.assign(Object.assign({}, field), {
          validations: {
            min: 10
          }
        })
      ],
      {
        SHORT_TEXT: 'hello'
      }
    )
  }).toThrow('The text length must be between 10 to undefined')
})
//# sourceMappingURL=short-text.test.js.map

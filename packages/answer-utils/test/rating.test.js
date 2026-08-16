'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const shared_types_enums_1 = require('@heyform-inc/shared-types-enums')
const vitest_1 = require('vitest')
const src_1 = require('../src')
const field = {
  id: 'RATING',
  title: 'rating.test',
  kind: shared_types_enums_1.FieldKindEnum.RATING,
  properties: {
    total: 10
  }
}
;(0, vitest_1.test)('correct value should be verified', () => {
  const answer = (0, src_1.fieldValuesToAnswers)(
    [
      Object.assign(Object.assign({}, field), {
        validations: { required: true },
        properties: {
          total: 10
        }
      })
    ],
    {
      RATING: 5
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
;(0, vitest_1.test)('should be verified if value greater then 5', () => {
  const value = (0, src_1.fieldValuesToAnswers)(
    [
      Object.assign(Object.assign({}, field), {
        validations: {
          min: 5
        }
      })
    ],
    {
      RATING: 7
    }
  )
  ;(0, vitest_1.expect)(value).toMatchSnapshot()
})
;(0, vitest_1.test)('empty value should throw error', () => {
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.fieldValuesToAnswers)([field], {
      RATING: ''
    })
  }).toThrow('Rating value must be number')
})
;(0, vitest_1.test)('invalid number value should throw error', () => {
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.fieldValuesToAnswers)([field], {
      RATING: 'N5'
    })
  }).toThrow('Rating value must be number')
})
;(0, vitest_1.test)('should throw error if value length greater then 10', () => {
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.fieldValuesToAnswers)([field], {
      RATING: 11
    })
  }).toThrow('Rating value must be number')
})
//# sourceMappingURL=rating.test.js.map

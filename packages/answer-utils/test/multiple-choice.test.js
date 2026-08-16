'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const shared_types_enums_1 = require('@heyform-inc/shared-types-enums')
const vitest_1 = require('vitest')
const src_1 = require('../src')
const choices = [
  {
    id: 'id_a',
    label: 'A'
  },
  {
    id: 'id_b',
    label: 'B'
  },
  {
    id: 'id_c',
    label: 'C'
  }
]
const field = {
  id: 'MULTIPLE_CHOICE',
  title: 'multiple-choice.test',
  kind: shared_types_enums_1.FieldKindEnum.MULTIPLE_CHOICE,
  properties: {
    choices
  }
}
;(0, vitest_1.test)('multiple values should be verified', () => {
  const answer = (0, src_1.fieldValuesToAnswers)(
    [
      Object.assign(Object.assign({}, field), {
        validations: {
          required: true
        },
        properties: {
          choices,
          allowMultiple: true
        }
      })
    ],
    {
      MULTIPLE_CHOICE: {
        value: ['id_a', 'id_b']
      }
    }
  )
  ;(0, vitest_1.expect)(answer).toMatchSnapshot()
})
;(0, vitest_1.test)('single value should be verified', () => {
  const answer = (0, src_1.fieldValuesToAnswers)(
    [
      Object.assign(Object.assign({}, field), {
        validations: {
          required: true
        }
      })
    ],
    {
      MULTIPLE_CHOICE: {
        value: ['id_a']
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
      MULTIPLE_CHOICE: ''
    })
  }).toThrow('This field is required')
})
;(0, vitest_1.test)('value length greater then 2 should throw error', () => {
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.fieldValuesToAnswers)(
      [
        Object.assign(Object.assign({}, field), {
          properties: {
            choices,
            allowMultiple: true
          },
          validations: {
            max: 2
          }
        })
      ],
      {
        MULTIPLE_CHOICE: {
          value: ['id_a', 'id_b', 'id_c']
        }
      }
    )
  }).toThrow('Cannot select non-specified choices')
})
;(0, vitest_1.test)('multiple values should throw error', () => {
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.fieldValuesToAnswers)([field], {
      MULTIPLE_CHOICE: {
        value: ['id_a', 'id_b', 'id_c']
      }
    })
  }).toThrow('Multiple choose is not allowed')
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.fieldValuesToAnswers)(
      [
        Object.assign(Object.assign({}, field), {
          properties: {
            choices,
            allowOther: true
          }
        })
      ],
      {
        MULTIPLE_CHOICE: {
          value: ['id_a'],
          other: 'Other answer'
        }
      }
    )
  }).toThrow('Multiple choose is not allowed')
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.fieldValuesToAnswers)(
      [
        Object.assign(Object.assign({}, field), {
          properties: {
            choices,
            allowOther: true
          }
        })
      ],
      {
        MULTIPLE_CHOICE: {
          value: ['id_C']
        }
      }
    )
  }).toThrow('Cannot select non-specified choices')
})
;(0, vitest_1.test)('invalid value should throw error', () => {
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.fieldValuesToAnswers)([field], {
      MULTIPLE_CHOICE: {
        value: ['id_Z']
      }
    })
  }).toThrow('Cannot select non-specified choices')
})
;(0, vitest_1.test)('other value should throw error', () => {
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.fieldValuesToAnswers)([field], {
      MULTIPLE_CHOICE: {
        other: 'Other answer'
      }
    })
  }).toThrow('Other value is not allowed')
})
;(0, vitest_1.test)('multiple values with other should be verified', () => {
  const answer = (0, src_1.fieldValuesToAnswers)(
    [
      Object.assign(Object.assign({}, field), {
        validations: {
          required: true
        },
        properties: {
          choices,
          allowMultiple: true,
          allowOther: true
        }
      })
    ],
    {
      MULTIPLE_CHOICE: {
        value: ['id_a', 'id_b'],
        other: 'Other answer'
      }
    }
  )
  ;(0, vitest_1.expect)(answer).toMatchSnapshot()
})
;(0, vitest_1.test)('other value should throw error', () => {
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.fieldValuesToAnswers)([field], {
      MULTIPLE_CHOICE: {
        value: [],
        other: 'Other answer'
      }
    })
  }).toThrow('Other value is not allowed')
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.fieldValuesToAnswers)([field], {
      MULTIPLE_CHOICE: {
        value: ['id_a'],
        other: 'Other answer'
      }
    })
  }).toThrow('Other value is not allowed')
})
;(0, vitest_1.test)('single value with other should be verified', () => {
  const answer = (0, src_1.fieldValuesToAnswers)(
    [
      Object.assign(Object.assign({}, field), {
        validations: {
          required: true
        },
        properties: {
          choices,
          allowOther: true
        }
      })
    ],
    {
      MULTIPLE_CHOICE: {
        other: 'Other answer'
      }
    }
  )
  ;(0, vitest_1.expect)(answer).toMatchSnapshot()
})
//# sourceMappingURL=multiple-choice.test.js.map

'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const shared_types_enums_1 = require('@heyform-inc/shared-types-enums')
const vitest_1 = require('vitest')
const src_1 = require('../src')
;(0, vitest_1.test)('validate text condition', () => {
  const field = {
    id: 'id_short_text',
    title: 'Short Text',
    kind: shared_types_enums_1.FieldKindEnum.SHORT_TEXT
  }
  const values = {
    id_short_text: 'This is probably a dog.'
  }
  const comparisons = [
    { comparison: shared_types_enums_1.ComparisonEnum.IS, expected: values.id_short_text, values },
    { comparison: shared_types_enums_1.ComparisonEnum.IS_NOT, expected: 'invalid_value', values },
    {
      comparison: shared_types_enums_1.ComparisonEnum.CONTAINS,
      expected: 'dog',
      values
    },
    {
      comparison: shared_types_enums_1.ComparisonEnum.DOES_NOT_CONTAIN,
      expected: 'cat',
      values
    },
    {
      comparison: shared_types_enums_1.ComparisonEnum.STARTS_WITH,
      expected: 'This',
      values
    },
    {
      comparison: shared_types_enums_1.ComparisonEnum.ENDS_WITH,
      expected: 'dog.',
      values
    }
  ]
  for (const comparison of comparisons) {
    ;(0, vitest_1.expect)((0, src_1.validateCondition)(field, comparison, comparison.values)).toBe(
      true
    )
  }
})
;(0, vitest_1.test)('validate legal terms condition', () => {
  const field = {
    id: 'id_legal_terms',
    title: 'Legal terms',
    kind: shared_types_enums_1.FieldKindEnum.LEGAL_TERMS
  }
  const values = {
    id_legal_terms: true
  }
  const comparisons = [
    {
      comparison: shared_types_enums_1.ComparisonEnum.IS,
      expected: values.id_legal_terms,
      values
    },
    {
      comparison: shared_types_enums_1.ComparisonEnum.IS_NOT,
      expected: values.id_legal_terms,
      values: {
        id_legal_terms: false
      }
    }
  ]
  for (const comparison of comparisons) {
    ;(0, vitest_1.expect)((0, src_1.validateCondition)(field, comparison, comparison.values)).toBe(
      true
    )
  }
})
;(0, vitest_1.test)('validate single choice condition', () => {
  const field = {
    id: 'id_single_choice',
    title: 'Single choice',
    kind: shared_types_enums_1.FieldKindEnum.MULTIPLE_CHOICE,
    properties: {
      choices: [
        {
          id: '_a',
          label: 'A'
        },
        {
          id: '_b',
          label: 'B'
        },
        {
          id: '_c',
          label: 'C'
        }
      ]
    }
  }
  const values = {
    id_single_choice: {
      value: ['_b']
    }
  }
  const comparisons = [
    {
      comparison: shared_types_enums_1.ComparisonEnum.IS,
      expected: values.id_single_choice.value[0],
      values
    },
    {
      comparison: shared_types_enums_1.ComparisonEnum.IS_NOT,
      expected: values.id_single_choice.value[0],
      values: {
        id_single_choice: {
          value: ['_c']
        }
      }
    }
  ]
  for (const comparison of comparisons) {
    ;(0, vitest_1.expect)((0, src_1.validateCondition)(field, comparison, comparison.values)).toBe(
      true
    )
  }
})
;(0, vitest_1.test)('validate single choice with other condition', () => {
  const field = {
    id: 'id_single_choice',
    title: 'Single choice',
    kind: shared_types_enums_1.FieldKindEnum.MULTIPLE_CHOICE,
    properties: {
      allowOther: true,
      choices: [
        {
          id: '_a',
          label: 'A'
        },
        {
          id: '_b',
          label: 'B'
        },
        {
          id: '_c',
          label: 'C'
        }
      ]
    }
  }
  const values = {
    id_single_choice: {
      other: 'Other'
    }
  }
  const comparisons = [
    {
      comparison: shared_types_enums_1.ComparisonEnum.IS,
      expected: values.id_single_choice.other,
      values
    },
    {
      comparison: shared_types_enums_1.ComparisonEnum.IS_NOT,
      expected: values.id_single_choice.other,
      values: {
        id_single_choice: {
          value: ['_c']
        }
      }
    }
  ]
  for (const comparison of comparisons) {
    ;(0, vitest_1.expect)((0, src_1.validateCondition)(field, comparison, comparison.values)).toBe(
      true
    )
  }
})
;(0, vitest_1.test)('validate multiple choice condition', () => {
  const field = {
    id: 'id_multiple_choice',
    title: 'Multiple choice',
    kind: shared_types_enums_1.FieldKindEnum.MULTIPLE_CHOICE,
    properties: {
      allowMultiple: true,
      choices: [
        {
          id: '_a',
          label: 'A'
        },
        {
          id: '_b',
          label: 'B'
        },
        {
          id: '_c',
          label: 'C'
        }
      ]
    }
  }
  const values = {
    id_multiple_choice: {
      value: ['_a', '_c']
    }
  }
  const comparisons = [
    {
      comparison: shared_types_enums_1.ComparisonEnum.IS,
      expected: values.id_multiple_choice.value,
      values
    },
    {
      comparison: shared_types_enums_1.ComparisonEnum.IS_NOT,
      expected: values.id_multiple_choice.value,
      values: {
        id_multiple_choice: {
          value: ['_b']
        }
      }
    },
    {
      comparison: shared_types_enums_1.ComparisonEnum.CONTAINS,
      expected: ['_c'],
      values
    },
    {
      comparison: shared_types_enums_1.ComparisonEnum.DOES_NOT_CONTAIN,
      expected: ['_b'],
      values
    }
  ]
  for (const comparison of comparisons) {
    ;(0, vitest_1.expect)((0, src_1.validateCondition)(field, comparison, comparison.values)).toBe(
      true
    )
  }
})
;(0, vitest_1.test)('validate multiple choice condition with undefined', () => {
  const field = {
    id: 'id_multiple_choice',
    title: 'Multiple choice',
    kind: shared_types_enums_1.FieldKindEnum.MULTIPLE_CHOICE,
    properties: {
      allowMultiple: true,
      choices: [
        {
          id: '_a',
          label: 'A'
        },
        {
          id: '_b',
          label: 'B'
        },
        {
          id: '_c',
          label: 'C'
        }
      ]
    }
  }
  const values = {
    id_multiple_choice: undefined
  }
  const comparisons = [
    {
      comparison: shared_types_enums_1.ComparisonEnum.CONTAINS,
      expected: ['_c'],
      values
    }
  ]
  for (const comparison of comparisons) {
    ;(0, vitest_1.expect)((0, src_1.validateCondition)(field, comparison, comparison.values)).toBe(
      false
    )
  }
})
;(0, vitest_1.test)('validate multiple choice with other condition', () => {
  const field = {
    id: 'id_multiple_choice',
    title: 'Multiple choice',
    kind: shared_types_enums_1.FieldKindEnum.MULTIPLE_CHOICE,
    properties: {
      allowMultiple: true,
      allowOther: true,
      choices: [
        {
          id: '_a',
          label: 'A'
        },
        {
          id: '_b',
          label: 'B'
        },
        {
          id: '_c',
          label: 'C'
        }
      ]
    }
  }
  const values = {
    id_multiple_choice: {
      value: ['_a', '_c'],
      other: 'Other'
    }
  }
  const comparisons = [
    {
      comparison: shared_types_enums_1.ComparisonEnum.IS,
      expected: [...values.id_multiple_choice.value, values.id_multiple_choice.other],
      values
    },
    {
      comparison: shared_types_enums_1.ComparisonEnum.IS_NOT,
      expected: [...values.id_multiple_choice.value, values.id_multiple_choice.other],
      values: {
        id_multiple_choice: {
          value: ['_b']
        }
      }
    },
    {
      comparison: shared_types_enums_1.ComparisonEnum.CONTAINS,
      expected: ['_c'],
      values
    },
    {
      comparison: shared_types_enums_1.ComparisonEnum.CONTAINS,
      expected: ['Other'],
      values
    },
    {
      comparison: shared_types_enums_1.ComparisonEnum.DOES_NOT_CONTAIN,
      expected: ['_b'],
      values
    }
  ]
  for (const comparison of comparisons) {
    ;(0, vitest_1.expect)((0, src_1.validateCondition)(field, comparison, comparison.values)).toBe(
      true
    )
  }
})
;(0, vitest_1.test)('validate date condition', () => {
  const field = {
    id: 'id_date',
    title: 'Date',
    kind: shared_types_enums_1.FieldKindEnum.DATE,
    properties: {
      format: 'YYYY-MM-DD'
    }
  }
  const values = {
    id_date: '2020-01-01'
  }
  const comparisons = [
    {
      comparison: shared_types_enums_1.ComparisonEnum.IS,
      expected: values.id_date,
      values
    },
    {
      comparison: shared_types_enums_1.ComparisonEnum.IS_NOT,
      expected: values.id_date,
      values: {
        id_date: '1990-01-01'
      }
    },
    {
      comparison: shared_types_enums_1.ComparisonEnum.IS_BEFORE,
      expected: values.id_date,
      values: {
        id_date: '1990-01-01'
      }
    },
    {
      comparison: shared_types_enums_1.ComparisonEnum.IS_AFTER,
      expected: values.id_date,
      values: {
        id_date: '2020-08-08'
      }
    }
  ]
  for (const comparison of comparisons) {
    ;(0, vitest_1.expect)((0, src_1.validateCondition)(field, comparison, comparison.values)).toBe(
      true
    )
  }
})
;(0, vitest_1.test)('validate number condition', () => {
  const field = {
    id: 'id_number',
    title: 'Number',
    kind: shared_types_enums_1.FieldKindEnum.NUMBER
  }
  const values = {
    id_number: 10
  }
  const comparisons = [
    { comparison: shared_types_enums_1.ComparisonEnum.EQUAL, expected: values.id_number, values },
    {
      comparison: shared_types_enums_1.ComparisonEnum.NOT_EQUAL,
      expected: 30,
      values
    },
    {
      comparison: shared_types_enums_1.ComparisonEnum.GREATER_THAN,
      expected: 5,
      values
    },
    {
      comparison: shared_types_enums_1.ComparisonEnum.LESS_THAN,
      expected: 20,
      values
    },
    {
      comparison: shared_types_enums_1.ComparisonEnum.GREATER_OR_EQUAL_THAN,
      expected: 10,
      values
    },
    {
      comparison: shared_types_enums_1.ComparisonEnum.LESS_OR_EQUAL_THAN,
      expected: 10,
      values
    }
  ]
  for (const comparison of comparisons) {
    ;(0, vitest_1.expect)((0, src_1.validateCondition)(field, comparison, comparison.values)).toBe(
      true
    )
  }
})
//# sourceMappingURL=validate-condition.test.js.map

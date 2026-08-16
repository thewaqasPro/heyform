'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const shared_types_enums_1 = require('@heyform-inc/shared-types-enums')
const vitest_1 = require('vitest')
const src_1 = require('../src')
const fields = [
  {
    id: 'id_short_text',
    title: 'Short Text',
    kind: shared_types_enums_1.FieldKindEnum.SHORT_TEXT
  },
  {
    id: 'id_statement',
    title: 'Statement',
    kind: shared_types_enums_1.FieldKindEnum.STATEMENT
  },
  {
    id: 'id_number',
    title: 'Number',
    kind: shared_types_enums_1.FieldKindEnum.NUMBER
  },
  {
    id: 'id_statement2',
    title: 'Statement2',
    kind: shared_types_enums_1.FieldKindEnum.STATEMENT
  },
  {
    id: 'id_date',
    title: 'Date',
    kind: shared_types_enums_1.FieldKindEnum.DATE
  }
]
const logics = [
  {
    fieldId: 'id_short_text',
    payloads: [
      {
        id: 'p1',
        condition: {
          comparison: shared_types_enums_1.ComparisonEnum.CONTAINS,
          expected: 'kitty'
        },
        action: {
          kind: shared_types_enums_1.ActionEnum.NAVIGATE,
          fieldId: fields[2].id
        }
      }
    ]
  },
  {
    fieldId: 'id_number',
    payloads: [
      {
        id: 'p2',
        condition: {
          comparison: shared_types_enums_1.ComparisonEnum.EQUAL,
          expected: 5
        },
        action: {
          kind: shared_types_enums_1.ActionEnum.NAVIGATE,
          fieldId: fields[fields.length - 1].id
        }
      }
    ]
  }
]
const variables = [
  {
    id: 'number_var',
    name: 'Score',
    kind: 'number',
    value: 0
  },
  {
    id: 'string_var',
    name: 'Name',
    kind: 'string',
    value: 'Your name is: '
  }
]
;(0, vitest_1.test)('apply to fields with matched values', () => {
  const result = (0, src_1.applyLogicToFields)(fields, logics, undefined, {
    id_short_text: 'hello kitty',
    id_number: 5
  })
  ;(0, vitest_1.expect)(result.fields.map(f => f.id)).toStrictEqual(
    fields.filter(f => f.kind !== shared_types_enums_1.FieldKindEnum.STATEMENT).map(f => f.id)
  )
})
;(0, vitest_1.test)('apply to fields with matched text value', () => {
  const result = (0, src_1.applyLogicToFields)(fields, logics, undefined, {
    id_short_text: 'hello kitty'
  })
  ;(0, vitest_1.expect)(result.fields.map(f => f.id)).toStrictEqual(
    fields.filter(f => f.id !== 'id_statement').map(f => f.id)
  )
})
;(0, vitest_1.test)('apply to fields with matched number value', () => {
  const result = (0, src_1.applyLogicToFields)(fields, logics, undefined, {
    id_number: 5
  })
  ;(0, vitest_1.expect)(result.fields.map(f => f.id)).toStrictEqual(
    fields.filter(f => f.id !== 'id_statement2').map(f => f.id)
  )
})
;(0, vitest_1.test)('apply to fields with unmatched values', () => {
  const result = (0, src_1.applyLogicToFields)(fields, logics, undefined, {
    id_short_text: 'hello world',
    id_number: 10
  })
  ;(0, vitest_1.expect)(result.fields.map(f => f.id)).toStrictEqual(fields.map(f => f.id))
})
;(0, vitest_1.test)('apply to fields with empty values', () => {
  const result = (0, src_1.applyLogicToFields)(fields, logics)
  ;(0, vitest_1.expect)(result.fields.map(f => f.id)).toStrictEqual(fields.map(f => f.id))
})
;(0, vitest_1.test)('apply to fields without logics', () => {
  const result = (0, src_1.applyLogicToFields)(fields, undefined, undefined, {
    id_short_text: 'hello kitty'
  })
  ;(0, vitest_1.expect)(result.fields.map(f => f.id)).toStrictEqual(fields.map(f => f.id))
})
;(0, vitest_1.test)('apply to fields with empty fields', () => {
  const result = (0, src_1.applyLogicToFields)([], logics, undefined, {
    id_short_text: 'hello world',
    id_number: 10
  })
  ;(0, vitest_1.expect)(result.fields.map(f => f.id)).toStrictEqual([])
})
;(0, vitest_1.test)('apply to fields with circular navigate logics', () => {
  const _logics = [
    logics[0],
    {
      fieldId: 'id_number',
      payloads: [
        {
          id: 'p2',
          condition: {
            comparison: shared_types_enums_1.ComparisonEnum.EQUAL,
            expected: 5
          },
          action: {
            kind: shared_types_enums_1.ActionEnum.NAVIGATE,
            fieldId: fields[0].id
          }
        }
      ]
    }
  ]
  const result = (0, src_1.applyLogicToFields)(fields, _logics, undefined, {
    id_short_text: 'hello kitty',
    id_number: 5
  })
  ;(0, vitest_1.expect)(result.fields.map(f => f.id)).toStrictEqual(
    fields.filter(f => f.id !== 'id_statement').map(f => f.id)
  )
})
;(0, vitest_1.test)('apply to fields with variables', () => {
  const _logics = [
    {
      fieldId: 'id_short_text',
      payloads: [
        {
          id: 'p1',
          condition: {
            comparison: shared_types_enums_1.ComparisonEnum.CONTAINS,
            expected: 'kitty'
          },
          action: {
            kind: shared_types_enums_1.ActionEnum.NAVIGATE,
            fieldId: fields[2].id
          }
        },
        {
          id: 'p2',
          condition: {
            comparison: shared_types_enums_1.ComparisonEnum.ENDS_WITH,
            expected: 'kitty'
          },
          action: {
            kind: shared_types_enums_1.ActionEnum.CALCULATE,
            variable: 'number_var',
            operator: shared_types_enums_1.CalculateEnum.ADDITION,
            value: 2
          }
        },
        {
          id: 'p3',
          condition: {
            comparison: shared_types_enums_1.ComparisonEnum.STARTS_WITH,
            expected: 'hello'
          },
          action: {
            kind: shared_types_enums_1.ActionEnum.CALCULATE,
            variable: 'string_var',
            operator: shared_types_enums_1.CalculateEnum.ADDITION,
            ref: 'id_short_text'
          }
        },
        {
          id: 'p5',
          condition: {
            comparison: shared_types_enums_1.ComparisonEnum.IS_NOT_EMPTY
          },
          action: {
            kind: shared_types_enums_1.ActionEnum.CALCULATE,
            variable: 'string_var2',
            operator: shared_types_enums_1.CalculateEnum.ASSIGNMENT,
            value: 'catting'
          }
        }
      ]
    },
    {
      fieldId: 'id_number',
      payloads: [
        {
          id: 'p4',
          condition: {
            comparison: shared_types_enums_1.ComparisonEnum.EQUAL,
            expected: 5
          },
          action: {
            kind: shared_types_enums_1.ActionEnum.CALCULATE,
            variable: 'number_var',
            operator: shared_types_enums_1.CalculateEnum.MULTIPLICATION,
            value: 5
          }
        }
      ]
    }
  ]
  const result = (0, src_1.applyLogicToFields)(fields, _logics, variables, {
    id_short_text: 'hello kitty',
    id_number: 5
  })
  ;(0, vitest_1.expect)(result.fields.map(f => f.id)).toStrictEqual(
    fields.filter(f => f.id !== 'id_statement').map(f => f.id)
  )
  ;(0, vitest_1.expect)(result.variables).toStrictEqual({
    number_var: 10,
    string_var: 'Your name is: hello kitty'
  })
})
;(0, vitest_1.test)('apply to group fields', () => {
  const _fields = [
    {
      id: 'id_short_text',
      title: 'Short Text',
      kind: shared_types_enums_1.FieldKindEnum.SHORT_TEXT
    },
    {
      id: 'id_group',
      title: 'Group',
      kind: shared_types_enums_1.FieldKindEnum.GROUP
    },
    {
      id: 'id_statement',
      title: 'Statement',
      kind: shared_types_enums_1.FieldKindEnum.STATEMENT,
      parent: {
        id: 'id_group',
        title: 'Group',
        kind: shared_types_enums_1.FieldKindEnum.GROUP
      }
    },
    {
      id: 'id_number',
      title: 'Number',
      kind: shared_types_enums_1.FieldKindEnum.NUMBER,
      parent: {
        id: 'id_group',
        title: 'Group',
        kind: shared_types_enums_1.FieldKindEnum.GROUP
      }
    },
    {
      id: 'id_statement2',
      title: 'Statement2',
      kind: shared_types_enums_1.FieldKindEnum.STATEMENT,
      parent: {
        id: 'id_group',
        title: 'Group',
        kind: shared_types_enums_1.FieldKindEnum.GROUP
      }
    },
    {
      id: 'id_date',
      title: 'Date',
      kind: shared_types_enums_1.FieldKindEnum.DATE
    }
  ]
  const _logics = [
    {
      fieldId: 'id_short_text',
      payloads: [
        {
          id: 'p1',
          condition: {
            comparison: shared_types_enums_1.ComparisonEnum.CONTAINS,
            expected: 'kitty'
          },
          action: {
            kind: shared_types_enums_1.ActionEnum.NAVIGATE,
            fieldId: 'id_number'
          }
        }
      ]
    }
  ]
  const result = (0, src_1.applyLogicToFields)(_fields, _logics, undefined, {
    id_short_text: 'hello kitty'
  })
  ;(0, vitest_1.expect)(result.fields.map(f => f.id)).toStrictEqual(
    _fields.filter(f => f.id !== 'id_statement').map(f => f.id)
  )
  ;(0, vitest_1.expect)(result.fields).toMatchSnapshot()
  const result2 = (0, src_1.applyLogicToFields)(_fields, _logics, undefined, {
    id_short_text: 'hello world'
  })
  ;(0, vitest_1.expect)(result2.fields[0].isTouched).toBe(true)
  const result3 = (0, src_1.applyLogicToFields)(_fields, _logics, undefined, {
    id_short_text: undefined
  })
  ;(0, vitest_1.expect)(result3.fields[0].isTouched).toBe(false)
  const result4 = (0, src_1.applyLogicToFields)(_fields, _logics, undefined, {
    id_short_text: ''
  })
  ;(0, vitest_1.expect)(result4.fields[0].isTouched).toBe(false)
})
;(0, vitest_1.test)('apply to fields with thank you page', () => {
  const fields = [
    {
      id: 'id_short_text',
      title: 'Short Text',
      kind: shared_types_enums_1.FieldKindEnum.SHORT_TEXT
    },
    {
      id: 'id_statement',
      title: 'Statement',
      kind: shared_types_enums_1.FieldKindEnum.STATEMENT
    },
    {
      id: 'id_thank_you',
      title: 'Thank You',
      kind: shared_types_enums_1.FieldKindEnum.THANK_YOU
    }
  ]
  const logics = [
    {
      fieldId: 'id_short_text',
      payloads: [
        {
          id: 'p1',
          condition: {
            comparison: shared_types_enums_1.ComparisonEnum.CONTAINS,
            expected: 'kitty'
          },
          action: {
            kind: shared_types_enums_1.ActionEnum.NAVIGATE,
            fieldId: 'id_thank_you'
          }
        }
      ]
    }
  ]
  const result = (0, src_1.applyLogicToFields)(fields, logics, undefined, {
    id_short_text: 'hello kitty'
  })
  ;(0, vitest_1.expect)(result.fields.length).toBe(1)
  ;(0, vitest_1.expect)(result.fields[0].id).toBe(fields[0].id)
})
//# sourceMappingURL=apply-logic-to-fields.test.js.map

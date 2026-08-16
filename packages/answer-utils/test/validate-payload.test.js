'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const shared_types_enums_1 = require('@heyform-inc/shared-types-enums')
const vitest_1 = require('vitest')
const validate_payload_1 = require('../src/validate-payload')
;(0, vitest_1.test)('validate navigate payload', () => {
  const payloads = [
    {
      id: 'p1',
      condition: {
        comparison: shared_types_enums_1.ComparisonEnum.ENDS_WITH,
        expected: 'hello'
      },
      action: {
        kind: shared_types_enums_1.ActionEnum.NAVIGATE,
        fieldId: 'field_id'
      }
    },
    {
      id: 'p1',
      condition: {
        comparison: shared_types_enums_1.ComparisonEnum.IS_EMPTY
      },
      action: {
        kind: shared_types_enums_1.ActionEnum.NAVIGATE,
        fieldId: 'field_id'
      }
    },
    {
      id: 'p1',
      condition: {
        comparison: shared_types_enums_1.ComparisonEnum.ENDS_WITH
      },
      action: {
        kind: shared_types_enums_1.ActionEnum.NAVIGATE,
        fieldId: 'field_id'
      }
    },
    {
      id: 'p1',
      condition: {
        comparison: shared_types_enums_1.ComparisonEnum.ENDS_WITH,
        expected: 'hello'
      },
      action: {
        kind: shared_types_enums_1.ActionEnum.NAVIGATE
      }
    },
    {
      id: 'p1',
      condition: {
        comparison: shared_types_enums_1.ComparisonEnum.IS_EMPTY
      },
      action: {
        kind: shared_types_enums_1.ActionEnum.NAVIGATE
      }
    },
    {
      id: 'p1',
      condition: {
        comparison: shared_types_enums_1.ComparisonEnum.ENDS_WITH
      },
      action: {
        kind: shared_types_enums_1.ActionEnum.NAVIGATE,
        fieldId: ''
      }
    },
    {
      id: 'p1',
      condition: {
        comparison: shared_types_enums_1.ComparisonEnum.ENDS_WITH,
        expected: 'hello'
      },
      action: {
        fieldId: 'field_id'
      }
    }
  ]
  const result = payloads.map(validate_payload_1.validatePayload)
  ;(0, vitest_1.expect)(result).toStrictEqual([true, true, false, false, false, false, false])
})
;(0, vitest_1.test)('validate calculate payload', () => {
  const payloads = [
    {
      id: 'p1',
      condition: {
        comparison: shared_types_enums_1.ComparisonEnum.ENDS_WITH,
        expected: 'hello'
      },
      action: {
        kind: shared_types_enums_1.ActionEnum.CALCULATE,
        variable: 'variable_id',
        operator: shared_types_enums_1.CalculateEnum.ADDITION,
        value: 1
      }
    },
    {
      id: 'p1',
      condition: {
        comparison: shared_types_enums_1.ComparisonEnum.IS_EMPTY
      },
      action: {
        kind: shared_types_enums_1.ActionEnum.CALCULATE,
        variable: 'variable_id',
        operator: shared_types_enums_1.CalculateEnum.ADDITION,
        value: 1
      }
    },
    {
      id: 'p1',
      condition: {
        comparison: shared_types_enums_1.ComparisonEnum.ENDS_WITH
      },
      action: {
        kind: shared_types_enums_1.ActionEnum.CALCULATE,
        variable: 'variable_id',
        operator: shared_types_enums_1.CalculateEnum.ADDITION,
        value: 1
      }
    },
    {
      id: 'p1',
      condition: {
        comparison: shared_types_enums_1.ComparisonEnum.ENDS_WITH,
        expected: 'hello'
      },
      action: {
        kind: shared_types_enums_1.ActionEnum.CALCULATE,
        operator: shared_types_enums_1.CalculateEnum.ADDITION,
        value: 1
      }
    },
    {
      id: 'p1',
      condition: {
        comparison: shared_types_enums_1.ComparisonEnum.ENDS_WITH,
        expected: 'hello'
      },
      action: {
        kind: shared_types_enums_1.ActionEnum.CALCULATE,
        operator: shared_types_enums_1.CalculateEnum.ADDITION,
        value: 1
      }
    },
    {
      id: 'p1',
      condition: {
        comparison: shared_types_enums_1.ComparisonEnum.ENDS_WITH
      },
      action: {
        kind: shared_types_enums_1.ActionEnum.CALCULATE,
        variable: 'variable_id',
        value: 1
      }
    },
    {
      id: 'p1',
      condition: {
        comparison: shared_types_enums_1.ComparisonEnum.ENDS_WITH
      },
      action: {
        kind: shared_types_enums_1.ActionEnum.CALCULATE,
        variable: 'variable_id',
        operator: shared_types_enums_1.CalculateEnum.ADDITION
      }
    }
  ]
  const result = payloads.map(validate_payload_1.validatePayload)
  ;(0, vitest_1.expect)(result).toStrictEqual([true, true, false, false, false, false, false])
})
//# sourceMappingURL=validate-payload.test.js.map

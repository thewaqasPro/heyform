'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const vitest_1 = require('vitest')
const src_1 = require('../src')
const fields_json_1 = tslib_1.__importDefault(require('./fixtures/fields.json'))
;(0, vitest_1.test)('should flatten fields', () => {
  ;(0, vitest_1.expect)((0, src_1.flattenFields)(fields_json_1.default)).toMatchSnapshot()
})
;(0, vitest_1.test)('should flatten fields with group', () => {
  const rawFields = [
    {
      properties: {
        fields: [
          {
            id: 'sub1',
            kind: 'multiple_choice'
          }
        ]
      },
      id: 'grp1',
      kind: 'group'
    },
    {
      id: 'txt1',
      kind: 'text'
    }
  ]
  ;(0, vitest_1.expect)((0, src_1.flattenFields)(rawFields).map(f => f.id)).toStrictEqual([
    'sub1',
    'txt1'
  ])
  ;(0, vitest_1.expect)((0, src_1.flattenFields)(rawFields, true).map(f => f.id)).toStrictEqual([
    'grp1',
    'sub1',
    'txt1'
  ])
})
//# sourceMappingURL=flatten-fields.test.js.map

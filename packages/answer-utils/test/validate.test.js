'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const shared_types_enums_1 = require('@heyform-inc/shared-types-enums')
const vitest_1 = require('vitest')
const src_1 = require('../src')
;(0, vitest_1.test)('short text', () => {
  const field = {
    validations: {
      required: true
    },
    id: 'SHORT_TEXT',
    title: 'SHORT_TEXT',
    kind: shared_types_enums_1.FieldKindEnum.SHORT_TEXT
  }
  const rules = (0, src_1.fieldsToValidateRules)([field])
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], undefined)
  }).toThrowError()
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], '')
  }).toThrowError()
  ;(0, vitest_1.expect)((0, src_1.validate)(rules[0], 'hello world')).toBe(undefined)
})
;(0, vitest_1.test)('number', () => {
  const field = {
    validations: {
      required: true
    },
    id: 'NUMBER',
    title: 'NUMBER',
    kind: shared_types_enums_1.FieldKindEnum.NUMBER
  }
  const rules = (0, src_1.fieldsToValidateRules)([field])
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], undefined)
  }).toThrowError()
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], 'hello')
  }).toThrowError()
  ;(0, vitest_1.expect)((0, src_1.validate)(rules[0], 1)).toBe(undefined)
})
;(0, vitest_1.test)('yes or no', () => {
  const field = {
    validations: {
      required: true
    },
    properties: {
      choices: [
        {
          id: 'adUm2Hhr1OOW',
          label: 'Yes'
        },
        {
          id: 'QMR1nZV0u84M',
          label: 'No'
        }
      ]
    },
    id: 'YES_NO',
    title: 'YES_NO',
    kind: shared_types_enums_1.FieldKindEnum.YES_NO
  }
  const rules = (0, src_1.fieldsToValidateRules)([field])
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], undefined)
  }).toThrowError()
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], 'hello')
  }).toThrowError()
  ;(0, vitest_1.expect)((0, src_1.validate)(rules[0], 'adUm2Hhr1OOW')).toBe(undefined)
  ;(0, vitest_1.expect)((0, src_1.validate)(rules[0], 'QMR1nZV0u84M')).toBe(undefined)
})
;(0, vitest_1.test)('dropdown', () => {
  const field = {
    validations: {
      required: true
    },
    properties: {
      choices: [
        {
          id: 'adUm2Hhr1OOW',
          label: 'Yes'
        },
        {
          id: 'QMR1nZV0u84M',
          label: 'No'
        }
      ]
    },
    id: 'DROPDOWN',
    title: 'DROPDOWN',
    kind: shared_types_enums_1.FieldKindEnum.MULTIPLE_CHOICE
  }
  const rules = (0, src_1.fieldsToValidateRules)([field])
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], undefined)
  }).toThrowError()
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], 'hello')
  }).toThrowError()
  ;(0, vitest_1.expect)((0, src_1.validate)(rules[0], { value: ['adUm2Hhr1OOW'] })).toBe(undefined)
  ;(0, vitest_1.expect)((0, src_1.validate)(rules[0], { value: ['QMR1nZV0u84M'] })).toBe(undefined)
})
;(0, vitest_1.test)('multiple choice', () => {
  const field = {
    validations: {
      required: true
    },
    properties: {
      allowMultiple: false,
      choices: [
        {
          id: 'adUm2Hhr1OOW',
          label: 'Yes'
        },
        {
          id: 'QMR1nZV0u84M',
          label: 'No'
        }
      ]
    },
    id: 'MULTIPLE_CHOICE',
    title: 'MULTIPLE_CHOICE',
    kind: shared_types_enums_1.FieldKindEnum.MULTIPLE_CHOICE
  }
  const rules = (0, src_1.fieldsToValidateRules)([field])
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], undefined)
  }).toThrowError()
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], 'hello')
  }).toThrowError()
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], { value: ['hello'] })
  }).toThrowError()
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], { other: 'hello' })
  }).toThrowError()
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], { value: ['adUm2Hhr1OOW', 'QMR1nZV0u84M'] })
  }).toThrowError()
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], { value: ['hello', 'world'] })
  }).toThrowError()
  ;(0, vitest_1.expect)((0, src_1.validate)(rules[0], { value: ['adUm2Hhr1OOW'] })).toBe(undefined)
  ;(0, vitest_1.expect)((0, src_1.validate)(rules[0], { value: ['QMR1nZV0u84M'] })).toBe(undefined)
})
;(0, vitest_1.test)('multiple choice', () => {
  const field = {
    validations: {
      required: true,
      min: 2,
      max: 3
    },
    properties: {
      allowMultiple: true,
      choices: [
        {
          id: 'm2Hhr1OadUOW',
          label: 'Yes'
        },
        {
          id: 'u84MQMR1nZV0',
          label: 'No'
        },
        {
          id: 'adUm2Hhr1OOW',
          label: 'Yes'
        },
        {
          id: 'QMR1nZV0u84M',
          label: 'No'
        }
      ]
    },
    id: 'MULTIPLE_CHOICE',
    title: 'MULTIPLE_CHOICE',
    kind: shared_types_enums_1.FieldKindEnum.MULTIPLE_CHOICE
  }
  const rules = (0, src_1.fieldsToValidateRules)([field])
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], { value: ['u84MQMR1nZV0'] })
  }).toThrowError()
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], {
      value: ['m2Hhr1OadUOW', 'u84MQMR1nZV0', 'adUm2Hhr1OOW', 'QMR1nZV0u84M']
    })
  }).toThrowError()
  ;(0, vitest_1.expect)(
    (0, src_1.validate)(rules[0], { value: ['m2Hhr1OadUOW', 'u84MQMR1nZV0'] })
  ).toBe(undefined)
  ;(0, vitest_1.expect)(
    (0, src_1.validate)(rules[0], {
      value: ['m2Hhr1OadUOW', 'u84MQMR1nZV0', 'adUm2Hhr1OOW']
    })
  ).toBe(undefined)
})
;(0, vitest_1.test)('single choice', () => {
  const field = {
    validations: {
      required: true
    },
    properties: {
      allowMultiple: false,
      choices: [
        {
          id: 'm2Hhr1OadUOW',
          label: 'Yes'
        },
        {
          id: 'u84MQMR1nZV0',
          label: 'No'
        },
        {
          id: 'adUm2Hhr1OOW',
          label: 'Yes'
        },
        {
          id: 'QMR1nZV0u84M',
          label: 'No'
        }
      ]
    },
    id: 'MULTIPLE_CHOICE',
    title: 'MULTIPLE_CHOICE',
    kind: shared_types_enums_1.FieldKindEnum.MULTIPLE_CHOICE
  }
  const rules = (0, src_1.fieldsToValidateRules)([field])
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], { value: ['hello'] })
  }).toThrowError()
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], {
      value: ['m2Hhr1OadUOW', 'u84MQMR1nZV0']
    })
  }).toThrowError()
  ;(0, vitest_1.expect)(
    (0, src_1.validate)(rules[0], {
      value: ['m2Hhr1OadUOW']
    })
  ).toBe(undefined)
})
;(0, vitest_1.test)('payment', () => {
  const field = {
    validations: {
      required: false
    },
    properties: {
      concurrency: 'USD',
      price: {
        type: 'number',
        value: 1
      }
    },
    id: 'PAYMENT',
    title: 'PAYMENT',
    kind: shared_types_enums_1.FieldKindEnum.PAYMENT
  }
  const rules = (0, src_1.fieldsToValidateRules)([field])
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], {})
  }).toThrowError()
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], { amount: -1 })
  }).toThrowError()
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], { amount: 0 })
  }).toThrowError()
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], { amount: -1, currency: 'USD' })
  }).toThrowError()
  ;(0, vitest_1.expect)((0, src_1.validate)(rules[0], { amount: 0, currency: 'USD' })).toBe(
    undefined
  )
  process.env.VALIDATE_CLIENT_SIDE = true
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], {})
  }).toThrowError()
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], { name: 'Joe' })
  }).toThrowError()
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], { name: 'Joe', cardNumber: true })
  }).toThrowError()
  ;(0, vitest_1.expect)(() => {
    ;(0, src_1.validate)(rules[0], { name: 'Joe', cardNumber: true, cardExpiry: true })
  }).toThrowError()
  ;(0, vitest_1.expect)(
    (0, src_1.validate)(rules[0], {
      name: 'Joe',
      cardNumber: true,
      cardExpiry: true,
      cardCvc: true
    })
  ).toBe(undefined)
  ;(0, vitest_1.expect)((0, src_1.validate)(rules[0], undefined)).toBe(undefined)
})
;(0, vitest_1.test)('file upload requires a usable http(s) upload reference', () => {
  const rule = (0, src_1.fieldsToValidateRules)([
    {
      id: 'FILE_UPLOAD',
      kind: shared_types_enums_1.FieldKindEnum.FILE_UPLOAD,
      title: 'Attachment',
      validations: { required: false }
    }
  ])[0]
  ;(0, vitest_1.expect)(() => (0, src_1.validate)(rule, {})).toThrowError()
  ;(0, vitest_1.expect)(() => (0, src_1.validate)(rule, { filename: 'report.pdf' })).toThrowError()
  ;(0, vitest_1.expect)(() =>
    (0, src_1.validate)(rule, { filename: 'report.pdf', url: 'javascript:alert(document.domain)' })
  ).toThrowError()
  ;(0, vitest_1.expect)(
    (0, src_1.validate)(rule, {
      filename: 'report.pdf',
      url: 'https://forms.example.com/static/upload/file-id'
    })
  ).toBe(undefined)
  ;(0, vitest_1.expect)(
    (0, src_1.validate)(rule, {
      filename: 'legacy.pdf',
      urlPrefix: 'https://uploads.example.com/files',
      key: 'file-id'
    })
  ).toBe(undefined)
})
;(0, vitest_1.test)('legal terms rejects non-boolean and requires acceptance', () => {
  const requiredRule = (0, src_1.fieldsToValidateRules)([
    {
      id: 'LEGAL_TERMS',
      kind: shared_types_enums_1.FieldKindEnum.LEGAL_TERMS,
      title: 'Terms',
      validations: { required: true }
    }
  ])[0]
  ;(0, vitest_1.expect)(() => (0, src_1.validate)(requiredRule, 'true')).toThrowError()
  ;(0, vitest_1.expect)(() => (0, src_1.validate)(requiredRule, false)).toThrowError()
  ;(0, vitest_1.expect)((0, src_1.validate)(requiredRule, true)).toBe(undefined)
})
;(0, vitest_1.test)('input table rejects values that can crash exporters', () => {
  const rule = (0, src_1.fieldsToValidateRules)([
    {
      id: 'INPUT_TABLE',
      kind: shared_types_enums_1.FieldKindEnum.INPUT_TABLE,
      title: 'Table',
      validations: { required: false }
    }
  ])[0]
  ;(0, vitest_1.expect)(() => (0, src_1.validate)(rule, 'not an array')).toThrowError()
  ;(0, vitest_1.expect)(() => (0, src_1.validate)(rule, ['not an object'])).toThrowError()
  ;(0, vitest_1.expect)((0, src_1.validate)(rule, [{ column_1: 'value' }])).toBe(undefined)
})
;(0, vitest_1.test)('signature rejects arbitrary non-image values', () => {
  const rule = (0, src_1.fieldsToValidateRules)([
    {
      id: 'SIGNATURE',
      kind: shared_types_enums_1.FieldKindEnum.SIGNATURE,
      title: 'Signature',
      validations: { required: true }
    }
  ])[0]
  ;(0, vitest_1.expect)(() =>
    (0, src_1.validate)(rule, { url: 'https://example.com/signature.png' })
  ).toThrowError()
  ;(0, vitest_1.expect)(() => (0, src_1.validate)(rule, 'javascript:alert(1)')).toThrowError()
  ;(0, vitest_1.expect)((0, src_1.validate)(rule, 'https://cdn.example.com/signature.png')).toBe(
    undefined
  )
})
//# sourceMappingURL=validate.test.js.map

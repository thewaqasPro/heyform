'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const big_js_1 = tslib_1.__importDefault(require('big.js'))
const utils_1 = require('@heyform-inc/utils')
const consts_1 = require('./consts')
function fileUpload(answer, livePreview = false) {
  if (livePreview) {
    return {
      filename: answer.name
    }
  }
  if (utils_1.helper.isURL(answer.value)) {
    return {
      filename: '',
      url: answer.value
    }
  }
  return {
    filename: answer.value.filename || '',
    url: answer.value.url
  }
}
function rating(answer) {
  return answer.value
}
function singleChoice(answer) {
  var _a
  const choice =
    (_a = answer.properties.choices) === null || _a === void 0
      ? void 0
      : _a.find(row => row.id === answer.value)
  return choice ? choice.label : ''
}
function multipleChoice(answer) {
  var _a, _b, _c
  return (
    ((_b = (_a = answer.properties) === null || _a === void 0 ? void 0 : _a.choices) === null ||
    _b === void 0
      ? void 0
      : _b.filter(row => {
          var _a
          return (_a = answer.value) === null || _a === void 0 ? void 0 : _a.value.includes(row.id)
        })) || []
  )
    .map(row => row.label)
    .concat([(_c = answer.value) === null || _c === void 0 ? void 0 : _c.other])
    .filter(row => utils_1.helper.isValid(row))
    .join(', ')
}
function fullName(answer) {
  return answer.value
}
function address(answer) {
  return [
    answer.value.address1,
    ',',
    answer.value.address2,
    answer.value.city,
    ',',
    answer.value.state,
    ',',
    answer.value.country,
    answer.value.zip
  ]
    .filter(Boolean)
    .join(' ')
}
function legalTerms(answer) {
  return utils_1.helper.isTrue(answer.value) ? 'Yes' : 'No'
}
function dateRange(answer) {
  return [answer.value.start, answer.value.end].filter(Boolean).join(' - ')
}
function inputTable(answer) {
  var _a
  const columns = (_a = answer.properties) === null || _a === void 0 ? void 0 : _a.tableColumns
  if (utils_1.helper.isValidArray(columns) && utils_1.helper.isArray(answer.value)) {
    const result = []
    answer.value.forEach(values => {
      if (utils_1.helper.isPlainObject(values)) {
        const row = columns.map(column => values[column.id]).join(', ')
        result.push(row)
      }
    })
    return result.join('\n')
  }
  return ''
}
function payment(answer) {
  const value = answer.value
  const price = (0, big_js_1.default)(value.amount).div(100).toFixed(2)
  let result = consts_1.CURRENCY_SYMBOLS[value.currency] + price
  if (utils_1.helper.isValid(value.paymentIntentId)) {
    result = `Succeeded ${result}`
  } else {
    result = `Incomplete ${result}`
  }
  return result
}
exports.default = {
  fileUpload,
  rating,
  singleChoice,
  multipleChoice,
  fullName,
  address,
  legalTerms,
  dateRange,
  inputTable,
  payment
}
//# sourceMappingURL=answer-parser.js.map

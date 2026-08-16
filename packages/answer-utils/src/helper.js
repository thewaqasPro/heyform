'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.isAfterDate =
  exports.isBeforeDate =
  exports.isSameDate =
  exports.isLessOrEqualThan =
  exports.isGreaterOrEqualThan =
  exports.isLessThan =
  exports.isGreaterThan =
  exports.isEndsWith =
  exports.isStartsWith =
  exports.isContains =
  exports.isEqual =
  exports.isDate =
  exports.getDateFormat =
  exports.isMobilePhone =
  exports.isNumber =
  exports.htmlToText =
    void 0
const tslib_1 = require('tslib')
const dayjs_1 = tslib_1.__importDefault(require('dayjs'))
const libphonenumber_js_1 = require('libphonenumber-js')
const utils_1 = require('@heyform-inc/utils')
var utils_2 = require('@heyform-inc/utils')
Object.defineProperty(exports, 'htmlToText', {
  enumerable: true,
  get: function () {
    return utils_2.htmlToText
  }
})
function isNumber(arg) {
  return Number.isFinite(arg)
}
exports.isNumber = isNumber
function isMobilePhone(arg) {
  const phoneNumber = (0, libphonenumber_js_1.parsePhoneNumberFromString)(arg)
  return !!(phoneNumber === null || phoneNumber === void 0 ? void 0 : phoneNumber.isValid())
}
exports.isMobilePhone = isMobilePhone
const REGEX_FORMAT = /\[([^\]]+)]|Y{4}|M{2}|D{2}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g
const REGEX_NUMBERS = /(\d){1,4}/g
function getDateFormat(format, allowTime) {
  return allowTime ? `${format} HH:mm` : format
}
exports.getDateFormat = getDateFormat
function isDate(input, format = 'MM/DD/YYYY') {
  const inputArr = input.match(REGEX_NUMBERS)
  const formatArr = format.match(REGEX_FORMAT)
  if (!inputArr || !formatArr || inputArr.length !== formatArr.length) {
    return false
  }
  const dateObject = {}
  formatArr.forEach((key, index) => {
    dateObject[key] = Number(inputArr[index])
  })
  const date = new Date(
    dateObject.YYYY,
    dateObject.MM - 1,
    dateObject.DD,
    dateObject.HH || 0,
    dateObject.mm || 0
  )
  if (dateObject.HH && dateObject.mm) {
    return (
      date.getFullYear() === +dateObject.YYYY &&
      date.getMonth() === dateObject.MM - 1 &&
      date.getDate() === dateObject.DD &&
      date.getHours() === dateObject.HH &&
      date.getMinutes() === dateObject.mm
    )
  }
  return (
    date.getFullYear() === +dateObject.YYYY &&
    date.getMonth() === dateObject.MM - 1 &&
    date.getDate() === +dateObject.DD
  )
}
exports.isDate = isDate
function isEqual(arg1, arg2) {
  if (utils_1.helper.isArray(arg1) && utils_1.helper.isArray(arg2)) {
    return arg1.length === arg2.length && arg1.every(e => arg2.includes(e))
  }
  return String(arg1) === String(arg2)
}
exports.isEqual = isEqual
function isContains(arg1, arg2) {
  if (utils_1.helper.isArray(arg1)) {
    return arg1.includes(String(arg2))
  }
  return String(arg1).includes(String(arg2))
}
exports.isContains = isContains
function isStartsWith(arg1, arg2) {
  return String(arg1).startsWith(String(arg2))
}
exports.isStartsWith = isStartsWith
function isEndsWith(arg1, arg2) {
  return String(arg1).endsWith(String(arg2))
}
exports.isEndsWith = isEndsWith
function isGreaterThan(arg1, arg2) {
  return (
    utils_1.helper.isNumeric(arg1) && utils_1.helper.isNumeric(arg2) && Number(arg1) > Number(arg2)
  )
}
exports.isGreaterThan = isGreaterThan
function isLessThan(arg1, arg2) {
  return (
    utils_1.helper.isNumeric(arg1) && utils_1.helper.isNumeric(arg2) && Number(arg1) < Number(arg2)
  )
}
exports.isLessThan = isLessThan
function isGreaterOrEqualThan(arg1, arg2) {
  return (
    utils_1.helper.isNumeric(arg1) && utils_1.helper.isNumeric(arg2) && Number(arg1) >= Number(arg2)
  )
}
exports.isGreaterOrEqualThan = isGreaterOrEqualThan
function isLessOrEqualThan(arg1, arg2) {
  return (
    utils_1.helper.isNumeric(arg1) && utils_1.helper.isNumeric(arg2) && Number(arg1) <= Number(arg2)
  )
}
exports.isLessOrEqualThan = isLessOrEqualThan
const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD'
function isSameDate(value, expected, format = DEFAULT_DATE_FORMAT, allowTime = false) {
  const valueFormat = getDateFormat(format, allowTime)
  const expectedFormat = getDateFormat(DEFAULT_DATE_FORMAT, allowTime)
  return (0, dayjs_1.default)(value, valueFormat).isSame(
    (0, dayjs_1.default)(expected, expectedFormat)
  )
}
exports.isSameDate = isSameDate
function isBeforeDate(value, expected, format = DEFAULT_DATE_FORMAT, allowTime = false) {
  const valueFormat = getDateFormat(format, allowTime)
  const expectedFormat = getDateFormat(DEFAULT_DATE_FORMAT, allowTime)
  return (0, dayjs_1.default)(value, valueFormat).isBefore(
    (0, dayjs_1.default)(expected, expectedFormat)
  )
}
exports.isBeforeDate = isBeforeDate
function isAfterDate(value, expected, format = DEFAULT_DATE_FORMAT, allowTime = false) {
  const valueFormat = getDateFormat(format, allowTime)
  const expectedFormat = getDateFormat(DEFAULT_DATE_FORMAT, allowTime)
  return (0, dayjs_1.default)(value, valueFormat).isAfter(
    (0, dayjs_1.default)(expected, expectedFormat)
  )
}
exports.isAfterDate = isAfterDate
//# sourceMappingURL=helper.js.map

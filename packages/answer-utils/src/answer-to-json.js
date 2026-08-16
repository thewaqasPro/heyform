'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.answersToJson = void 0
const tslib_1 = require('tslib')
const shared_types_enums_1 = require('@heyform-inc/shared-types-enums')
const answer_parser_1 = tslib_1.__importDefault(require('./answer-parser'))
function answersToJson(answers, options) {
  const result = {}
  answers.forEach(answer => {
    result[answer.id] = parseJsonAnswer(
      answer,
      options === null || options === void 0 ? void 0 : options.plain
    )
  })
  return result
}
exports.answersToJson = answersToJson
function parseJsonAnswer(answer, plain = false) {
  var _a
  let value
  switch (answer.kind) {
    case shared_types_enums_1.FieldKindEnum.FILE_UPLOAD:
      value = answer_parser_1.default.fileUpload(answer)
      if (plain) {
        value = `${value.filename} (${value.url})`
      }
      break
    case shared_types_enums_1.FieldKindEnum.RATING:
    case shared_types_enums_1.FieldKindEnum.OPINION_SCALE:
      value = answer_parser_1.default.rating(answer)
      break
    case shared_types_enums_1.FieldKindEnum.YES_NO:
      value = answer_parser_1.default.singleChoice(answer)
      break
    case shared_types_enums_1.FieldKindEnum.MULTIPLE_CHOICE:
    case shared_types_enums_1.FieldKindEnum.PICTURE_CHOICE:
      value = answer_parser_1.default.multipleChoice(answer)
      break
    case shared_types_enums_1.FieldKindEnum.FULL_NAME:
      value = answer_parser_1.default.fullName(answer)
      if (plain) {
        value = `${value.firstName} ${value.lastName}`
      }
      break
    case shared_types_enums_1.FieldKindEnum.ADDRESS:
      value = answer.value
      if (plain) {
        value = answer_parser_1.default.address(answer)
      }
      break
    case shared_types_enums_1.FieldKindEnum.LEGAL_TERMS:
      value = answer_parser_1.default.legalTerms(answer)
      break
    case shared_types_enums_1.FieldKindEnum.DATE_RANGE:
      value = answer.value
      if (plain) {
        value = answer_parser_1.default.dateRange(answer)
      }
      break
    case shared_types_enums_1.FieldKindEnum.INPUT_TABLE:
      value = answer.value
      if (plain) {
        value = answer_parser_1.default.inputTable(answer)
      }
      break
    case shared_types_enums_1.FieldKindEnum.PAYMENT:
      value = answer.value
      if (plain) {
        value = answer_parser_1.default.payment(answer)
      }
      break
    default:
      value = (_a = answer.value) === null || _a === void 0 ? void 0 : _a.toString()
  }
  return value
}
//# sourceMappingURL=answer-to-json.js.map

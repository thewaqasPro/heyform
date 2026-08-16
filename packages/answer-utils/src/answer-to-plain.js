'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.parsePlainAnswer = exports.answersToPlain = void 0
const tslib_1 = require('tslib')
const shared_types_enums_1 = require('@heyform-inc/shared-types-enums')
const utils_1 = require('@heyform-inc/utils')
const answer_parser_1 = tslib_1.__importDefault(require('./answer-parser'))
function answersToPlain(answers) {
  return answers
    .map(answer => {
      const value = parsePlainAnswer(answer)
      return `${answer.title}\n${value}`
    })
    .join('\n\n')
}
exports.answersToPlain = answersToPlain
function parsePlainAnswer(answer, livePreview = false) {
  var _a
  let value
  switch (answer.kind) {
    case shared_types_enums_1.FieldKindEnum.FILE_UPLOAD:
      const file = answer_parser_1.default.fileUpload(answer, livePreview)
      value = livePreview ? file.filename : `${file.filename} (${file.url})`
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
      const name = answer_parser_1.default.fullName(answer)
      value = `${name.firstName} ${name.lastName}`
      break
    case shared_types_enums_1.FieldKindEnum.ADDRESS:
      value = answer_parser_1.default.address(answer)
      break
    case shared_types_enums_1.FieldKindEnum.LEGAL_TERMS:
      value = answer_parser_1.default.legalTerms(answer)
      break
    case shared_types_enums_1.FieldKindEnum.DATE_RANGE:
      value = answer_parser_1.default.dateRange(answer)
      break
    case shared_types_enums_1.FieldKindEnum.INPUT_TABLE:
      value = answer_parser_1.default.inputTable(answer)
      break
    case shared_types_enums_1.FieldKindEnum.PAYMENT:
      value = answer_parser_1.default.payment(answer)
      break
    default:
      value = (_a = answer.value) === null || _a === void 0 ? void 0 : _a.toString()
  }
  if (livePreview && utils_1.helper.isEmpty(value)) {
    value = '_____'
  }
  return value
}
exports.parsePlainAnswer = parsePlainAnswer
//# sourceMappingURL=answer-to-plain.js.map

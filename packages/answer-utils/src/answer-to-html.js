'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.answersToHtml = void 0
const tslib_1 = require('tslib')
const shared_types_enums_1 = require('@heyform-inc/shared-types-enums')
const answer_parser_1 = tslib_1.__importDefault(require('./answer-parser'))
const escape_html_1 = require('./escape-html')
function answersToHtml(answers) {
  const html = answers
    .map(answer => {
      const value = parseHtmlAnswer(answer)
      return `
<li>
  <h3>${(0, escape_html_1.escapeHtmlText)(answer.title)}</h3>
  <p>${(0, escape_html_1.escapeHtmlText)(value)}</p>
</li>
`
    })
    .join('')
  return `<ol>${html}</ol>`
}
exports.answersToHtml = answersToHtml
function parseHtmlAnswer(answer) {
  var _a, _b
  if (answer.value === undefined || answer.value === null) {
    return ''
  }
  let value = ''
  if (shared_types_enums_1.QUESTION_FIELD_KINDS.includes(answer.kind)) {
    try {
      switch (answer.kind) {
        case shared_types_enums_1.FieldKindEnum.FILE_UPLOAD:
          const file = answer_parser_1.default.fileUpload(answer)
          value = `${file.filename} (${file.url})`
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
          value = `${name.firstName || ''} ${name.lastName || ''}`.trim()
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
          if (Array.isArray(answer.value)) {
            value = answer.value.join(', ')
          } else if (typeof answer.value === 'object') {
            value = Object.entries(answer.value)
              .map(([k, v]) => `${k}: ${v}`)
              .join(', ')
          } else if (typeof answer.value === 'boolean') {
            value = answer.value ? 'Yes' : 'No'
          } else {
            value = ((_a = answer.value) === null || _a === void 0 ? void 0 : _a.toString()) || ''
          }
      }
    } catch (_) {
      value = typeof answer.value === 'object' ? JSON.stringify(answer.value) : String(answer.value)
    }
  } else {
    if (Array.isArray(answer.value)) {
      value = answer.value.join(', ')
    } else if (typeof answer.value === 'object') {
      value = Object.entries(answer.value)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ')
    } else if (typeof answer.value === 'boolean') {
      value = answer.value ? 'Yes' : 'No'
    } else {
      value = ((_b = answer.value) === null || _b === void 0 ? void 0 : _b.toString()) || ''
    }
  }
  return value
}
//# sourceMappingURL=answer-to-html.js.map

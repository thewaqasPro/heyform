'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.hiddenFieldsToHtml = void 0
const escape_html_1 = require('./escape-html')
function hiddenFieldsToHtml(hiddenFields) {
  if (!hiddenFields.length) return ''
  const html = hiddenFields
    .map(hiddenField => {
      return `
<li>
  <h3>${(0, escape_html_1.escapeHtmlText)(hiddenField.name)}</h3>
  <p>${(0, escape_html_1.escapeHtmlText)(hiddenField.value)}</p>
</li>
`
    })
    .join('')
  return `<ol>${html}</ol>`
}
exports.hiddenFieldsToHtml = hiddenFieldsToHtml
//# sourceMappingURL=hidden-fields-to-html.js.map

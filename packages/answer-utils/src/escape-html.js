'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.escapeHtmlText = void 0
function escapeHtmlText(value) {
  return String(value !== null && value !== void 0 ? value : '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
exports.escapeHtmlText = escapeHtmlText
//# sourceMappingURL=escape-html.js.map

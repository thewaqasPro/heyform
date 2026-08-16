'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const shared_types_enums_1 = require('@heyform-inc/shared-types-enums')
const vitest_1 = require('vitest')
const src_1 = require('../src')
;(0, vitest_1.test)('escapes untrusted answer titles and values', () => {
  const html = (0, src_1.answersToHtml)([
    {
      id: 'answer-1',
      kind: shared_types_enums_1.FieldKindEnum.SHORT_TEXT,
      title: '<img src=x onerror=alert(1)> & "title"',
      value: '</p><a href="https://attacker.test">click me</a>'
    }
  ])
  ;(0, vitest_1.expect)(html).not.toContain('<img')
  ;(0, vitest_1.expect)(html).not.toContain('<a href=')
  ;(0, vitest_1.expect)(html).toContain(
    '&lt;img src=x onerror=alert(1)&gt; &amp; &quot;title&quot;'
  )
  ;(0, vitest_1.expect)(html).toContain(
    '&lt;/p&gt;&lt;a href=&quot;https://attacker.test&quot;&gt;click me&lt;/a&gt;'
  )
})
;(0, vitest_1.test)('escapes untrusted hidden field names and values', () => {
  const html = (0, src_1.hiddenFieldsToHtml)([
    {
      id: 'hidden-1',
      name: '<style>body{display:none}</style>',
      value: '<svg onload=alert(1)>'
    }
  ])
  ;(0, vitest_1.expect)(html).not.toContain('<style>')
  ;(0, vitest_1.expect)(html).not.toContain('<svg')
  ;(0, vitest_1.expect)(html).toContain('&lt;style&gt;body{display:none}&lt;/style&gt;')
  ;(0, vitest_1.expect)(html).toContain('&lt;svg onload=alert(1)&gt;')
})
//# sourceMappingURL=answer-to-html-security.test.js.map

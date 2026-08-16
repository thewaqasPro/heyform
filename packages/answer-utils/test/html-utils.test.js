'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const vitest_1 = require('vitest')
const html_utils_1 = require('../src/html-utils')
const schema = [
  ['b', ['Make any website your Mac desktop wallpaper.&nbsp;']],
  ['div', [['b', [null]]]],
  [
    'div',
    [
      'Plash enables you to have a highly dynamic ',
      [
        'a',
        ['desktop wallpaper.'],
        {
          href: 'https://github.com',
          style: ''
        }
      ],
      ' You could display your favorite news site, Facebook feed, or a random beautiful scenery photo.'
    ]
  ]
]
;(0, vitest_1.test)('serialize html', () => {
  ;(0, vitest_1.expect)(
    html_utils_1.htmlUtils.serialize(schema, { allowedBlockTags: [] })
  ).toMatchSnapshot()
})
;(0, vitest_1.test)('serialize html with block tags', () => {
  ;(0, vitest_1.expect)(
    html_utils_1.htmlUtils.serialize(schema, {
      allowedBlockTags: ['div', 'p']
    })
  ).toMatchSnapshot()
})
;(0, vitest_1.test)('parse html', () => {
  ;(0, vitest_1.expect)(
    html_utils_1.htmlUtils.parse(html_utils_1.htmlUtils.serialize(schema, { allowedBlockTags: [] }))
  ).toMatchSnapshot()
})
;(0, vitest_1.test)('parse html with block tags', () => {
  const html = html_utils_1.htmlUtils.serialize(schema, {
    allowedBlockTags: ['div', 'p']
  })
  ;(0, vitest_1.expect)(
    html_utils_1.htmlUtils.parse(html, {
      allowedBlockTags: ['div', 'p']
    })
  ).toMatchSnapshot()
})
;(0, vitest_1.test)('purge removes unsafe tags and event handlers', () => {
  ;(0, vitest_1.expect)(
    html_utils_1.htmlUtils.purge(
      '<p>Hello<img src=x onerror=alert(1)><span onclick="alert(1)">world</span></p>'
    )
  ).toBe('<p>Hello<span>world</span></p>')
})
;(0, vitest_1.test)('serialize escapes schema text and attributes', () => {
  ;(0, vitest_1.expect)(
    html_utils_1.htmlUtils.serialize([
      [
        'a',
        ['<img src=x onerror=alert(1)>'],
        {
          href: '" onmouseover="alert(1)'
        }
      ]
    ])
  ).toBe('<a href="&quot; onmouseover=&quot;alert(1)">&lt;img src=x onerror=alert(1)&gt;</a>')
})
;(0, vitest_1.test)('serialize drops unsafe href protocols', () => {
  ;(0, vitest_1.expect)(
    html_utils_1.htmlUtils.serialize([
      [
        'a',
        ['click me'],
        {
          href: 'javascript:alert(1)'
        }
      ]
    ])
  ).toBe('<a>click me</a>')
})
;(0, vitest_1.test)('serialize drops unsafe href protocols split by control characters', () => {
  for (const href of ['java\tscript:alert(1)', 'java\nscript:alert(1)', 'vb\rscript:alert(1)']) {
    ;(0, vitest_1.expect)(
      html_utils_1.htmlUtils.serialize([
        [
          'a',
          ['click me'],
          {
            href
          }
        ]
      ])
    ).toBe('<a>click me</a>')
  }
})
;(0, vitest_1.test)('plain html', () => {
  ;(0, vitest_1.expect)(
    html_utils_1.htmlUtils.plain(
      '<p><strong>Programmer\'s guide</strong> about how to <a href="https://github.com">cook at home</a></p>'
    )
  ).toBe("Programmer's guide about how to cook at home")
})
;(0, vitest_1.test)('plain html with limit', () => {
  ;(0, vitest_1.expect)(
    html_utils_1.htmlUtils.plain(
      '<p><strong>Programmer\'s guide</strong> about how to <a href="https://github.com">cook at home</a></p>',
      20
    )
  ).toBe("Programmer's guide a...")
})
;(0, vitest_1.test)('plain html with large limit', () => {
  ;(0, vitest_1.expect)(
    html_utils_1.htmlUtils.plain(
      '<p><strong>Programmer\'s guide</strong> about how to <a href="https://github.com">cook at home</a></p>',
      100
    )
  ).toBe("Programmer's guide about how to cook at home")
})
//# sourceMappingURL=html-utils.test.js.map

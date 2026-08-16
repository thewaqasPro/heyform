import { HiddenFieldAnswer } from '@kyndform/shared-types-enums'

import { escapeHtmlText } from './escape-html'

export function hiddenFieldsToHtml(hiddenFields: HiddenFieldAnswer[]): string {
  if (!hiddenFields.length) return ''

  const html = hiddenFields
    .map(hiddenField => {
      return `
<li>
  <h3>${escapeHtmlText(hiddenField.name)}</h3>
  <p>${escapeHtmlText(hiddenField.value)}</p>
</li>
`
    })
    .join('')

  return `<ol>${html}</ol>`
}

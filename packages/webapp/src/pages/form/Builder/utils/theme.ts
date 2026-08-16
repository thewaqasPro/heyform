import { getTheme, getThemeStyle } from '@kyndform/form-renderer'
import { FormTheme } from '@kyndform/shared-types-enums'

export function insertThemeStyle(customTheme?: FormTheme) {
  const theme = getTheme(customTheme)
  let content = getThemeStyle(theme)

  let style = document.getElementById('kyndform-theme')

  if (!style) {
    style = document.createElement('style')
    style.id = 'kyndform-theme'

    document.head.appendChild(style)
  }

  if (customTheme?.customCSS) {
    content += customTheme!.customCSS
  }

  style.textContent = content
}

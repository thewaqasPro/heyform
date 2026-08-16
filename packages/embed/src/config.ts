import { $ } from './utils'

import { AnyMap, EmbedConfig } from './type'

const ATTR_PREFIXES = ['data-kyndform-', 'data-kyndform-']

export function getConfigs() {
  const $form = $('[data-kyndform-id], [data-kyndform-id]')

  return $form.map(el => {
    const settings: AnyMap = {}
    const hiddenFields: AnyMap = {}

    const names = el.getAttributeNames()

    names.forEach(name => {
      let key = name.toLowerCase()

      for (const prefix of ATTR_PREFIXES) {
        const hiddenPrefix = `${prefix}hiddenfield-`
        if (key.startsWith(hiddenPrefix)) {
          key = key.replace(hiddenPrefix, '')
          hiddenFields[key] = el.getAttribute(name)
          return
        } else if (key.startsWith(prefix)) {
          key = key.replace(prefix, '').replace(/(-)+([a-z])/gi, (_, __, s) => s.toUpperCase())
          settings[key] = el.getAttribute(name)
          return
        }
      }
    })

    const formId = (el.getAttribute('data-kyndform-id') ||
      el.getAttribute('data-kyndform-id')) as string
    const type = (el.getAttribute('data-kyndform-type') ||
      el.getAttribute('data-kyndform-type')) as string

    return {
      formId,
      type,
      container: $(el as HTMLElement),
      settings,
      hiddenFields
    } as EmbedConfig<any>
  })
}

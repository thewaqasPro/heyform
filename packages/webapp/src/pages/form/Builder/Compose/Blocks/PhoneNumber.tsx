import { COUNTRIES, FlagIcon } from '@kyndform/form-renderer'
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react'
import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { FakeSubmit } from '../FakeSubmit'
import type { BlockProps } from './Block'
import { Block } from './Block'

export const PhoneNumber: FC<BlockProps> = ({ field, locale, ...restProps }) => {
  const { t } = useTranslation()
  const placeholder = useMemo(
    () => COUNTRIES.find(c => c.value === field.properties?.defaultCountryCode)?.example,
    [field.properties?.defaultCountryCode]
  )

  return (
    <Block className="kyndform-phone-number" field={field} locale={locale} {...restProps}>
      <div className="flex items-center">
        <div className="kyndform-calling-code">
          <FlagIcon countryCode={field.properties?.defaultCountryCode} />
          <IconChevronDown className="kyndform-phone-arrow-icon" />
        </div>
        <input type="text" className="kyndform-input" placeholder={placeholder} disabled={true} />
      </div>
      <FakeSubmit text={t('Next', { lng: locale })} icon={<IconChevronRight />} />
    </Block>
  )
}

import { TIME_FORMAT } from '@kyndform/form-renderer'
import { IconChevronRight } from '@tabler/icons-react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/utils'

import { DATE_FORMAT_MAPS } from '@/consts'

import { FakeSubmit } from '../FakeSubmit'
import type { BlockProps } from './Block'
import { Block } from './Block'
import { DateItem } from './Date'

export const DateRange: FC<BlockProps> = ({ field, locale, ...restProps }) => {
  const { t } = useTranslation()
  const format = field.properties?.format || 'MM/DD/YYYY'
  const [x, y, z, dateDivider] = DATE_FORMAT_MAPS[format]
  const [h, m, timeDivider] = DATE_FORMAT_MAPS[TIME_FORMAT]

  return (
    <Block className="kyndform-date" field={field} locale={locale} {...restProps}>
      <div
        className={cn('kyndform-date-range flex items-center', {
          'kyndform-date-range-with-time': field.properties?.allowTime
        })}
      >
        <div className="kyndform-date-root kyndform-start-date">
          <DateItem locale={locale} format={x} />
          <div className="kyndform-date-divider">{dateDivider}</div>
          <DateItem locale={locale} format={y} />
          <div className="kyndform-date-divider">{dateDivider}</div>
          <DateItem locale={locale} format={z} />

          {field.properties?.allowTime && (
            <>
              <DateItem locale={locale} format={h} />
              <div className="kyndform-date-divider">{timeDivider}</div>
              <DateItem locale={locale} format={m} />
            </>
          )}
        </div>

        <div className="kyndform-date-range-divider">{t('form.builder.compose.dateRangeTo')}</div>

        <div className="kyndform-date-root kyndform-end-date">
          <DateItem locale={locale} format={x} />
          <div className="kyndform-date-divider">{dateDivider}</div>
          <DateItem locale={locale} format={y} />
          <div className="kyndform-date-divider">{dateDivider}</div>
          <DateItem locale={locale} format={z} />

          {field.properties?.allowTime && (
            <>
              <DateItem locale={locale} format={h} />
              <div className="kyndform-date-divider">{timeDivider}</div>
              <DateItem locale={locale} format={m} />
            </>
          )}
        </div>
      </div>

      <FakeSubmit text={t('Next', { lng: locale })} icon={<IconChevronRight />} />
    </Block>
  )
}

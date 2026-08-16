import { IconChevronRight } from '@tabler/icons-react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { FakeSubmit } from '../FakeSubmit'
import type { BlockProps } from './Block'
import { Block } from './Block'

export const LongText: FC<BlockProps> = ({ field, locale, ...restProps }) => {
  const { t } = useTranslation()

  return (
    <Block className="kyndform-long-text" field={field} locale={locale} {...restProps}>
      <textarea
        className="kyndform-textarea"
        placeholder={t('Your answer goes here', { lng: locale })}
        disabled={true}
      />
      <p className="kyndform-textarea-hit">
        {t('Hit Shift ⇧ + Enter ↵ for new line', { lng: locale })}
      </p>
      <FakeSubmit text={t('Next', { lng: locale })} icon={<IconChevronRight />} />
    </Block>
  )
}

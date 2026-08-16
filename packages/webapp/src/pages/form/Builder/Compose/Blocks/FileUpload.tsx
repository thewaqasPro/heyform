import { IconChevronRight, IconUpload } from '@tabler/icons-react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { FakeSubmit } from '../FakeSubmit'
import type { BlockProps } from './Block'
import { Block } from './Block'

export const FileUpload: FC<BlockProps> = ({ field, locale, ...restProps }) => {
  const { t } = useTranslation()

  return (
    <Block className="kyndform-file-upload" field={field} locale={locale} {...restProps}>
      <div className="kyndform-file-uploader">
        <div className="kyndform-upload-wrapper">
          <IconUpload className="kyndform-upload-icon non-scaling-stroke" />
          <div className="mt-8">{t('Upload a file or drag and drop', { lng: locale })}</div>
          <div className="kyndform-upload-size-limit">{t('Size limit', { lng: locale })}: 10MB</div>
        </div>
      </div>
      <FakeSubmit text={t('Next', { lng: locale })} icon={<IconChevronRight />} />
    </Block>
  )
}

import { FC } from 'react'
import { Trans } from 'react-i18next'

import { useTranslation } from '../utils'

import { LogoIcon } from '../components'
import { useStore } from '../store'

export const Branding: FC = () => {
  const { state } = useStore()
  const { t } = useTranslation()

  if (state.settings?.removeBranding) {
    return null
  }
  return null

  return (
    <a className="kyndform-branding" href="https://kyndform.com/?ref=badge" target="_blank">
      <Trans
        t={t as any}
        i18nKey="Made with KyndForm"
        components={{
          icon: <LogoIcon className="inline h-4 w-4" />,
          span: <span className="font-medium" />
        }}
      />
    </a>
  )
}

export const WelcomeBranding: FC = () => {
  return (
    <div className="kyndform-footer kyndform-welcome-footer">
      <div className="kyndform-footer-wrapper">
        <div className="kyndform-footer-left" />
        <div className="kyndform-footer-right">{/* <Branding /> */}</div>
      </div>
    </div>
  )
}

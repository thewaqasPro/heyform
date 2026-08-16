import type { FC } from 'react'
import { useEffect, useRef } from 'react'

import { useTranslation } from '../utils'

import { IComponentProps } from '../typings'

interface TemporaryErrorProps extends IComponentProps {
  error: Error
  countDown?: number
  onCountDownEnd?: () => void
}

export const TemporaryError: FC<TemporaryErrorProps> = ({
  error,
  countDown = 3_000,
  onCountDownEnd,
  ...restProps
}) => {
  const { t } = useTranslation()
  const timer = useRef<number>()

  useEffect(() => {
    timer.current = window.setTimeout(() => {
      onCountDownEnd?.()
    }, countDown)

    return () => {
      window.clearTimeout(timer.current)
    }
  }, [])

  return (
    <div className="kyndform-validation-wrapper" {...restProps}>
      <div className="kyndform-validation-error">{t(error.message)}</div>
    </div>
  )
}

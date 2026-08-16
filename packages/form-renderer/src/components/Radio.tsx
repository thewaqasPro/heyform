import { IconCheck, IconPhoto } from '@tabler/icons-react'
import clsx from 'clsx'
import type { FC, ReactNode } from 'react'

import { isURL, useKey } from '../utils'

import { IComponentProps } from '../typings'

export interface RadioOption {
  keyName?: string
  label: string
  value: any
  icon?: ReactNode
  image?: string
  enableImage?: boolean
  disabled?: boolean
}

interface RadioProps extends RadioOption, Omit<IComponentProps, 'onClick'> {
  isChecked?: boolean
  isHotkeyShow?: boolean
  onClick?: (value: any) => void
}

export const Radio: FC<RadioProps> = ({
  className,
  keyName,
  image,
  label,
  value,
  icon,
  enableImage,
  isHotkeyShow,
  disabled,
  isChecked,
  onClick,
  ...restProps
}) => {
  function handleClick() {
    if (!disabled) {
      onClick?.(value)
    }
  }

  useKey(keyName?.toLowerCase() as string, handleClick)

  return (
    <div
      className={clsx(
        'kyndform-radio',
        {
          'kyndform-radio-selected': isChecked
        },
        className
      )}
      onClick={handleClick}
      {...restProps}
    >
      <div className="kyndform-radio-container">
        {enableImage && (
          <div className="kyndform-radio-image">
            {isURL(image) ? (
              <img src={image} alt={label} />
            ) : icon ? (
              icon
            ) : (
              <IconPhoto className="kyndform-radio-placeholder" />
            )}
          </div>
        )}
        <div className="kyndform-radio-content">
          {keyName && isHotkeyShow && <div className="kyndform-radio-hotkey">{keyName}</div>}
          <div className="kyndform-radio-label">{label}</div>
        </div>
        <div className="kyndform-radio-icon">
          <IconCheck />
        </div>
      </div>
    </div>
  )
}

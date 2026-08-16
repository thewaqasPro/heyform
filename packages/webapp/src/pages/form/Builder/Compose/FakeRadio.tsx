import type { FC } from 'react'

interface FakeRadioProps extends ComponentProps {
  hotkey?: string
  label: string | number
}

export const FakeRadio: FC<FakeRadioProps> = ({ hotkey, label, ...restProps }) => {
  return (
    <div className="kyndform-radio" {...restProps}>
      <div className="kyndform-radio-container">
        <div className="kyndform-radio-content">
          {hotkey && <div className="kyndform-radio-hotkey">{hotkey}</div>}
          <div className="kyndform-radio-label">{label}</div>
        </div>
      </div>
    </div>
  )
}

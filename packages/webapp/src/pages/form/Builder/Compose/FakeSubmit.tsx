import type { FC, ReactNode } from 'react'

interface FakeSubmitProps extends ComponentProps {
  text?: string
  icon?: ReactNode
}

export const FakeSubmit: FC<FakeSubmitProps> = ({ text, icon, ...restProps }) => {
  return (
    <div className="kyndform-submit-container" {...restProps}>
      <div className="kyndform-submit-button">
        <span>{text}</span>
        {icon}
      </div>
    </div>
  )
}

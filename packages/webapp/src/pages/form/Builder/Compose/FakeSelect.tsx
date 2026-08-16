import { IconChevronDown } from '@tabler/icons-react'
import type { FC } from 'react'

export const FakeSelect: FC<ComponentProps & { placeholder?: string }> = ({
  placeholder,
  ...restProps
}) => {
  return (
    <div className="kyndform-select" {...restProps}>
      <div className="kyndform-select-container">
        {/* @ts-ignore */}
        <span className="kyndform-select-value" placeholder={placeholder} />
        <span className="kyndform-select-arrow-icon">
          <IconChevronDown />
        </span>
      </div>
    </div>
  )
}

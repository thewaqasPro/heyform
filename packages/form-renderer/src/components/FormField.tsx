import clsx from 'clsx'
import { Field } from 'rc-field-form'
import type { FieldProps } from 'rc-field-form/es/Field'
import type { FC, ReactElement } from 'react'
import { cloneElement } from 'react'

interface FormFieldProps extends FieldProps {
  className?: string
}

export const FormField: FC<FormFieldProps> = ({ className, children, ...restProps }) => {
  return (
    <Field validateFirst={false} {...restProps}>
      {(props, meta) => {
        const childNode = cloneElement(children as ReactElement, props)

        return (
          <div className={clsx('kyndform-form-field', className)}>
            {childNode}
            {meta.errors.length > 0 && (
              <div className="kyndform-validation-wrapper">
                <div className="kyndform-validation-error">{meta.errors[0]}</div>
              </div>
            )}
          </div>
        )
      }}
    </Field>
  )
}

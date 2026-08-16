import { Answer, Choice, Column, FieldKindEnum } from '@heyform-inc/shared-types-enums'
import { IconArrowUpRight, IconCheck, IconClock, IconFile } from '@tabler/icons-react'
import Big from 'big.js'
import { FC, Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import {
  cn,
  formatDay,
  getFileUploadValue,
  isHttpUrl,
  isTrustedStripeReceiptUrl,
  unixDate
} from '@/utils'
import { CURRENCY_SYMBOLS, htmlUtils } from '@heyform-inc/answer-utils'
import { helper } from '@heyform-inc/utils'

import { Badge, Checkbox, Image } from '@/components'
import { ALL_FIELD_CONFIGS, CUSTOM_FIELDS_CONFIGS } from '@/consts'
import { FormFieldType, SubmissionType } from '@/types'

import { QuestionIcon } from '../Builder/LeftSidebar/QuestionList'

interface SubmissionHeaderCellProps {
  field: FormFieldType
}

interface SubmissionCellProps extends SubmissionHeaderCellProps {
  submission: SubmissionType
  answer: Answer
  isTableCell?: boolean
}

const ICON_CONFIGS = [...ALL_FIELD_CONFIGS, ...CUSTOM_FIELDS_CONFIGS]

const AddressItem: FC<SubmissionCellProps> = ({ answer, field, isTableCell }) => {
  if (answer.kind !== field.kind || answer.value === undefined || answer.value === null) {
    return null
  }

  if (typeof answer.value === 'string') {
    return (
      <div className={cn(isTableCell ? 'truncate' : 'whitespace-pre-line')}>{answer.value}</div>
    )
  }

  if (!helper.isObject(answer.value)) {
    return null
  }

  const value = [
    answer.value.address1 || answer.value.address || answer.value.street,
    answer.value.address2,
    answer.value.city,
    answer.value.state || answer.value.region,
    answer.value.zip || answer.value.postalCode || answer.value.postal_code,
    answer.value.country,
    answer.value.latitude && answer.value.longitude
      ? `(${answer.value.latitude}, ${answer.value.longitude})`
      : answer.value.coordinates
  ].filter(helper.isValid)

  if (isTableCell) {
    return <span className="text-nowrap">{value.join(', ')}</span>
  }

  const entries = Object.entries(answer.value).filter(([_, v]) => helper.isValid(v))

  return (
    <dl className="grid grid-cols-1 text-base/6 sm:grid-cols-[min(50%,theme(spacing.80))_auto] sm:text-sm/6">
      {entries.map(([k, v], index) => (
        <Fragment key={index}>
          <dt className="border-accent-light text-secondary sm:border-accent-light col-start-1 border-t pt-3 capitalize first:border-none sm:border-t sm:py-3">
            {k.replace(/[-_]+/g, ' ')}
          </dt>
          <dd className="text-primary sm:border-accent-light pb-3 pt-1 sm:border-t sm:py-3 sm:[&:nth-child(2)]:border-none">
            {typeof v === 'object' ? JSON.stringify(v) : String(v)}
          </dd>
        </Fragment>
      ))}
    </dl>
  )
}

const DateRangeItem: FC<SubmissionCellProps> = ({ answer, field, isTableCell }) => {
  if (answer.kind !== field.kind || !helper.isObject(answer.value)) {
    return null
  }

  return (
    <div
      className={cn({
        truncate: isTableCell
      })}
    >
      {[answer.value.start, answer.value.end].filter(Boolean).join(' - ')}
    </div>
  )
}

const FileUploadItem: FC<SubmissionCellProps> = ({ answer, field, isTableCell }) => {
  const value = getFileUploadValue(
    answer.value,
    [...(window.heyform.uploadOrigins || []), window.location.origin],
    window.location.origin
  )

  if (answer.kind !== field.kind || !value) {
    return null
  }

  if (isTableCell) {
    return (
      <a
        className="flex gap-1"
        href={value.url}
        target="_blank"
        rel="noreferrer"
        onClick={event => event.stopPropagation()}
      >
        <IconFile className="text-secondary h-5 w-5" />
        <div className="flex-1 truncate">{value.filename}</div>
      </a>
    )
  }

  return (
    <a className="inline-flex gap-1 text-nowrap" href={value.url} target="_blank" rel="noreferrer">
      <IconFile className="text-secondary h-5 w-5" />
      <div className="flex-1 whitespace-nowrap">{value.filename}</div>
    </a>
  )
}

const FullNameItem: FC<SubmissionCellProps> = ({ answer, field, isTableCell }) => {
  if (
    answer.kind !== field.kind ||
    (!helper.isObject(answer.value) && typeof answer.value !== 'string')
  ) {
    return null
  }

  const nameStr =
    typeof answer.value === 'string'
      ? answer.value
      : [answer.value.firstName, answer.value.lastName].filter(Boolean).join(' ')

  return (
    <div
      className={cn({
        truncate: isTableCell
      })}
    >
      {nameStr}
    </div>
  )
}

const InputTableItem: FC<SubmissionCellProps> = ({ answer, field, isTableCell }) => {
  const columns = field.properties?.tableColumns as Column[]

  if (
    answer.kind !== field.kind ||
    !helper.isValidArray(columns) ||
    !helper.isValidArray(answer.value)
  ) {
    return null
  }

  const result = answer.value
    .map((row: AnyMap) => {
      if (helper.isObject(row)) {
        return columns.map(c => row[c.id])
      }
    })
    .filter(Boolean) as string[][]

  if (isTableCell) {
    return (
      <div className="truncate">
        {result
          .filter(helper.isValidArray)
          .map(row => row.join(', '))
          .join('|')}
      </div>
    )
  }

  return (
    <div className="scrollbar overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="text-secondary">
          <tr className="border-accent border-b">
            {columns.map(c => (
              <th key={c.id} className="text-nowrap py-2 text-left font-normal">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.map((row, index) => (
            <tr
              key={index}
              className="border-accent hover:bg-primary/[2.5%] border-b last:border-b-0"
            >
              {row.map((cell, index) => (
                <td key={index} className="h-10 text-nowrap py-2 text-left">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const MultipleChoiceItem: FC<SubmissionCellProps> = ({ answer, field, isTableCell }) => {
  if (answer.kind !== field.kind || answer.value === undefined || answer.value === null) {
    return null
  }

  // Handle direct string array values from headless submissions
  if (Array.isArray(answer.value)) {
    return (
      <div className={cn('flex', isTableCell ? 'gap-x-2 overflow-hidden py-2' : 'flex-wrap gap-2')}>
        {answer.value.map((item, index) => (
          <Badge
            key={index}
            color="zinc"
            className={cn('text-primary', {
              'text-nowrap': isTableCell
            })}
          >
            {String(item)}
          </Badge>
        ))}
      </div>
    )
  }

  const choices = field.properties?.choices as Choice[]

  if (
    !helper.isObject(answer.value) ||
    (!helper.isValidArray(answer.value.value) && helper.isEmpty(answer.value.other))
  ) {
    return null
  }

  const result: { id: string; label: string }[] = []

  if (helper.isValidArray(choices) && helper.isValidArray(answer.value.value)) {
    result.push(...choices.filter(c => answer.value.value.includes(c.id)))
  } else if (helper.isValidArray(answer.value.value)) {
    result.push(...answer.value.value.map((v: string) => ({ id: v, label: v })))
  }

  if (answer.value.other) {
    result.push({
      id: answer.value.other,
      label: answer.value.other
    })
  }

  return (
    <div className={cn('flex', isTableCell ? 'gap-x-2 overflow-hidden py-2' : 'flex-wrap gap-2')}>
      {result.map(row => (
        <Badge
          key={row.id}
          color="zinc"
          className={cn('text-primary', {
            'text-nowrap': isTableCell
          })}
        >
          {row.label}
        </Badge>
      ))}
    </div>
  )
}

const YesNoItem: FC<SubmissionCellProps> = ({ answer, field, isTableCell }) => {
  if (answer.kind !== field.kind || answer.value === undefined || answer.value === null) {
    return null
  }

  const choices = field.properties?.choices as Choice[]
  const rawValue = helper.isObject(answer.value) ? answer.value.value : answer.value

  let label: string | undefined

  if (helper.isValidArray(choices)) {
    const selected = choices.find(c => c.id === rawValue)
    label = selected?.label
  }

  if (!label) {
    if (typeof rawValue === 'boolean') {
      label = rawValue ? 'Yes' : 'No'
    } else if (typeof rawValue === 'string') {
      const lower = rawValue.toLowerCase()
      label =
        lower === 'true' || lower === 'yes' || lower === '1'
          ? 'Yes'
          : lower === 'false' || lower === 'no' || lower === '0'
            ? 'No'
            : rawValue
    } else {
      label = String(rawValue)
    }
  }

  return (
    <div className={cn('flex', isTableCell ? 'gap-x-2 overflow-hidden py-2' : 'flex-wrap gap-2')}>
      <Badge
        color="zinc"
        className={cn('text-primary', {
          'text-nowrap': isTableCell
        })}
      >
        {label}
      </Badge>
    </div>
  )
}

const OpinionScaleItem: FC<SubmissionCellProps> = ({ answer, field, isTableCell }) => {
  if (answer.kind !== field.kind || !helper.isNumeric(answer.value)) {
    return null
  }

  const total = field.properties?.total ?? (field.kind === FieldKindEnum.RATING ? 5 : 10)

  return (
    <div
      className={cn({
        truncate: isTableCell
      })}
    >
      {answer.value}/{total}
    </div>
  )
}

const PaymentItem: FC<SubmissionCellProps> = ({ answer, field }) => {
  if (answer.kind !== field.kind || !helper.isObject(answer.value)) {
    return null
  }

  const amount = answer.value.amount || 0
  const amountString = CURRENCY_SYMBOLS[answer.value.currency] + Big(amount).div(100).toFixed(2)
  const isCompleted = helper.isValid(answer.value.paymentIntentId)
  const receiptUrl = isTrustedStripeReceiptUrl(answer.value.receiptUrl)
    ? answer.value.receiptUrl
    : undefined

  return (
    <div className="flex items-center">
      <div className="flex flex-1 items-center overflow-hidden truncate">
        {isCompleted ? (
          <div className="flex h-6 items-center rounded bg-green-100 pl-1 pr-2 text-sm text-green-800">
            <IconCheck className="h-4 w-4" />
            <span className="ml-1">Succeeded</span>
          </div>
        ) : (
          <div className="text-primary flex h-6 items-center rounded bg-gray-100 pl-1 pr-2 text-sm">
            <IconClock className="h-4 w-4" />
            <span className="ml-1">Incomplete</span>
          </div>
        )}
        <div className="ml-2">{amountString}</div>
      </div>

      {isCompleted && receiptUrl && (
        <div className="ml-2">
          <a href={receiptUrl} target="_blank" rel="noreferrer">
            <IconArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      )}
    </div>
  )
}

const SignatureItem: FC<SubmissionCellProps> = ({ answer, field }) => {
  if (answer.kind !== field.kind || !helper.isURL(answer.value)) {
    return null
  }

  return <Image src={answer.value} width={80} height={40} resize={{ width: 80, height: 40 }} />
}

const TextItem: FC<SubmissionCellProps> = ({ answer, isTableCell }) => {
  if (answer.value === undefined || answer.value === null) {
    return null
  }

  if (Array.isArray(answer.value)) {
    return (
      <div className={cn(isTableCell ? 'truncate' : 'whitespace-pre-line')}>
        {answer.value.join(', ')}
      </div>
    )
  }

  if (typeof answer.value === 'object') {
    const formatted = Object.entries(answer.value)
      .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
      .join(', ')
    return <div className={cn(isTableCell ? 'truncate' : 'whitespace-pre-line')}>{formatted}</div>
  }

  if (typeof answer.value === 'boolean') {
    return (
      <div className={cn(isTableCell ? 'truncate' : 'whitespace-pre-line')}>
        {answer.value ? 'Yes' : 'No'}
      </div>
    )
  }

  return (
    <div className={cn(isTableCell ? 'truncate' : 'whitespace-pre-line')}>
      {String(answer.value)}
    </div>
  )
}

const URLItem: FC<SubmissionCellProps> = ({ answer, field, isTableCell }) => {
  if (answer.kind !== field.kind || !helper.isString(answer.value)) {
    return null
  }

  if (isTableCell || !isHttpUrl(answer.value)) {
    return <div className="truncate">{answer.value}</div>
  }

  return (
    <a href={answer.value} target="_blank" rel="noreferrer">
      {answer.value}
    </a>
  )
}

const SubmitDateItem: FC<SubmissionCellProps> = ({ answer }) => {
  const { i18n } = useTranslation()

  return <div className="truncate">{formatDay(unixDate(answer.value), i18n.language)}</div>
}

const CheckboxItem: FC<SubmissionCellProps> = ({ submission }) => {
  return (
    <div className="flex items-center" data-id={submission.id}>
      <Checkbox onChange={console.log} />
    </div>
  )
}

export default function SubmissionCell(props: SubmissionCellProps) {
  switch (props.field.kind) {
    case FieldKindEnum.HIDDEN_CHECKBOX:
      return <CheckboxItem {...props} />

    case FieldKindEnum.SUBMIT_DATE:
      return <SubmitDateItem {...props} />

    case FieldKindEnum.URL:
      return <URLItem {...props} />

    case FieldKindEnum.MULTIPLE_CHOICE:
    case FieldKindEnum.PICTURE_CHOICE:
      return <MultipleChoiceItem {...props} />

    case FieldKindEnum.YES_NO:
      return <YesNoItem {...props} />

    case FieldKindEnum.RATING:
    case FieldKindEnum.OPINION_SCALE:
      return <OpinionScaleItem {...props} />

    case FieldKindEnum.FILE_UPLOAD:
      return <FileUploadItem {...props} />

    case FieldKindEnum.SIGNATURE:
      return <SignatureItem {...props} />

    case FieldKindEnum.ADDRESS:
      return <AddressItem {...props} />

    case FieldKindEnum.FULL_NAME:
      return <FullNameItem {...props} />

    case FieldKindEnum.DATE_RANGE:
      return <DateRangeItem {...props} />

    case FieldKindEnum.INPUT_TABLE:
      return <InputTableItem {...props} />

    case FieldKindEnum.PAYMENT:
      return <PaymentItem {...props} />

    default:
      return <TextItem {...props} />
  }
}

export const SubmissionHeaderCell: FC<SubmissionHeaderCellProps & ComponentProps> = ({
  className,
  field
}) => {
  const label = helper.isArray(field.title)
    ? htmlUtils.plain(htmlUtils.serialize(field.title))
    : field.title

  return (
    <div className={cn('flex items-center gap-x-1.5', className)}>
      <QuestionIcon
        className="h-auto w-auto justify-center border-none bg-transparent px-0 [&_[data-slot=icon]]:ml-0 [&_[data-slot=icon]]:h-5 [&_[data-slot=icon]]:w-5"
        configs={ICON_CONFIGS}
        kind={field.kind}
      />
      <span className="flex-1 truncate" data-slot="label">
        {label}
      </span>
    </div>
  )
}

import { Answer, FullNameValue, ServerSidePaymentValue } from '@kyndform/shared-types-enums'
import Big from 'big.js'

import { helper } from '@kyndform/utils'

import { CURRENCY_SYMBOLS } from './consts'

function fileUpload(answer: Answer, livePreview = false) {
  if (livePreview) {
    return {
      filename: (answer as any).name
    }
  }

  if (helper.isURL(answer.value)) {
    return {
      filename: '',
      url: answer.value
    }
  }

  return {
    filename: answer.value.filename || '',
    url: answer.value.url
  }
}

function rating(answer: Answer): string {
  return answer.value
}

function singleChoice(answer: Answer): string {
  if (helper.isString(answer.value)) {
    const choice = answer.properties?.choices?.find(row => row.id === answer.value)
    return choice ? choice.label : answer.value
  }
  return String(answer.value ?? '')
}

function multipleChoice(answer: Answer): string {
  if (Array.isArray(answer.value)) {
    return answer.value.join(', ')
  }
  if (helper.isObject(answer.value)) {
    const list = (
      answer.properties?.choices?.filter(
        row => Array.isArray(answer.value?.value) && answer.value.value.includes(row.id)
      ) || []
    )
      .map(row => row.label)
      .concat([answer.value?.other])
      .filter(row => helper.isValid(row))

    if (list.length > 0) {
      return list.join(', ')
    }
  }
  return String(answer.value ?? '')
}

function fullName(answer: Answer): FullNameValue {
  if (typeof answer.value === 'string') {
    return { firstName: answer.value, lastName: '' }
  }
  return answer.value
}

function address(answer: Answer): string {
  if (typeof answer.value === 'string') {
    return answer.value
  }
  if (helper.isObject(answer.value)) {
    const parts = [
      answer.value.address1 || answer.value.address || answer.value.street,
      answer.value.address2,
      answer.value.city,
      answer.value.state || answer.value.region,
      answer.value.country,
      answer.value.zip || answer.value.postalCode || answer.value.postal_code
    ].filter(helper.isValid)

    if (parts.length > 0) {
      return parts.join(', ')
    }

    return Object.entries(answer.value)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ')
  }
  return String(answer.value ?? '')
}

function legalTerms(answer: Answer): string {
  return helper.isTrue(answer.value) ? 'Yes' : 'No'
}

function dateRange(answer: Answer): string {
  return [answer.value.start, answer.value.end].filter(Boolean).join(' - ')
}

function inputTable(answer: Answer): string {
  const columns = answer.properties?.tableColumns

  if (helper.isValidArray(columns) && helper.isArray(answer.value)) {
    const result: string[] = []

    answer.value.forEach((values: Record<string, string>) => {
      if (helper.isPlainObject(values)) {
        const row = columns!.map(column => values[column.id]).join(', ')
        result.push(row)
      }
    })

    return result.join('\n')
  }

  return ''
}

function payment(answer: Answer): string {
  const value = answer.value as ServerSidePaymentValue
  const price = Big(value.amount).div(100).toFixed(2)
  let result = CURRENCY_SYMBOLS[value.currency] + price

  if (helper.isValid(value.paymentIntentId)) {
    result = `Succeeded ${result}`
  } else {
    result = `Incomplete ${result}`
  }

  return result
}

export default {
  fileUpload,
  rating,
  singleChoice,
  multipleChoice,
  fullName,
  address,
  legalTerms,
  dateRange,
  inputTable,
  payment
}

import { Answer, FullNameValue } from '@heyform-inc/shared-types-enums'

declare function fileUpload(
  answer: Answer,
  livePreview?: boolean
):
  | {
      filename: any
      url?: undefined
    }
  | {
      filename: any
      url: any
    }
declare function rating(answer: Answer): string
declare function singleChoice(answer: Answer): string
declare function multipleChoice(answer: Answer): string
declare function fullName(answer: Answer): FullNameValue
declare function address(answer: Answer): string
declare function legalTerms(answer: Answer): string
declare function dateRange(answer: Answer): string
declare function inputTable(answer: Answer): string
declare function payment(answer: Answer): string
declare const _default: {
  fileUpload: typeof fileUpload
  rating: typeof rating
  singleChoice: typeof singleChoice
  multipleChoice: typeof multipleChoice
  fullName: typeof fullName
  address: typeof address
  legalTerms: typeof legalTerms
  dateRange: typeof dateRange
  inputTable: typeof inputTable
  payment: typeof payment
}
export default _default

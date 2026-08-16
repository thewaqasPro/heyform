export { htmlToText } from '@heyform-inc/utils'
export declare function isNumber(arg: any): boolean
export declare function isMobilePhone(arg: any): boolean
export declare function getDateFormat(format: string, allowTime?: boolean): string
export declare function isDate(input: string, format?: string): boolean
export declare function isEqual(arg1: unknown, arg2: unknown): boolean
export declare function isContains(arg1: unknown, arg2: unknown): boolean
export declare function isStartsWith(arg1: unknown, arg2: unknown): boolean
export declare function isEndsWith(arg1: unknown, arg2: unknown): boolean
export declare function isGreaterThan(arg1: unknown, arg2: unknown): boolean
export declare function isLessThan(arg1: unknown, arg2: unknown): boolean
export declare function isGreaterOrEqualThan(arg1: unknown, arg2: unknown): boolean
export declare function isLessOrEqualThan(arg1: unknown, arg2: unknown): boolean
export declare function isSameDate(
  value: string,
  expected: string,
  format?: string,
  allowTime?: boolean
): boolean
export declare function isBeforeDate(
  value: string,
  expected: string,
  format?: string,
  allowTime?: boolean
): boolean
export declare function isAfterDate(
  value: string,
  expected: string,
  format?: string,
  allowTime?: boolean
): boolean

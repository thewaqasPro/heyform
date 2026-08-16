import { FormSettings } from '@kyndform/shared-types-enums'
import { BadRequestException } from '@nestjs/common'

export const OPEN_FORM_TOKEN_MAX_AGE_SECONDS = 24 * 60 * 60
export const FORM_PASSWORD_TOKEN_MAX_AGE_SECONDS = 24 * 60 * 60

export function assertFormIsAcceptingSubmissions(settings: FormSettings, now: number): void {
  if (!settings?.enableExpirationDate) {
    return
  }

  if (
    (Number.isFinite(settings.enabledAt) && settings.enabledAt! > 0 && now < settings.enabledAt!) ||
    (Number.isFinite(settings.closedAt) && settings.closedAt! > 0 && now > settings.closedAt!)
  ) {
    throw new BadRequestException('The form is not accepting submissions at this time')
  }
}

export function assertOpenToken(
  token: Record<string, any>,
  formId: string,
  settings: FormSettings,
  now: number
): number {
  const openedAt = token?.timestamp

  if (
    token?.formId !== formId ||
    !Number.isSafeInteger(openedAt) ||
    openedAt < 1 ||
    openedAt > now ||
    now - openedAt > OPEN_FORM_TOKEN_MAX_AGE_SECONDS
  ) {
    throw new BadRequestException('Invalid form token')
  }

  if (
    settings?.enableTimeLimit &&
    Number.isFinite(settings.timeLimit) &&
    settings.timeLimit! > 0 &&
    now - openedAt > settings.timeLimit!
  ) {
    throw new BadRequestException('The form time limit has expired')
  }

  return openedAt
}

export function assertFormPasswordToken(
  token: Record<string, any>,
  formId: string,
  anonymousId: string,
  passwordHash: string,
  now: number
): void {
  const issuedAt = token?.timestamp

  if (
    token?.formId !== formId ||
    token?.anonymousId !== anonymousId ||
    token?.passwordHash !== passwordHash ||
    !Number.isSafeInteger(issuedAt) ||
    issuedAt < 1 ||
    issuedAt > now ||
    now - issuedAt > FORM_PASSWORD_TOKEN_MAX_AGE_SECONDS
  ) {
    throw new BadRequestException('Invalid form password token')
  }
}

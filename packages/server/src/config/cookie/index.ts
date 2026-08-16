import { CookieOptions } from 'express'

import { COOKIE_DOMAIN, COOKIE_MAX_AGE, NODE_ENV, SESSION_MAX_AGE } from '@environments'
import { ms } from '@kyndform/utils'

const commonOptions = {
  domain: COOKIE_DOMAIN,
  sameSite: 'lax',
  signed: false,
  secure: NODE_ENV === 'production'
}

export const COOKIE_SESSION_NAME = 'KYNDFORM_SESSION'
export const COOKIE_LOGIN_IN_NAME = 'KYNDFORM_LOGGED_IN'
export const COOKIE_DEVICE_ID_NAME = 'KYNDFORM_DEVICE_ID'
export const COOKIE_INVITATION_NAME = 'KYNDFORM_INVITATION'

export function CookieOptionsFactory(options?: CookieOptions): CookieOptions {
  return {
    maxAge: ms(COOKIE_MAX_AGE),
    ...commonOptions,
    ...options
  } as any
}

export function SessionOptionsFactory(options?: CookieOptions): CookieOptions {
  return {
    maxAge: ms(SESSION_MAX_AGE),
    httpOnly: true,
    ...commonOptions,
    ...options
  } as any
}

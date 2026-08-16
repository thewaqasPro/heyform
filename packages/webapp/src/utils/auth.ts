import cookies from 'js-cookie'
import store from 'store2'

import { helper, nanoid } from '@kyndform/utils'

import {
  COOKIE_OPTIONS,
  DEVICEID_COOKIE_NAME,
  INVITATION_COOKIE_NAME,
  LOGGED_COOKIE_NAME
} from '@/consts'

export interface InvitationCookieValue {
  teamId: string
  inviteCode: string
}

export function setCookie(key: string, value: string, options = COOKIE_OPTIONS) {
  cookies.set(key, value, options)
}

export function setSessionCookie(key: string, value: string) {
  const options = {
    ...COOKIE_OPTIONS
  }

  delete options.expires
  setCookie(key, value, options)
}

export function getCookie(key: string) {
  return cookies.get(key)
}

export function clearCookie(key: string) {
  cookies.remove(key, {
    domain: COOKIE_OPTIONS.domain,
    path: '/',
    sameSite: COOKIE_OPTIONS.sameSite,
    secure: COOKIE_OPTIONS.secure
  })

  cookies.remove(key, {
    path: '/',
    sameSite: COOKIE_OPTIONS.sameSite,
    secure: COOKIE_OPTIONS.secure
  })
}

export function setInvitationCookie(value: InvitationCookieValue) {
  setSessionCookie(INVITATION_COOKIE_NAME, JSON.stringify(value))
}

export function getInvitationCookie(): InvitationCookieValue | undefined {
  const value = getCookie(INVITATION_COOKIE_NAME)

  if (!value) {
    return
  }

  try {
    const invitation = JSON.parse(value)

    if (
      typeof invitation?.teamId === 'string' &&
      helper.isValid(invitation.teamId) &&
      typeof invitation?.inviteCode === 'string' &&
      helper.isValid(invitation.inviteCode)
    ) {
      return invitation
    }
  } catch {}

  clearInvitationCookie()
}

export function hasInvitationCookie(): boolean {
  return helper.isValid(getInvitationCookie())
}

export function clearInvitationCookie() {
  clearCookie(INVITATION_COOKIE_NAME)
}

export function getAuthState() {
  const value = getCookie(LOGGED_COOKIE_NAME)
  return helper.isTrue(value)
}

export function clearAuthState() {
  Object.keys(localStorage).forEach(key => {
    if (key !== DEVICEID_COOKIE_NAME) {
      store.remove(key)
    }
  })

  clearCookie(LOGGED_COOKIE_NAME)
}

export function getDeviceId() {
  const storage = store.get(DEVICEID_COOKIE_NAME)
  const cookie = getCookie(DEVICEID_COOKIE_NAME)

  if (helper.isValid(storage)) {
    if (!helper.isEqual(storage, cookie)) {
      setCookie(DEVICEID_COOKIE_NAME, storage)
    }

    return storage
  } else if (helper.isValid(cookie)) {
    store.set(DEVICEID_COOKIE_NAME, cookie)
    return cookie
  }
}

export function setDeviceId() {
  const deviceId = nanoid(12)

  setCookie(DEVICEID_COOKIE_NAME, deviceId)
  store.set(DEVICEID_COOKIE_NAME, deviceId)
}

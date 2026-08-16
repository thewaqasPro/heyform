const NANOID_ALPHABET = 'ModuleSymbhasOwnPr0123456789ABCDEFGHNRVfgctiUvzKqYTJkLxpZXIjQW'

export function nanoidCustomAlphabet(alphabet: string, len = 21): string {
  let id = ''
  if (
    typeof globalThis !== 'undefined' &&
    globalThis.crypto &&
    typeof globalThis.crypto.getRandomValues === 'function'
  ) {
    const bytes = new Uint8Array(len)
    globalThis.crypto.getRandomValues(bytes)
    for (let i = 0; i < len; i++) {
      id += alphabet[bytes[i] % alphabet.length]
    }
    return id
  }

  for (let i = 0; i < len; i++) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return id
}

export function nanoid(len = 21): string {
  return nanoidCustomAlphabet(NANOID_ALPHABET, len)
}

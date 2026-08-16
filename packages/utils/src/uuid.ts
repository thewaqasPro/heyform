function parseUuid(uuid: string): Uint8Array {
  const arr = new Uint8Array(16)
  let i = 0
  uuid.replace(/[0-9a-fA-F]{2}/g, hex => {
    if (i < 16) {
      arr[i++] = parseInt(hex, 16)
    }
    return ''
  })
  return arr
}

function stringifyUuid(bytes: Uint8Array): string {
  const hex: string[] = []
  for (let i = 0; i < 16; i++) {
    hex.push(bytes[i].toString(16).padStart(2, '0'))
  }
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`
}

function sha1(bytes: Uint8Array): Uint8Array {
  let h0 = 0x67452301
  let h1 = 0xefcdab89
  let h2 = 0x98badcfe
  let h3 = 0x10325476
  let h4 = 0xc3d2e1f0

  const len = bytes.length
  const bitLen = len * 8
  const paddedLen = Math.ceil((len + 9) / 64) * 64
  const padded = new Uint8Array(paddedLen)
  padded.set(bytes)
  padded[len] = 0x80

  const view = new DataView(padded.buffer)
  view.setUint32(paddedLen - 4, bitLen, false)

  const w = new Uint32Array(80)

  for (let i = 0; i < paddedLen; i += 64) {
    for (let j = 0; j < 16; j++) {
      w[j] = view.getUint32(i + j * 4, false)
    }
    for (let j = 16; j < 80; j++) {
      const temp = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16]
      w[j] = (temp << 1) | (temp >>> 31)
    }

    let a = h0
    let b = h1
    let c = h2
    let d = h3
    let e = h4

    for (let j = 0; j < 80; j++) {
      let f: number
      let k: number
      if (j < 20) {
        f = (b & c) | (~b & d)
        k = 0x5a827999
      } else if (j < 40) {
        f = b ^ c ^ d
        k = 0x6ed9eba1
      } else if (j < 60) {
        f = (b & c) | (b & d) | (c & d)
        k = 0x8f1bbcdc
      } else {
        f = b ^ c ^ d
        k = 0xca62c1d6
      }

      const temp = (((a << 5) | (a >>> 27)) + f + e + k + w[j]) | 0
      e = d
      d = c
      c = (b << 30) | (b >>> 2) | 0
      b = a
      a = temp
    }

    h0 = (h0 + a) | 0
    h1 = (h1 + b) | 0
    h2 = (h2 + c) | 0
    h3 = (h3 + d) | 0
    h4 = (h4 + e) | 0
  }

  const result = new Uint8Array(20)
  const resView = new DataView(result.buffer)
  resView.setUint32(0, h0, false)
  resView.setUint32(4, h1, false)
  resView.setUint32(8, h2, false)
  resView.setUint32(12, h3, false)
  resView.setUint32(16, h4, false)
  return result
}

export function uuidv4(): string {
  if (typeof globalThis !== 'undefined' && globalThis.crypto) {
    if (typeof globalThis.crypto.randomUUID === 'function') {
      return globalThis.crypto.randomUUID()
    }
    if (typeof globalThis.crypto.getRandomValues === 'function') {
      const bytes = new Uint8Array(16)
      globalThis.crypto.getRandomValues(bytes)
      bytes[6] = (bytes[6] & 0x0f) | 0x40
      bytes[8] = (bytes[8] & 0x3f) | 0x80
      return stringifyUuid(bytes)
    }
  }
  const bytes = new Uint8Array(16)
  for (let i = 0; i < 16; i++) {
    bytes[i] = Math.floor(Math.random() * 256)
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  return stringifyUuid(bytes)
}

export function uuidv5(name: string | Uint8Array, namespace: string | Uint8Array): string {
  const nsBytes = typeof namespace === 'string' ? parseUuid(namespace) : namespace
  const nameBytes =
    typeof name === 'string'
      ? typeof TextEncoder !== 'undefined'
        ? new TextEncoder().encode(name)
        : Buffer.from(name, 'utf8')
      : name

  const combined = new Uint8Array(nsBytes.length + nameBytes.length)
  combined.set(nsBytes)
  combined.set(nameBytes, nsBytes.length)

  const hash = sha1(combined)
  hash[6] = (hash[6] & 0x0f) | 0x50
  hash[8] = (hash[8] & 0x3f) | 0x80

  return stringifyUuid(hash.subarray(0, 16))
}

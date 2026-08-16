interface HTMLWalkOptions {
  allowedTags?: string[]
  allowedBlockTags?: string[]
  allowedAttributes?: string[]
  plain?: boolean
  livePreview?: boolean
}
export declare function isUnsafeUrlProtocol(value: unknown): boolean
declare function purge(html: string, option?: HTMLWalkOptions): string
declare function parse(html: string, option?: HTMLWalkOptions): any[]
declare function serialize(schemas?: any[], option?: HTMLWalkOptions): string
declare function plain(html: string, limit?: number): string
export declare const htmlUtils: {
  parse: typeof parse
  serialize: typeof serialize
  purge: typeof purge
  plain: typeof plain
}
export {}

'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.htmlUtils = exports.isUnsafeUrlProtocol = void 0
const html5parser_1 = require('html5parser')
const utils_1 = require('@heyform-inc/utils')
const ALLOWED_BLOCK_TAGS = ['div', 'h1', 'h2', 'h3', 'p', 'br']
const ALLOWED_TAGS = [
  'text',
  'span',
  'bold',
  'strong',
  'code',
  'a',
  'b',
  'i',
  'u',
  's',
  'mention',
  'variable',
  'hiddenfield'
]
const ALLOWED_ATTRIBUTES = [
  'href',
  'class',
  'data-mention',
  'data-variable',
  'data-hiddenfield',
  'contenteditable'
]
const UNSAFE_URL_PROTOCOLS = new Set(['javascript', 'vbscript', 'data'])
const URL_PROTOCOL_CONTROL_CHARS_REGEX = /[\u0000-\u001f\u007f\s]+/g
function isUnsafeUrlProtocol(value) {
  const matched = String(value || '')
    .trimStart()
    .match(/^([^:]+):/)
  if (!matched) {
    return false
  }
  const protocol = matched[1].replace(URL_PROTOCOL_CONTROL_CHARS_REGEX, '').toLowerCase()
  return UNSAFE_URL_PROTOCOLS.has(protocol)
}
exports.isUnsafeUrlProtocol = isUnsafeUrlProtocol
function escapeText(value) {
  return String(value).replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
function getAttributes(row, allowedAttributes = []) {
  const result = {}
  if (utils_1.helper.isValidArray(row)) {
    row.forEach(a => {
      var _a
      const name = a.name.value.toLowerCase()
      const value = (_a = a.value) === null || _a === void 0 ? void 0 : _a.value
      if (allowedAttributes.includes(name)) {
        if (name === 'href' && utils_1.helper.isValid(value) && isUnsafeUrlProtocol(value)) {
          return
        }
        result[name] = value
      }
    })
  }
  return result
}
function walk(node, option) {
  let tag = (node.name || node.type).toLowerCase()
  const allowedTags = option.allowedTags.concat(option.allowedBlockTags || ALLOWED_BLOCK_TAGS)
  if (allowedTags.includes(tag)) {
    const text = node.value
    if (tag === 'text') {
      return text
    }
    let attributes = getAttributes(node.attributes, option.allowedAttributes)
    if (tag === 'span') {
      const mentionId = attributes['data-mention']
      const variableId = attributes['data-variable']
      if (utils_1.helper.isValid(mentionId)) {
        tag = 'mention'
        attributes = {
          id: mentionId
        }
      } else if (utils_1.helper.isValid(variableId)) {
        tag = 'variable'
        attributes = {
          id: variableId
        }
      }
    }
    const schema = [tag]
    if (utils_1.helper.isValidArray(node.body)) {
      const body = node.body.map(child => walk(child, option))
      if (utils_1.helper.isValidArray(body)) {
        schema.push(body)
      }
    }
    if (utils_1.helper.isValid(attributes)) {
      schema.push(attributes)
    }
    return schema
  }
}
function purge(html, option) {
  const schemas = parse(html, option)
  return serialize(schemas, option)
}
function parse(html, option) {
  if (utils_1.helper.isEmpty(html)) {
    return []
  }
  const result = (0, html5parser_1.parse)(html)
  const customOption = Object.assign(
    { allowedTags: ALLOWED_TAGS, allowedAttributes: ALLOWED_ATTRIBUTES },
    option
  )
  return result.map(node => walk(node, customOption)).filter(Boolean)
}
function serialize(schemas, option) {
  if (!utils_1.helper.isValidArray(schemas)) {
    return ''
  }
  const customOption = Object.assign(
    { allowedTags: ALLOWED_TAGS, allowedAttributes: ALLOWED_ATTRIBUTES },
    option
  )
  const allowedTags = customOption.allowedTags.concat(
    customOption.allowedBlockTags || ALLOWED_BLOCK_TAGS
  )
  return schemas
    .map(schema => {
      if (utils_1.helper.isString(schema)) {
        return escapeText(schema)
      }
      if (!utils_1.helper.isValidArray(schema)) {
        return ''
      }
      let [tag, body, attributes] = schema
      if (
        !allowedTags.includes(tag) ||
        (utils_1.helper.isEmpty(body) && utils_1.helper.isEmpty(attributes) && tag !== 'br')
      ) {
        return ''
      }
      if (customOption.plain) {
        return serialize(body, customOption)
      }
      if (tag === 'br') {
        return '<br />'
      }
      let property = ''
      if (utils_1.helper.isValid(attributes)) {
        if (tag === 'mention') {
          attributes = {
            class: 'mention',
            contenteditable: 'false',
            'data-mention': attributes.id
          }
        } else if (tag === 'variable') {
          attributes = {
            class: 'variable',
            contenteditable: 'false',
            'data-variable': attributes.id
          }
        } else if (tag === 'a') {
          attributes.target = '_blank'
          attributes.rel = 'noreferrer'
        }
        property = Object.keys(attributes)
          .filter(key => customOption.allowedAttributes.includes(key))
          .filter(key => key !== 'href' || !isUnsafeUrlProtocol(attributes[key]))
          .map(key => ` ${key}="${escapeAttribute(attributes[key])}"`)
          .join('')
      }
      if (tag === 'mention' || tag === 'variable') {
        tag = 'span'
        if (customOption.livePreview) {
          body = ['_____']
        }
      }
      return `<${tag}${property}>${serialize(body, customOption)}</${tag}>`
    })
    .join('')
}
function plain(html, limit = 0) {
  if (utils_1.helper.isEmpty(html)) {
    return ''
  }
  const result = (0, utils_1.htmlToText)(html, 0)
  if (limit > 0) {
    let sliced = result.slice(0, limit)
    if (result.length > limit) {
      sliced += '...'
    }
    return sliced
  }
  return result
}
exports.htmlUtils = {
  parse,
  serialize,
  purge,
  plain
}
//# sourceMappingURL=html-utils.js.map

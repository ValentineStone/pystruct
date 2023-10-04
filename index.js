'use strict'

const { getFloat16, setFloat16 } = require('@petamoriken/float16')

const defaultLittleEndian = new Uint8Array(new Uint16Array([0x00ff]).buffer)[0]

const typeLengths = {
  x: 1,
  c: 1,
  b: 1,
  B: 1,
  '?': 1,
  h: 2,
  H: 2,
  i: 4,
  I: 4,
  l: 4,
  L: 4,
  q: 8,
  Q: 8,
  n: 4,
  N: 4,
  e: 2,
  f: 4,
  d: 8,
  s: 0,
  p: 256,
  P: 4,
}

const bind = v => v.call.bind(v)

const typeUnpackers = {
  x: () => undefined,
  c: (view, offs) => String.fromCharCode(view.getUint8(offs)),
  b: bind(DataView.prototype.getInt8),
  B: bind(DataView.prototype.getUint8),
  '?': (view, offs) => !!view.getUint8(offs),
  h: bind(DataView.prototype.getInt16),
  H: bind(DataView.prototype.getUint16),
  i: bind(DataView.prototype.getInt32),
  I: bind(DataView.prototype.getUint32),
  l: bind(DataView.prototype.getInt32),
  L: bind(DataView.prototype.getUint32),
  q: bind(DataView.prototype.getBigInt64),
  Q: bind(DataView.prototype.getBigUint64),
  n: bind(DataView.prototype.getInt32),
  N: bind(DataView.prototype.getUint32),
  e: getFloat16,
  f: bind(DataView.prototype.getFloat32),
  d: bind(DataView.prototype.getFloat64),
  s: (view, offs, leIgnored, len) =>new Uint8Array(view.buffer, view.byteOffset + offs, len),
  p: (view, offs) => {
    const len = view.getUint8(offs)
    return new Uint8Array(view.buffer, view.byteOffset + offs + 1, len)
  },
  P: bind(DataView.prototype.getUint32),
}

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()
const emptyUint8Array = new Uint8Array(0)

const typePackers = {
  x: () => undefined,
  c: (view, offs, value, leIgnored) => view.setUint8(offs, value.charCodeAt()),
  b: bind(DataView.prototype.setInt8),
  B: bind(DataView.prototype.setUint8),
  '?': (view, offs, value, leIgnored) => view.setUint8(offs, value ? 1 : 0),
  h: bind(DataView.prototype.setInt16),
  H: bind(DataView.prototype.setUint16),
  i: bind(DataView.prototype.setInt32),
  I: bind(DataView.prototype.setUint32),
  l: bind(DataView.prototype.setInt32),
  L: bind(DataView.prototype.setUint32),
  q: bind(DataView.prototype.setBigInt64),
  Q: bind(DataView.prototype.setBigUint64),
  n: bind(DataView.prototype.setInt32),
  N: bind(DataView.prototype.setUint32),
  e: setFloat16,
  f: bind(DataView.prototype.setFloat32),
  d: bind(DataView.prototype.setFloat64),
  s: (view, offs, value, leIgnored, len) => {
    const viewSlice = new Uint8Array(view.buffer, view.byteOffset + offs)
    if (value instanceof ArrayBuffer)
      viewSlice.set(new Uint8Array(value))
    else if (value instanceof Uint8Array)
      viewSlice.set(value)
    else if (value !== undefined)
      textEncoder.encodeInto(String(value), viewSlice)
    return len
  },
  p: (view, offs, value, leIgnored) => {
    const viewSlice = new Uint8Array(view.buffer, view.byteOffset + offs + 1)
    let len = value?.byteLength || 0
    if (value instanceof ArrayBuffer)
      viewSlice.set(new Uint8Array(value))
    else if (value instanceof Uint8Array)
      viewSlice.set(value)
    else if (value !== undefined) {
      const { written } = textEncoder.encodeInto(String(value), viewSlice)
      len = written
    }
    len = Math.min(len, 255)
    view.setUint8(offs, len)
    return len + 1
  },
  P: bind(DataView.prototype.setUint32),
}

const parseFormat = format => {
  let littleEndian
  const ch = format[0]
  if (ch === '<')
    littleEndian = true
  else if (ch === '>' || ch === '!')
    littleEndian = false
  else if (ch === '=')
    littleEndian = defaultLittleEndian
  else
    throw new Error(
      'Using native size and alignment ' +
      '(first character is \'@\' or ommited) is not supported!'
    )

  let numstr = ''
  const parsedFormat = []
  let maxLength = 0

  for (let i = 1; i < format.length; i++) {
    const ch = format[i]
    if (isNaN(ch)) {
      if (!(ch in typeLengths))
        throw new Error(`Unknown format character '${ch}'`)
      let num = numstr === '' ? 1 : +numstr
      numstr = ''
      if (ch === 's') {
        parsedFormat.push([ch, num])
        maxLength += num
      }
      else {
        for (let i = 0; i < num; i++)
          parsedFormat.push([ch, 1])
        maxLength += num * typeLengths[ch]
      }
    } else {
      numstr = numstr + ch
    }
  }

  return { parsedFormat, littleEndian, maxLength }
}

const textify = v => v.map(
  v => v instanceof ArrayBuffer ? textDecoder.decode(v) : v)

const unpack = (format, buff, stringify = false) => {
  const view = new DataView(buff.buffer, buff.byteOffset)
  const { parsedFormat, littleEndian: le } =
    typeof format === 'string' ? parseFormat(format) : format
  const unpacked = []
  let pointer = 0
  for (const [ch, len] of parsedFormat) {
    const value = typeUnpackers[ch](view, pointer, le, len)
    if (ch === 's')
      pointer += len
    else if (ch === 'p')
      pointer += 1 + value.byteLength
    else
      pointer += typeLengths[ch]
    unpacked.push(value)
  }
  return stringify ? textify(unpacked) : unpacked
}

const pack = (format, values, packInto) => {
  const { parsedFormat, littleEndian: le, maxLength } =
    typeof format === 'string' ? parseFormat(format) : format
  let view
  let packed

  if (packInto) {
    if (packInto.byteLength < maxLength)
      throw new Error('Can not pack into, provided buffer is smaller than required by this format')
    view = new DataView(packInto.buffer, packInto.byteOffset)
  } else {
    packed = new Uint8Array(maxLength)
    view = new DataView(packed.buffer, packed.byteOffset)
  }
  let pointer = 0

  for (const [ch, len] of parsedFormat) {
    const v = values.shift()
    const packedLen = typePackers[ch](view, pointer, v, le, len)
    if (ch === 's' || ch === 'p')
      pointer += packedLen
    else
      pointer += typeLengths[ch]
  }

  if (packInto)
    return pointer
  else
    return packed.byteLength > pointer
      ? packed.slice(0, pointer)
      : packed

}

module.exports = {
  unpack,
  pack,
  parseFormat,
}
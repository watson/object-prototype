'use strict'

const functions = require('object-prototype-functions').nodejs

const ObjectPrototype = Object.create(null)

exports.ObjectPrototype = ObjectPrototype
exports.create = () => Object.create(ObjectPrototype)
exports.assign = (...args) => Object.assign(exports.create(), ...args)

const descriptors = {
  ['__proto__']: {
    get () {
      return Object.getPrototypeOf(this)
    },
    set (proto) {
      Object.setPrototypeOf(this, proto)
    },
    enumerable: false,
    configurable: true
  },
  constructor: {
    value: undefined, // NOTE: This doesn't try to mimic the usual Object behavior
    writable: true,
    enumerable: false,
    configurable: true
  }
}

for (const name of functions) {
  const descriptor = Object.getOwnPropertyDescriptor(Object.prototype, name)
  descriptor.value = prototypelessFunction(descriptor.value)
  descriptors[name] = descriptor
}

Object.defineProperties(ObjectPrototype, descriptors)

function prototypelessFunction (original) {
  const wrapper = function () {
    return original.apply(this, arguments)
  }
  Object.setPrototypeOf(wrapper, null)
  return wrapper
}

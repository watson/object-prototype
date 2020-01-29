'use strict'

const functions = require('object-prototype-functions').nodejs

const ObjectPrototype = Object.create(null)

exports.ObjectPrototype = ObjectPrototype
exports.create = () => Object.create(ObjectPrototype)
exports.assign = (...args) => Object.assign(exports.create(), ...args)

for (const name of functions) {
  ObjectPrototype[name] = prototypelessFunction(Object.prototype[name])
}

function prototypelessFunction (original) {
  const wrapper = function () {
    return original.apply(this, arguments)
  }
  Object.setPrototypeOf(wrapper, null)
  return wrapper
}

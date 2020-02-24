'use strict'

const functions = require('object-prototype-functions').nodejs

const ObjectPrototype = Object.create(null)
const FunctionPrototype = Object.create(ObjectPrototype)

exports.ObjectPrototype = ObjectPrototype
exports.create = () => Object.create(ObjectPrototype)
exports.assign = (...args) => Object.assign(exports.create(), ...args)

exports.FunctionPrototype = FunctionPrototype
exports.safePrototypeFunction = safePrototypeFunction

// ObjectPrototype
{
  const descriptors = {
    ['__proto__']: {
      get: safePrototypeFunction(function () {
        return Object.getPrototypeOf(this)
      }),
      set: safePrototypeFunction(function (proto) {
        Object.setPrototypeOf(this, proto)
      }),
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
    descriptor.value = safePrototypeFunction(descriptor.value)
    descriptors[name] = descriptor
  }

  Object.defineProperties(ObjectPrototype, descriptors)
}

// FunctionPrototype
{
  const descriptors = {
    ['__proto__']: {
      get: safePrototypeFunction(function () {
        return Object.getPrototypeOf(this)
      }),
      set: safePrototypeFunction(function (proto) {
        Object.setPrototypeOf(this, proto)
      }),
      enumerable: false,
      configurable: true
    },
    length: { value: 0, writable: false, enumerable: false, configurable: true },
    name: { value: '', writable: false, enumerable: false, configurable: true },
    arguments: {
      get: safePrototypeFunction(function () {
        return Function.prototype.__lookupGetter__('arguments')()
      }),
      set: safePrototypeFunction(function (v) {
        Function.prototype.__lookupSetter__('arguments')(v)
      }),
      enumerable: false,
      configurable: true
    },
    caller: {
      get: safePrototypeFunction(function () {
        return Function.prototype.__lookupGetter__('caller')()
      }),
      set: safePrototypeFunction(function (v) {
        Function.prototype.__lookupSetter__('caller')(v)
      }),
      enumerable: false,
      configurable: true
    },
    constructor: {
      value: undefined, // NOTE: This doesn't try to mimic the usual Object behavior
      writable: true,
      enumerable: false,
      configurable: true
    },
    apply: {
      value: function apply () {
        return Function.prototype.apply.apply(this, arguments)
      },
      writable: true,
      enumerable: false,
      configurable: true
    },
    bind: {
      value: function bind () {
        const bound = Function.prototype.bind.apply(this, arguments)
        Object.setPrototypeOf(bound, FunctionPrototype)
        return bound
      },
      writable: true,
      enumerable: false,
      configurable: true
    },
    call: {
      value: function call () {
        return Function.prototype.call.apply(this, arguments)
      },
      writable: true,
      enumerable: false,
      configurable: true
    },
    toString: {
      value: function toString () {
        // TODO: Should we really do this?
        return `function ${this.name}() { [native code] }`
        // Alternatively we expose the normal behavior:
        // return Function.prototype.toString.apply(this, arguments)
      },
      writable: true,
      enumerable: false,
      configurable: true
    }

    // NOTE: I skipped overriding Function.prototype[Symbol.hasInstance] as
    // this function would only be called if `FunctionPrototype` is on the
    // right hand side of the `instaceof` symbol.
  }

  Object.setPrototypeOf(descriptors.apply, FunctionPrototype)
  Object.setPrototypeOf(descriptors.bind, FunctionPrototype)
  Object.setPrototypeOf(descriptors.call, FunctionPrototype)
  Object.setPrototypeOf(descriptors.toString, FunctionPrototype)

  Object.defineProperties(FunctionPrototype, descriptors)
}

function safePrototypeFunction (original, name) {
  name = name || original.name

  // In strict mode, the expected descriptors are: length, name, prototype
  // In non-strict mode, the expected descriptors are: length, name, arguments, caller, prototype
  const descriptors = Object.getOwnPropertyDescriptors(original)
  delete descriptors.name // will be set automatally when the function is created below
  delete descriptors.prototype // we'll use the `wrapped` functions own `prototype` property

  // Hack to give the function the same name as the original
  const wrapped = ({
    [name]: function () {
      return original.apply(this, arguments)
    }
  })[name]

  Object.defineProperties(wrapped, descriptors)

  Object.setPrototypeOf(wrapped, FunctionPrototype)
  Object.setPrototypeOf(wrapped.prototype, ObjectPrototype)

  return wrapped
}

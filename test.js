'use strict'

/* eslint-disable no-prototype-builtins, no-proto */

const test = require('tape')
const functions = require('object-prototype-functions').nodejs
const { create, assign, ObjectPrototype } = require('./')

const generators = [
  create,
  assign,
  () => Object.create(ObjectPrototype)
]

generators.forEach(generator => {
  test('functionProto', function (t) {
    t.equal(functionProto(function () {}), Object.prototype)
    t.equal(functionProto(() => {}), Object.prototype)
    t.end()
  })

  test('functions doesn\'t leak', function (t) {
    const obj = generator()
    for (const name of functions) {
      t.notEqual(functionProto(obj[name]), Object.prototype, name)
    }
    t.end()
  })

  test('inheritance', function (t) {
    t.plan(3)

    let obj = Object.create(generator())

    do {
      t.notEqual(obj, Object.prototype, 'should not inherit from Object.prototype')
    } while ((obj = Object.getPrototypeOf(obj)) !== null)

    t.end()
  })

  test('__proto__', function (t) {
    const obj = generator()
    t.equal(obj.__proto__, undefined)
    t.end()
  })

  test('constructor', function (t) {
    const obj = generator()
    t.equal(obj.constructor, undefined)
    t.end()
  })

  test('hasOwnProperty', function (t) {
    const obj1 = generator()
    const obj2 = Object.create(obj1)
    obj1.foo = 42
    t.equal(obj1.hasOwnProperty('foo'), true)
    t.equal(obj1.hasOwnProperty('bar'), false)
    t.equal(obj1.hasOwnProperty('hasOwnProperty'), false)
    t.equal(obj2.hasOwnProperty('foo'), false)
    t.equal(obj2.hasOwnProperty('hasOwnProperty'), false)
    t.end()
  })

  test('isPrototypeOf', function (t) {
    const obj1 = generator()
    const obj2 = Object.create(obj1)
    t.equal(Object.prototype.isPrototypeOf(ObjectPrototype), false)
    t.equal(Object.prototype.isPrototypeOf(obj1), false)
    t.equal(Object.prototype.isPrototypeOf(obj2), false)
    t.equal(ObjectPrototype.isPrototypeOf(obj1), true)
    t.equal(ObjectPrototype.isPrototypeOf(obj2), true)
    t.equal(obj1.isPrototypeOf(obj2), true)
    t.equal(obj2.isPrototypeOf(obj1), false)
    t.end()
  })

  test('propertyIsEnumerable', function (t) {
    const obj = generator()
    Object.defineProperty(obj, 'foo', { enumerable: false })
    Object.defineProperty(obj, 'bar', { enumerable: true })
    t.equal(obj.propertyIsEnumerable('foo'), false)
    t.equal(obj.propertyIsEnumerable('bar'), true)
    t.equal(obj.propertyIsEnumerable('invalid'), false)
    t.end()
  })

  test('toLocaleString', function (t) {
    const obj = generator()
    t.equal(obj.toLocaleString(), obj.toString())
    t.end()
  })

  test('toString', function (t) {
    const obj = generator()
    t.equal(obj.toString(), '[object Object]')
    t.end()
  })

  test('valueOf', function (t) {
    const obj = generator()
    t.deepEqual(obj.valueOf(), obj)
    t.end()
  })

  test('__defineGetter__', function (t) {
    const obj = generator()
    obj.__defineGetter__('foo', () => 'works!')
    t.equal(obj.foo, 'works!')
    t.end()
  })

  test('__defineSetter__', function (t) {
    const obj = generator()
    obj.__defineSetter__('foo', (x) => {
      t.equal(x, 'works!')
      t.end()
    })
    obj.foo = 'works!'
  })

  test('__lookupGetter__', function (t) {
    const obj = generator()
    obj.__defineGetter__('foo', () => 'works!')
    const getter = obj.__lookupGetter__('foo')
    t.equal(getter(), 'works!')
    t.end()
  })

  test('__lookupSetter__', function (t) {
    const obj = generator()
    obj.__defineSetter__('foo', (x) => {
      t.equal(x, 'works!')
      t.end()
    })
    const setter = obj.__lookupSetter__('foo')
    setter('works!')
  })
})

test('assign', function (t) {
  const obj1 = { a: 1, b: 2 }
  const obj2 = { a: 2, c: 3 }
  const obj3 = assign(obj1, obj2)
  obj1.b = 42
  obj2.c = 42
  t.equal(obj3.a, 2)
  t.equal(obj3.b, 2)
  t.equal(obj3.c, 3)
  obj3.a = 42
  t.equal(obj1.a, 1)
  t.equal(obj2.a, 2)
  t.end()
})

function functionProto (fn) {
  return (
    fn &&
    fn.constructor &&
    fn.constructor.prototype &&
    fn.constructor.prototype.__proto__
  ) || (
    fn &&
    fn.constructor &&
    fn.constructor.__proto__ &&
    fn.constructor.__proto__.__proto__
  )
}

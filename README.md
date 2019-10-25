# object-prototype

A replacement prototype for `Object.prototype` with all the same
functions.

[![npm](https://img.shields.io/npm/v/object-prototype.svg)](https://www.npmjs.com/package/object-prototype)
[![build status](https://travis-ci.org/watson/object-prototype.svg?branch=master)](https://travis-ci.org/watson/object-prototype)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Installation

```
npm install object-prototype --save
```

## Usage

```js
const { create } = require('object-prototype')

const obj1 = create()
const obj2 = {}

console.log(Object.prototype.isPrototypeOf(obj1)) // false
console.log(ObjectPrototype.isPrototypeOf(obj1)) // true

console.log(Object.prototype.isPrototypeOf(obj2)) // true
console.log(ObjectPrototype.isPrototypeOf(obj2)) // false

Object.prototype.foo = 42

console.log(obj1.foo) // undefined
console.log(obj2.foo) // 42
```

## API

### `ObjectPrototype`

The `ObjectPrototype` property exposed by this module is ment as a
replacement to `Object.prototype` and has the following functions:

- [`ObjectPrototype.hasOwnProperty()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)
- [`ObjectPrototype.isPrototypeOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isPrototypeOf)
- [`ObjectPrototype.propertyIsEnumerable()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable)
- [`ObjectPrototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toLocaleString)
- [`ObjectPrototype.toString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)
- [`ObjectPrototype.valueOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf)

### `object = create()`

The `create` function is a convenience function that returns a new
object with `ObjectPrototype` as its prototype.

This is equivalent to writing `Object.create(ObjectPrototype)`.

## License

[MIT](LICENSE)

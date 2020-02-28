module.exports = function (name, fn) {
  if (isSloppy(fn)) {
    // Hack to give the function the same name as the original
    return ({
      [name]: function () {
        return fn.apply(this, arguments)
      }
    })[name]
  } else {
    // Hack to give the function the same name as the original
    return ({
      [name]: function () {
        'use strict'
        return fn.apply(this, arguments)
      }
    })[name]
  }
}

function isSloppy (fn) {
  return Object.prototype.hasOwnProperty.call(fn, 'caller')
}

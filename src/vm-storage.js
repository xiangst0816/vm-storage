/**
 * Created by Hsiang on 2017/3/2.
 * @module Storage
 * @description
 * @licence MIT
 * @author Hisang
 *
 * For more detail? please direct to [here](https://github.com/xiangsongtao/vm-storage)
 *
 * NOTICE: This is written by ES2015! You will need babel to compile or run `npm dev`.
 *
 * ### for Babel
 *
 * ```
 * npm install --global babel-cli
 * npm install --save-dev babel-preset-es2015
 *
 * ```
 */
const VERSION = '0.1.2'
module.exports = {
  version: VERSION,
  install (Vue, options) {
    Object.assign(Vue.prototype, {
      $localStorage: new Storage('localStorage', options),
      $sessionStorage: new Storage('sessionStorage', options)
    })
  }
}

const isBoolean = (val) => typeof val === 'boolean'
const isString = (val) => typeof val === 'string'
const isNumber = (val) => typeof val === 'number'
const isFunction = (val) => typeof val === 'function'
const isDefined = (val) => typeof val !== 'undefined'
const isUndefined = (val) => typeof val === 'undefined'
const isPresent = (val) => val !== undefined && val !== null
const isBlank = (val) => val === undefined || val === null || val === ''
const isObject = (val) => typeof val === 'object'
const isPlainObject = (val) => isObject(val) && Object.getPrototypeOf(val) == Object.prototype

const isArray = Array.isArray
const isPrimitive = (val) => isString(val) || isBoolean(val) || (isNumber(val) && !isNaN(val))

const serializer = (value) => {
  try {
    return JSON.parse(value)
  } catch (err) {
    return value
  }
}
const deserializer = JSON.stringify

/**
 * @class Storage
 * @description
 * Storage class to init instance
 * */
class Storage {

  /**
   * @param {string} storageType
   * @param {object} options
   * */
  constructor (storageType, options = {}) {
    this._version = VERSION
    this._prefix = null // storage profix
    this._storage = null // current storage function, if not support, it will be false
    this._prefixLength = null // prefix length
    this._storageType = null // storage type: localStorage/sessionStorage
    // this._localStore = {} // 缓存内容
    this.length = 0

    this._storageType = storageType

    if (isPresent(options.prefix)) {
      this._prefix = options.prefix.toString().trim()
    } else {
      this._prefix = ''
    }

    if (this._prefix.indexOf('_') === 0) {
      console.error('The vm-storage prefix shoule not start with "_"!')
      return
    }

    this._prefixLength = this._prefix.length
    this._storage = this._isStorageSupported(window, storageType) // return localStorage or sessionStorage

    // check whether support storage function, if not then use fallback function to handle
    if (!this.supported()) {
      console.warn(`Current browser does not support ${this._storageType}, system will fallback to use memory to cache key/value data! storage.js::<Class>Storage`)
    } else {
      // init
      for (let i = 0, l = this._storage.length, k; i < l; i++) {
        // #8, #10: ` _storage.key(i)` may be an empty string (or throw an exception in IE9 if ` _storage` is empty)
        k = this._storage.key(i)
        if (this._prefix === k.slice(0, this._prefixLength) && k.indexOf('_') !== 0) {
          this.length++
          this[k.slice(this._prefixLength)] = this._storage.getItem(k)
        }
      }

      // addEventListener
      window.addEventListener && window.addEventListener('storage', (event) => {
        if (!event.key) {
          return
        }
        let doc = window.document
        if ((!doc.hasFocus || !doc.hasFocus()) && this._prefix === event.key.slice(0, this._prefixLength)) {
          if (event.newValue) {
            this.setItem(event.key.slice(this._prefixLength), event.newValue)
          } else {
            this.removeItem(event.key.slice(this._prefixLength))
          }
        }
      })
    }
  }

  /**
   * getItem
   * @param {string} key
   * */
  getItem (key) {
    if (isBlank(key))return
    if (key.indexOf('_') === 0) {
      return null
    }
    return this[key]
  }

  /**
   * setItem
   * @param {string} key
   * @param {object|string|function} value
   * */
  setItem (key, value) {
    // deserializer
    if (isBlank(key) || isBlank(value))return
    !isString(key) && (key = key.toString())

    if (key.indexOf('_') === 0) {
      console.warn('setItem()::The key should not start with "_"!')
      return
    }

    if (!isString(value)) {
      console.warn('setItem()::The value shoule be string!')
      return
    }

    if (!this.getItem(key)) {
      this.length++
    }
    this[key] = value
    this.supported() && this._storage.setItem(this._prefix + key, value)
  }

  /**
   * clear all
   * */
  clear () {
    const _this = this
    for (let k in _this) {
      '$' === k[0] || (delete _this[k] && this.supported() && _this._storage.removeItem(_this._prefix + k))
    }
    this.length = 0
  }

  /**
   * removeItem
   * @param {string} key
   * */
  removeItem (key) {
    if (isBlank(key) || !isString(key))return
    if(!!this.getItem(key)){
      this.length--
      delete this[key] && this.supported() && this._storage.removeItem(this._prefix + key)
    }
  }

  key (num) {
    if (!isNumber(num))return
    let keys = Object.keys(this._storage)
    return keys[parseInt(num)]
  }

  /**
   * supported test
   * */
  supported () {
    return !!this._storage
  }

  // -------- private --------

  /**
   * check whether storage is support or not
   * @param {object} window
   * @param {string} storageType - storage name: localStorage/sessionStorage
   * @return {object/boolean}  storage object, such as : window.localStorage/window.sessionStorage. if not support, return false
   * */
  _isStorageSupported (window, storageType) {

    // Some installations of IE, for an unknown reason, throw "SCRIPT5: Error: Access is denied"
    // when accessing window.localStorage. This happens before you try to do anything with it.
    // Catch that error and allow execution to continue.

    // fix 'SecurityError: DOM Exception 18' exception in Desktop Safari, Mobile Safari
    // when "Block cookies": "Always block" is turned on
    let supported
    try {
      supported = window[storageType]
    }
    catch (err) {
      supported = false
    }

    // When Safari (OS X or iOS) is in private browsing mode, it appears as though localStorage and sessionStorage
    // is available, but trying to call .setItem throws an exception below:
    // "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made to add something to storage that exceeded the quota."
    if (supported) {
      let key = '__' + Math.round(Math.random() * 1e7)
      try {
        window[storageType].setItem(key, key)
        window[storageType].removeItem(key, key)
      }
      catch (err) {
        supported = false
      }
    }
    return supported
  }
}

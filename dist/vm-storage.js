'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var VERSION = '0.1.2';
module.exports = {
  version: VERSION,
  install: function install(Vue, options) {
    Object.assign(Vue.prototype, {
      $localStorage: new Storage('localStorage', options),
      $sessionStorage: new Storage('sessionStorage', options)
    });
  }
};

var isBoolean = function isBoolean(val) {
  return typeof val === 'boolean';
};
var isString = function isString(val) {
  return typeof val === 'string';
};
var isNumber = function isNumber(val) {
  return typeof val === 'number';
};
var isFunction = function isFunction(val) {
  return typeof val === 'function';
};
var isDefined = function isDefined(val) {
  return typeof val !== 'undefined';
};
var isUndefined = function isUndefined(val) {
  return typeof val === 'undefined';
};
var isPresent = function isPresent(val) {
  return val !== undefined && val !== null;
};
var isBlank = function isBlank(val) {
  return val === undefined || val === null || val === '';
};
var isObject = function isObject(val) {
  return (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object';
};
var isPlainObject = function isPlainObject(val) {
  return isObject(val) && Object.getPrototypeOf(val) == Object.prototype;
};

var isArray = Array.isArray;
var isPrimitive = function isPrimitive(val) {
  return isString(val) || isBoolean(val) || isNumber(val) && !isNaN(val);
};

var serializer = function serializer(value) {
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
};
var deserializer = JSON.stringify;

/**
 * @class Storage
 * @description
 * Storage class to init instance
 * */

var Storage = function () {

  /**
   * @param {string} storageType
   * @param {object} options
   * */
  function Storage(storageType) {
    var _this2 = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Storage);

    this._version = VERSION;
    this._prefix = null; // storage profix
    this._storage = null; // current storage function, if not support, it will be false
    this._prefixLength = null; // prefix length
    this._storageType = null; // storage type: localStorage/sessionStorage
    // this._localStore = {} // 缓存内容
    this.length = 0;

    this._storageType = storageType;

    if (isPresent(options.prefix)) {
      this._prefix = options.prefix.toString().trim();
    } else {
      this._prefix = '';
    }

    if (this._prefix.indexOf('_') === 0) {
      console.error('The vm-storage prefix shoule not start with "_"!');
      return;
    }

    this._prefixLength = this._prefix.length;
    this._storage = this._isStorageSupported(window, storageType); // return localStorage or sessionStorage

    // check whether support storage function, if not then use fallback function to handle
    if (!this.supported()) {
      console.warn('Current browser does not support ' + this._storageType + ', system will fallback to use memory to cache key/value data! storage.js::<Class>Storage');
    } else {
      // init
      for (var i = 0, l = this._storage.length, k; i < l; i++) {
        // #8, #10: ` _storage.key(i)` may be an empty string (or throw an exception in IE9 if ` _storage` is empty)
        k = this._storage.key(i);
        if (this._prefix === k.slice(0, this._prefixLength) && k.indexOf('_') !== 0) {
          this.length++;
          this[k.slice(this._prefixLength)] = this._storage.getItem(k);
        }
      }

      // addEventListener
      window.addEventListener && window.addEventListener('storage', function (event) {
        if (!event.key) {
          return;
        }
        var doc = window.document;
        if ((!doc.hasFocus || !doc.hasFocus()) && _this2._prefix === event.key.slice(0, _this2._prefixLength)) {
          if (event.newValue) {
            _this2.setItem(event.key.slice(_this2._prefixLength), event.newValue);
          } else {
            _this2.removeItem(event.key.slice(_this2._prefixLength));
          }
        }
      });
    }
  }

  /**
   * getItem
   * @param {string} key
   * */


  _createClass(Storage, [{
    key: 'getItem',
    value: function getItem(key) {
      if (isBlank(key)) return;
      if (key.indexOf('_') === 0) {
        return null;
      }
      return this[key];
    }

    /**
     * setItem
     * @param {string} key
     * @param {object|string|function} value
     * */

  }, {
    key: 'setItem',
    value: function setItem(key, value) {
      // deserializer
      if (isBlank(key) || isBlank(value)) return;
      !isString(key) && (key = key.toString());

      if (key.indexOf('_') === 0) {
        console.warn('setItem()::The key should not start with "_"!');
        return;
      }

      if (!isString(value)) {
        console.warn('setItem()::The value shoule be string!');
        return;
      }

      if (!this.getItem(key)) {
        this.length++;
      }
      this[key] = value;
      this.supported() && this._storage.setItem(this._prefix + key, value);
    }

    /**
     * clear all
     * */

  }, {
    key: 'clear',
    value: function clear() {
      var _this = this;
      for (var k in _this) {
        '$' === k[0] || delete _this[k] && this.supported() && _this._storage.removeItem(_this._prefix + k);
      }
      this.length = 0;
    }

    /**
     * removeItem
     * @param {string} key
     * */

  }, {
    key: 'removeItem',
    value: function removeItem(key) {
      if (isBlank(key) || !isString(key)) return;
      if (!!this.getItem(key)) {
        this.length--;
        delete this[key] && this.supported() && this._storage.removeItem(this._prefix + key);
      }
    }
  }, {
    key: 'key',
    value: function key(num) {
      if (!isNumber(num)) return;
      var keys = Object.keys(this._storage);
      return keys[parseInt(num)];
    }

    /**
     * supported test
     * */

  }, {
    key: 'supported',
    value: function supported() {
      return !!this._storage;
    }

    // -------- private --------

    /**
     * check whether storage is support or not
     * @param {object} window
     * @param {string} storageType - storage name: localStorage/sessionStorage
     * @return {object/boolean}  storage object, such as : window.localStorage/window.sessionStorage. if not support, return false
     * */

  }, {
    key: '_isStorageSupported',
    value: function _isStorageSupported(window, storageType) {

      // Some installations of IE, for an unknown reason, throw "SCRIPT5: Error: Access is denied"
      // when accessing window.localStorage. This happens before you try to do anything with it.
      // Catch that error and allow execution to continue.

      // fix 'SecurityError: DOM Exception 18' exception in Desktop Safari, Mobile Safari
      // when "Block cookies": "Always block" is turned on
      var supported = void 0;
      try {
        supported = window[storageType];
      } catch (err) {
        supported = false;
      }

      // When Safari (OS X or iOS) is in private browsing mode, it appears as though localStorage and sessionStorage
      // is available, but trying to call .setItem throws an exception below:
      // "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made to add something to storage that exceeded the quota."
      if (supported) {
        var key = '__' + Math.round(Math.random() * 1e7);
        try {
          window[storageType].setItem(key, key);
          window[storageType].removeItem(key, key);
        } catch (err) {
          supported = false;
        }
      }
      return supported;
    }
  }]);

  return Storage;
}();

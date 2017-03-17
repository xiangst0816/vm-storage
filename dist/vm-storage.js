'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Hsiang on 2017/3/2.
 *
 * @module Storage
 * @description
 * @licence MIT
 * @author Hsiang <280304286@163.com>
 *
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
module.exports = {
  install: function install(Vue, options) {
    Object.assign(Vue.prototype, {
      $localStorage: new Storage('localStorage', options),
      $sessionStorage: new Storage('sessionStorage', options)
    });
  }
};

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
  function Storage(storageType, options) {
    _classCallCheck(this, Storage);

    this._prefix = null; // storage profix
    this._storage = null; // current storage function, if not support, it will be false
    this._prefixLength = null; // prefix length
    this._storageType = null; // storage type: localStorage/sessionStorage

    this.length = 0;

    this._storageType = storageType;
    if (!!options && !!options.prefix) {
      this._prefix = options.prefix;
    } else {
      this._prefix = 'vmStorage-';
    }
    this._prefixLength = this._prefix.length;
    this._storage = this._isStorageSupported(window, storageType); // return localStorage or sessionStorage

    // check whether support storage function, if not then use fallback function to handle
    if (!this._storage) {
      console.error('Current browser does not support sessionStorage and localStorage, ' + 'system will fallback to use memory to cache key/value data! storage.js::<Class>Storage');
      this._storageFallback();
      // test again
      this._storage = this._isStorageSupported(window, storageType);
    }

    // init
    // if (!this.supported() || this._storageType !== 'localStorage') return;
    for (var i = 0, l = this._storage.length, k; i < l; i++) {
      // #8, #10: ` _storage.key(i)` may be an empty string (or throw an exception in IE9 if ` _storage` is empty)
      k = this._storage.key(i);
      if (this._prefix === k.slice(0, this._prefixLength)) {
        this.length++;
        this[k.slice(this._prefixLength)] = JSON.parse(this._storage.getItem(k));
      }
    }
  }

  /**
   * getItem
   * @param {string} key
   * */


  _createClass(Storage, [{
    key: 'getItem',
    value: function getItem(key) {
      return this[key];
    }

    /**
     * setItem
     * @param {string} key
     * @param {string} value
     * */

  }, {
    key: 'setItem',
    value: function setItem(key, value) {
      this[key] = JSON.parse(JSON.stringify(value));
      this.length++;
      this.supported() && this._storage.setItem(this._prefix + key, JSON.stringify(value));
    }

    /**
     * clear all
     * */

  }, {
    key: 'clear',
    value: function clear() {
      var _this = this;
      this.length = 0;
      for (var k in _this) {
        '$' === k[0] || delete _this[k] && this.supported() && _this._storage.removeItem(_this._prefix + k);
      }
    }

    /**
     * removeItem
     * @param {string} key
     * */

  }, {
    key: 'removeItem',
    value: function removeItem(key) {
      this.length--;
      delete this[key] && this.supported() && this._storage.removeItem(this._prefix + key);
    }

    /**
     * key
     * @param {number} num
     * */

  }, {
    key: 'key',
    value: function key(num) {
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

    /**
     * if not support, then rollback to use memory to catch key/value
     * */

  }, {
    key: '_storageFallback',
    value: function _storageFallback() {
      window.localStorage = new StorageFallback('localStorage');
      window.sessionStorage = new StorageFallback('sessionStorage');
    }
  }]);

  return Storage;
}();

/**
 * @class StorageFallback
 * @description
 * fallback to use local memory to catch key/value
 * */


var StorageFallback = function () {
  function StorageFallback(storageType) {
    _classCallCheck(this, StorageFallback);

    this._storageType = storageType;
    this._storage = {};
    this.length = 0;
  }

  _createClass(StorageFallback, [{
    key: 'getItem',
    value: function getItem(key) {
      if (!key || !value) {
        return;
      }
      key = key.toString();
      return this._storage[key];
    }
  }, {
    key: 'setItem',
    value: function setItem(key, value) {
      if (!key || !value) {
        return;
      }
      key = key.toString();
      value = value.toString();
      this._storage[key] = value;
      this.length++;
    }
  }, {
    key: 'clear',
    value: function clear() {
      this._storage = {};
      this.length = 0;
    }
  }, {
    key: 'removeItem',
    value: function removeItem(key) {
      if (!key) {
        return;
      }
      key = key.toString();
      delete this._storage[key];
      this.length--;
    }
  }, {
    key: 'key',
    value: function key(num) {
      var keys = Object.keys(this._storage);
      return keys[parseInt(num)];
    }
  }]);

  return StorageFallback;
}();

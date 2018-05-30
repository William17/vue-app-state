'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var Storage =
/*#__PURE__*/
function () {
  function Storage(name, localStorage) {
    _classCallCheck(this, Storage);

    this.prefix = name + '/';
    this.storage = localStorage;
    this._cache = {};
  }

  _createClass(Storage, [{
    key: "_parseKey",
    value: function _parseKey(name) {
      return this.prefix + name;
    }
  }, {
    key: "$set",
    value: function $set(key, value) {
      key = this._parseKey(key);
      value = JSON.stringify(value);
      this._cache[key] = JSON.parse(value);
      this.storage.setItem(key, value);
    }
  }, {
    key: "$get",
    value: function $get(key) {
      key = this._parseKey(key);

      if (!this._cache.hasOwnProperty(key)) {
        this._cache[key] = JSON.parse(this.storage.getItem(key));
      }

      return this._cache[key];
    }
  }, {
    key: "$remove",
    value: function $remove(key) {
      key = this._parseKey(key);
      delete this._cache[key];
      return this.storage.removeItem(key);
    }
  }, {
    key: "$keys",
    value: function $keys() {
      var _this = this;

      return Object.keys(this.storage).filter(function (item) {
        return item.indexOf(_this.prefix) > -1;
      }).map(function (item) {
        return item.replace(_this.prefix, '');
      });
    }
  }]);

  return Storage;
}();

var proto = {
  $storage: function $storage(name) {
    var __internal__ = this.__internal__;
    var storage = __internal__.storages[name];

    if (!storage) {
      var localStorage = __internal__.localStorage;
      var realName = __internal__.prefix + name;
      storage = new Storage(realName, localStorage);
      __internal__.storages[name] = storage;
    }

    return storage;
  },
  $get: function $get(key) {
    return this.__internal__.rootStorage.$get(key);
  },
  $set: function $set(key, value) {
    return this.__internal__.rootStorage.$set(key, value);
  },
  $remove: function $remove(key) {
    return this.__internal__.rootStorage.$remove(key);
  },
  $keys: function $keys() {
    return this.__internal__.rootStorage.$keys();
  }
};

var State = function State() {
  var _this = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, State);

  var prefix = options.prefix || 'APP_STATE/';
  var localStorage = options.localStorage || (typeof localStorage !== 'undefined' ? localStorage : window.localStorage);
  var rootStorage = new Storage(prefix, localStorage);
  var __internal__ = {
    prefix: prefix,
    storages: {},
    localStorage: localStorage,
    rootStorage: rootStorage
  };
  Object.defineProperty(this, '__internal__', {
    value: __internal__,
    writeable: false,
    configurable: false,
    enumerable: false
  });
  Object.keys(proto).forEach(function (item) {
    Object.defineProperty(_this, item, {
      value: proto[item],
      writeable: false,
      configurable: false,
      enumerable: false
    });
  });
};

function install(Vue) {
  Vue.mixin({
    beforeCreate: function beforeCreate() {
      var options = this.$options.appState;

      if (options !== undefined) {
        this.$appState = new State(options);
      } else if (this.$parent) {
        this.$appState = this.$parent.$appState;
      } else {
        this.$appState = new State(options);
      }
    }
  });
}

var AppState = {
  install: install
};

module.exports = AppState;

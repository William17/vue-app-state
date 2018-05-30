class Storage {
  constructor(name, localStorage) {
    this.prefix = name + '/';
    this.storage = localStorage;
    this._cache = {};
  }

  _parseKey(name) {
    return this.prefix + name
  }

  $set(key, value) {
    key = this._parseKey(key);
    value = JSON.stringify(value);
    this._cache[key] = JSON.parse(value);
    this.storage.setItem(key, value);
  }

  $get(key) {
    key = this._parseKey(key);
    if (!this._cache.hasOwnProperty(key)) {
      this._cache[key] = JSON.parse(this.storage.getItem(key));
    }
    return this._cache[key]
  }

  $remove(key) {
    key = this._parseKey(key);
    delete this._cache[key];
    return this.storage.removeItem(key)
  }

  $keys() {
    return Object.keys(this.storage)
    .filter((item) => {
      return item.indexOf(this.prefix) > -1
    })
    .map((item) => {
      return item.replace(this.prefix, '')
    })
  }
}

const proto = {
  $storage(name) {
    const __internal__ = this.__internal__;
    let storage = __internal__.storages[name];
    if (!storage) {
      const localStorage = __internal__.localStorage;
      const realName = __internal__.prefix + name;
      storage =  new Storage(realName, localStorage);
      __internal__.storages[name] = storage;
    }
    return storage
  },
  $get(key) {
    return this.__internal__.rootStorage.$get(key)
  },
  $set(key, value) {
    return this.__internal__.rootStorage.$set(key, value)
  },
  $remove(key) {
    return this.__internal__.rootStorage.$remove(key)
  },
  $keys() {
    return this.__internal__.rootStorage.$keys()
  }
};

class State {
  constructor(options = {}) {
    const prefix = options.prefix || 'APP_STATE/';
    const localStorage = options.localStorage || (typeof localStorage !== 'undefined'
                                                  ? localStorage
                                                  : window.localStorage);
    const rootStorage = new Storage(prefix, localStorage);
    const __internal__ = {
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
    Object.keys(proto).forEach((item) => {
      Object.defineProperty(this, item, {
        value: proto[item],
        writeable: false,
        configurable: false,
        enumerable: false
      });
    });
  }
}

function install(Vue) {
  Vue.mixin({
    beforeCreate() {
      const options = this.$options.appState;
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
const AppState = { install };

export default AppState;

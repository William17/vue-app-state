import Storage from './storage'

const proto = {
  $storage(name) {
    const __internal__ = this.__internal__
    let storage = __internal__.storages[name]
    if (!storage) {
      const localStorage = __internal__.localStorage
      const realName = __internal__.prefix + name
      storage =  new Storage(realName, localStorage)
      __internal__.storages[name] = storage
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
}

class State {
  constructor(options = {}) {
    const prefix = options.prefix || 'APP_STATE/'
    const localStorage = options.localStorage || (typeof localStorage !== 'undefined'
                                                  ? localStorage
                                                  : window.localStorage)
    const rootStorage = new Storage(prefix, localStorage)
    const __internal__ = {
      prefix: prefix,
      storages: {},
      localStorage: localStorage,
      rootStorage: rootStorage
    }
    Object.defineProperty(this, '__internal__', {
      value: __internal__,
      writeable: false,
      configurable: false,
      enumerable: false
    })
    Object.keys(proto).forEach((item) => {
      Object.defineProperty(this, item, {
        value: proto[item],
        writeable: false,
        configurable: false,
        enumerable: false
      })
    })
  }
}

export { State as default }

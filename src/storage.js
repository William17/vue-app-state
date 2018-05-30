class Storage {
  constructor(name, localStorage) {
    this.prefix = name + '/'
    this.storage = localStorage
    this._cache = {}
  }

  _parseKey(name) {
    return this.prefix + name
  }

  $set(key, value) {
    key = this._parseKey(key)
    value = JSON.stringify(value)
    this._cache[key] = JSON.parse(value)
    this.storage.setItem(key, value)
  }

  $get(key) {
    key = this._parseKey(key)
    if (!this._cache.hasOwnProperty(key)) {
      this._cache[key] = JSON.parse(this.storage.getItem(key))
    }
    return this._cache[key]
  }

  $remove(key) {
    key = this._parseKey(key)
    delete this._cache[key]
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

export { Storage as default }

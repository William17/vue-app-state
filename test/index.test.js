import Vue from 'vue'
import AppState from '../src/index'
import { genString } from './util'

Vue.use(AppState)

const Component = Vue.extend({
  data: () => {
    return {}
  },
  render(createElement) {
    return createElement('div')
  },
  methods: {
    setState(key, value) {
      return this.$appState[key] = value
    },
    getState(key) {
      return this.$appState[key]
    },
    setRootStorageItem(key, value) {
      return this.$appState.$set(key, value)
    },
    getRootStorageItem(key) {
      return this.$appState.$get(key)
    },
    removeRootStorageItem(key) {
      return this.$appState.$remove(key)
    },
    getRootStorageKeys() {
      return this.$appState.$keys()
    },
    setCustomStorageItem(storageName, key, value) {
      return this.$appState.$storage(storageName).$set(key, value)
    },
    getCustomStorageItem(storageName, key) {
      return this.$appState.$storage(storageName).$get(key)
    },
    removeCustomStorageItem(storageName, key) {
      return this.$appState.$storage(storageName).$remove(key)
    },
    getCustomStorageKeys(storageName) {
      return this.$appState.$storage(storageName).$keys()
    }
  }
})

const App = Vue.extend({
  components: {
    ComponentA: Component,
    ComponentB: Component
  },
  render(createElement) {
    return createElement('div',
        [
          createElement('ComponentA', {ref: 'a'}),
          createElement('ComponentB', {ref: 'b'})
        ])
  }
})

describe('$appState attribute mutation', () => {

  it('set and get', () => {
    const key = genString()
    const value = genString()
    const component = new Component()
    const vm = component.$mount()
    component.setState(key, value)
    expect(component.getState(key)).toBe(value)
  })

  it('share state among components', () => {
    const keyA = genString()
    const valueA = genString()
    const keyB = genString()
    const valueB = genString()

    const app = new App()
    const vm = app.$mount()
    app.$refs.a.setState(keyA, valueA)
    expect(app.$refs.b.getState(keyA)).toBe(valueA)

    app.$refs.b.setState(keyB, valueB)
    expect(app.$refs.a.getState(keyB)).toBe(valueB)

  })
})

describe('root storage', () => {

  const component = new Component()
  const vm = component.$mount()

  beforeEach(() => {
    localStorage.clear()
  })

  it('$set, $get, $remove string value', () => {
    const key = genString()
    const value = genString()

    expect(component.getRootStorageItem(key)).toBe(null)
    component.setRootStorageItem(key, value)
    expect(component.getRootStorageItem(key)).toEqual(value)

    component.removeRootStorageItem(key)
    expect(component.getRootStorageItem(key)).toBe(null)

  })

  it('$set, $get, $remove object value', () => {
    const key = genString()
    const value = {[key]: genString()}

    expect(component.getRootStorageItem(key)).toBe(null)
    component.setRootStorageItem(key, value)
    expect(component.getRootStorageItem(key)).toEqual(value)

    component.removeRootStorageItem(key)
    expect(component.getRootStorageItem(key)).toBe(null)
  })

  it('$keys', () => {
    const keys = []
    const length = 10
    for(let i = 0; i < length; i++) {
      const key = genString()
      keys.push(key)
      component.setRootStorageItem(key, genString())
    }
    const testKeys = component.getRootStorageKeys()

    expect(keys).toEqual(expect.arrayContaining(testKeys))
    expect(testKeys).toEqual(expect.arrayContaining(keys))
  })

})

describe('custom storage', () => {
  const component = new Component()
  const vm = component.$mount()

  beforeEach(() => {
    localStorage.clear()
  })

  it('$set, $get, $remove string value', () => {
    const storageName = genString()
    const key = genString()
    const value = genString()

    expect(component.getCustomStorageItem(storageName, key)).toBe(null)
    component.setCustomStorageItem(storageName, key, value)
    expect(component.getCustomStorageItem(storageName, key)).toEqual(value)

    component.removeCustomStorageItem(storageName, key)
    expect(component.getCustomStorageItem(storageName, key)).toBe(null)

  })

  it('$set, $get, $remove object value', () => {
    const storageName = genString()
    const key = genString()
    const value = {[key]: genString()}

    expect(component.getCustomStorageItem(storageName, key)).toBe(null)
    component.setCustomStorageItem(storageName, key, value)
    expect(component.getCustomStorageItem(storageName, key)).toEqual(value)

    component.removeCustomStorageItem(storageName, key)
    expect(component.getCustomStorageItem(storageName, key)).toBe(null)
  })

  it('$keys', () => {
    const storageName = genString()
    const keys = []
    const length = 10
    for(let i = 0; i < length; i++) {
      const key = genString()
      keys.push(key)
      component.setCustomStorageItem(storageName, key, genString())
    }
    const testKeys = component.getCustomStorageKeys(storageName)

    expect(keys).toEqual(expect.arrayContaining(testKeys))
    expect(testKeys).toEqual(expect.arrayContaining(keys))
  })

})

describe('pass options', () => {
  it('localStorage', () => {
    const localStorage = {}
    const component = new Component({
      appState: { localStorage }
    })
    expect(component.$appState.__internal__.localStorage).toBe(localStorage)
  })

  it('prefix', () => {
    const prefix = genString()
    const component = new Component({
      appState: { prefix }
    })
    expect(component.$appState.__internal__.prefix).toEqual(prefix)
  })
})


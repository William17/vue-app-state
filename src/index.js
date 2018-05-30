import State from './state'

function install(Vue) {
  Vue.mixin({
    beforeCreate() {
      const options = this.$options.appState
      if (options !== undefined) {
        this.$appState = new State(options)
      } else if (this.$parent) {
        this.$appState = this.$parent.$appState
      } else {
        this.$appState = new State(options)
      }
    }
  })
}
const AppState = { install }

export { AppState as default }

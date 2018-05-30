# vue-app-state  [![Build Status](https://travis-ci.org/William17/vue-app-state.png?branch=master)](http://travis-ci.org/William17/vue-app-state)  [![Coverage Status](https://coveralls.io/repos/William17/vue-app-state/badge.svg?branch=master&service=github)](https://coveralls.io/github/William17/vue-app-state?branch=master)  
A Vue plugin for sharing and storing app-level data and state with memory or localStorage.  

## Install  
`npm install @william17/vue-app-state --save`  

## Quick Start  

appState.js
```js
import Vue from 'vue'
import AppState from '@william17/vue-app-state'  

Vue.use(AppState)
```  

main.js
```js
import Vue from 'vue'
import App from './App'
import './appState.js'

new Vue({
  el: '#app',
  render: h => h(App)
})
```

In one component method:  
```js
// setting some state 
this.$appState.foo = "bar"  

// storing persistent data, it will be stored in localStorage
this.$appState.$set('user', {name: 'Tom'}}

// storing with namespace  
this.$appState.$storage('user').$set('friends', ['Lucy'])
```
In another component method:  
```js  
// geting some state
console.log(this.$appState.foo) // "bar"

// geting persistent data
console.log(this.$appState.$get('user')// {name: 'Tom'}

console.log(this.$appState.$storage('user').$get('friends') // ['Lucy']
```

## API  
### $appState
  - .$set(key, value)  
  - .$get(key)  
  - .$keys()  
  - .$storage(name)  
    - .$set(key, value)
    - .$get(key)
    - .$keys()

### options  
  - .prefix
    prefix of the keys using in localStroage  
  - .localStorage  
    custom localStorage-like object  

Example:  

appState.js
```js  
import Vue from 'vue'  
import AppState from '@william17/vue-app-state'  
Vue.use(AppState)

export default {
  prefix: 'OneApp/',
  localStorage: window.localStorage
}
```

main.js
```js
// ...
import appState from './appState'

new App({
  el: '#app',
  render: (h) => h(App),
  appState
})
```

## Test  
`npm run test`  

## License  
MIT


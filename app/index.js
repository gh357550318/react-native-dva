import React from 'react'
import { AppRegistry } from 'react-native'

import dva from './utils/dva'
import Router, { routerMiddleware, routerReducer } from './router'
import appModel from './models/app'

const app = dva({
  initialState: {},
  models: [appModel],
  extraReducers: { router: routerReducer },
  onAction: [routerMiddleware],
  onError(e) {
    console.log('onError', e)
  },
})

const App = app.start(<Router />)

AppRegistry.registerComponent('DvaStarter', () => App)

if (__DEV__) {
  // 用于在开发者工具中显示网络请求
  global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest
}

export default app._store // eslint-disable-line
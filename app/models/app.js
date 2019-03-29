import { createAction, NavigationActions, Storage } from '../utils'
import * as authService from '../services/auth'
import { queryMenu } from '../services/api'
// import console = require('console');

export default {
  namespace: 'app',
  state: {
    login: false,
    loading: false,
    fetching: false,
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
    *loadStorage(action, { call, put }) {
      const login = yield call(Storage.get, 'login', false)
      yield put({type: 'updateState',payload:{login:true,fetching:false}})
    },
    *login({ payload }, { call, put }) {
      yield put({type: 'updateState',payload:{login:true,fetching:true}})
      yield put(NavigationActions.navigate({ routeName: 'Home' }))
      yield put({type: 'updateState',payload:{login:true,fetching:false}})
      Storage.set('login', login)
    },
    *logout(action, { call, put }) {
      yield call(Storage.set, 'login', false)
      yield put({type: 'updateState',payload:{login:true,fetching:false}})
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'loadStorage' })
    },
  },
}

import { Toast } from '@ant-design/react-native'
import store from '../index'
import { NavigationActions } from './index'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const errortext = codeMessage[response.status] || response.statusText
  Toast.fail(`请求错误 ${response.status}: ${response.url}`)

  const error = new Error(errortext)
  error.name = response.status
  error.response = response
  throw error
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option]  The options we want to pass to "fetch"
 * @param  {timeout}          默认超时时间 10s
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option, timeout = 10000) {
  const defaultOptions = {
    Authorization: `Token 7692403bf36aa79731b97e5307392ac7bff50409`, // 用户登录后的 token
  }
  const newOptions = { ...defaultOptions, ...option }
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      }
      newOptions.body = JSON.stringify(newOptions.body)
    } else {
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      }
    }
  }

  /**
   * fetch 网络请求超时处理
   * @param original_promise 原始的 fetch
   * @returns {Promise.<*>}
   */
  const timeoutFetch = originalFetch => {
    let timeoutBlock = () => {}
    const timeoutPromise = new Promise((resolve, reject) => {
      timeoutBlock = () => {
        // 请求超时处理
        reject(new Error('timeout promise'))
      }
    })
    // Promise.race(iterable) 方法返回一个 promise
    // 这个 promise 在 iterable 中的任意一个 promise 被解决或拒绝后，立刻以相同的解决值被解决或以相同的拒绝原因被拒绝。
    const abortablePromise = Promise.race([originalFetch, timeoutPromise])
    setTimeout(() => {
      timeoutBlock()
    }, timeout)
    return abortablePromise
  }

  return (
    timeoutFetch(fetch(url, newOptions))
      .then(checkStatus)
      // .then(response => cachedSave(response, hashcode))
      .then(response => {
        // DELETE and 204 do not return data by default
        // using .json will report an error.
        if (newOptions.method === 'DELETE' || response.status === 204) {
          return response.text()
        }
        return response.json()
      })
      .catch(e => {
        const status = e.name
        if (status === 401) {
          const { dispatch } = store
          dispatch({
            type: 'app/logout',
          })
          dispatch(NavigationActions.navigate({ routeName: 'Login' }))
          // return
        }
        // environment should not be used
        if (status === 403) {
          Toast.fail(`权限错误 ${status}`)
          // return
        }
        if (status <= 504 && status >= 500) {
          Toast.fail(`请求错误 ${status}`)
          // return
        }
        if (status >= 404 && status < 422) {
          Toast.fail(`请求错误 ${status}`)
        }
      })
  )
}

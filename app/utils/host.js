let host
if (__DEV__) {
  host = 'http://192.168.0.172:8888'
} else {
  host = 'http://www.xxx.com'
}

export default {
  host,
}
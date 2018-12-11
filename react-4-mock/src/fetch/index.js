import 'whatwg-fetch'
import 'es6-promise'
import { obj2params } from '../utils'
const post = (url, paramsObj) => {
  var result = fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: obj2params(paramsObj)
  })
  return result;
}

const get = (url) => {
  var result = fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json, text/plain, */*'
    }
  })
  return result;
}

export {
  post,
  get
}
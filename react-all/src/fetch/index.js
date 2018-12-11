import 'whatwg-fetch'
import 'es6-promise'
import { obj2params } from '../utils'
const Ajax = (url, options) => {
  return new Promise((resolve, reject) => {
    fetch(url, options).then(function (response) {
      return response.json()
    }).then((res) => {
      resolve(res)
    }).catch(function (err) {
      reject(err)
    })
  })
};
const post = (url, paramsObj) => {
  return Ajax(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: obj2params(paramsObj)
  })
}

const get = (url) => {
  return Ajax(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json, text/plain, */*'
    }
  })
}

export {
  post,
  get
}
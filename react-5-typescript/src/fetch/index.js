import 'whatwg-fetch'
import 'es6-promise'
import { obj2params } from '../utils'
const Ajax = (url, options) => {
  return fetch(url, options).then(function (response) {
    return response;
  }).catch(function (err) {
    return err;
  })
};
const post = (url, paramsObj) => {
  var result = Ajax(url, {
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
  var result = Ajax(url, {
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
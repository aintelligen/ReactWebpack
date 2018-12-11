import environment from '../environment';
import utils from './utils';
require('es6-promise').polyfill();
require('isomorphic-fetch');

let Fetch = async (url, option = {}, newApiVer) => {
  let timeOut = null;
  let api = environment.api;
  option.headers = {};
  //pl=h5表示h5端，每个接口请求都需要传此参数，用于校验账号是否在其他地方登录
  //pl--平台，mm--手机型号，av--app版本,sv--系统版本,uuid--唯一标识
  //针对充值提现和活动详情页面，app调用时
  let platfrom = utils.local.get('app') ? utils.local.get('app') : 'h5';
  option.headers['pl'] = platfrom;
  option.headers['mm'] = '';
  option.headers['av'] = '';
  option.headers['sv'] = '';
  option.headers['uuid'] = '';
  // Authorization
  if (utils.local.get('token')) {
    option.headers['Authorization'] = utils.local.get('token');
  }
  // post put data format
  const m = (option.method || '').toLocaleLowerCase();
  if (m === 'post' || m === 'put' || m === 'patch') {
    if (url != '/upload') {
      option.headers['Content-Type'] = 'application/json';
      option.headers['Accept-Language'] = 'zh-CN';
      option.body = JSON.stringify(option.body);
    }
  }

  return new Promise((resolve, reject) => {
    timeOut = setTimeout(() => {
      let result = {
        isTimeOut: true,
        message: '网络连接超时'
      };
      resolve(result);
    }, 15000);
    let status = '';
    url = '/v2' + url;
    fetch(api + url, option)
      .then(response => {
        clearTimeout(timeOut);
        status = response.status;
        return response.json();
      })
      .then(res => {
        res.isOk = status == 200 ? true : false;
        // 后端token失效
        if (status == 401) {
          //stte==99提示token需要续期
          if (res.state == 99) {
            utils.local.set('token', res.token);
            Fetch.tokenRefresh && Fetch.tokenRefresh(res.message);
            reject(res.message);
          } else if (res.state == 162) {
            //state ==162 账号在别处登录
            Fetch.loginOther && Fetch.loginOther(res.message);
            reject(res.message);
          } else {
            Fetch.tokenLose && Fetch.tokenLose(res.message);
            reject(res.message);
          }
        }
        // console.log('[✅ ]' + api + url, res);
        resolve(res);
      })
      .catch(er => {
        if (!status) {
          console.log('断网了！！！');
          Fetch.responseNone && Fetch.responseNone('网络异常');
          reject('网络异常');
        } else {
          er.isOk = status == 200 ? true : false;
          Fetch.systemError && Fetch.systemError(er.message);
          reject(er.message);
        }
        console.error('[❎ ]' + api + url, er);
      });
  });
};
export default Fetch;

const obj2params = (obj) => {
  var result = '';
  var item;
  if (!obj) return '';
  for (item in obj) {
    result += '&' + item + '=' + encodeURIComponent(obj[item]);
  }

  if (result) {
    result = result.slice(1);
  }
  return result;
}

export {
  obj2params
}
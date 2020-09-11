// 获取url中的参数
export function getRequest(text) {
  var url = text;
  var theRequest = {};
  if (url.indexOf('?') !== -1) {
    var str = url.split('?')[1];
    var strs = str.split('&');
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = decodeURIComponent(strs[i].split('=')[1]);
    }
  }
  return theRequest;
}

export function telStart(phone) {
  phone = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  return phone;
}

//加密
export function encryption(code) {
  var c = String.fromCharCode(code.charCodeAt(0) + code.length);
  for (var i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
  }
  return (escape(c).replace(/%/g, '%25'));
}

//解密
export function decryption(code) {
  code = unescape(code);
  var c = String.fromCharCode(code.charCodeAt(0) - code.length);
  for (var i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
  }
  return c;
}

//获取appid
export function getAppid(url) {
  let appid = url.split('/');
  return appid[appid.length - 2];
}
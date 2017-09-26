'use strict';

/**
* Basical xhr obj
* foundable everywhere on the web.
* taken for project base
**/

let sxhr = {},
    v = [
      "MSXML2.XmlHttp.6.0",
      "MSXML2.XmlHttp.5.0",
      "MSXML2.XmlHttp.4.0",
      "MSXML2.XmlHttp.3.0",
      "MSXML2.XmlHttp.2.0",
      "Microsoft.XmlHttp"
    ];

sxhr.getVersion = function() {
  for(let i=0; i<v.length;i++) {
    try{
      return new ActiveXObject(v[i]);
    } catch(e) {
      console.log(e.message);
    }
  }
}

sxhr.req = function() {
  return typeof XMLHttpRequest !== 'undefined'
  ? new XMLHttpRequest()
  : sxhr.getVersion();
}

sxhr.make = function(url, options, query, async) {
  async = async === undefined ? true : async;
  let xhr = sxhr.req();
  xhr.open(options.method, url, async);
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4) options.callback();
  };
  if(options.method == 'POST') xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.send(query);
}

sxhr.query = function(url, options, async) {
  let query = [];
  if(options.hasOwnProperty("datas")) {
    for(let k in options.datas) {
      query.push(encodeURIComponent(k) + "=" + encodeURIComponent(options.datas[k]));
    }
    let q = options.method == 'post'
          ? query.length
            ? query.join("&")
            : ""
          : query.length
            ? "?" + query.join("&")
            : "";
    sxhr.make(url, options, q, async);
  }
}

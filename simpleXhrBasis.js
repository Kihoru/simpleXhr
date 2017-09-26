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

sxhr.make = function(options, query, async) {

}

sxhr.query = function(options, async) {
  let query = [];
  if(options.hasOwnProperty("datas")) {
    for(let k in options.datas) {
      query.push(encodeURIComponent(k) + "=" + encodeURIComponent(options.datas[k]));
    }
    sxhr.make(options, query.join("&"), async)
  }else{
    sxhr.make(options, (query.length ? "?" + query.join("&") : ""), async);
  }
}

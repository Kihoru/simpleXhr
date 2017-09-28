'use strict';

/**
* Basical xhr obj
* foundable everywhere on the web.
* taken for project base
**/

let sxhr = {
  v: [
    "MSXML2.XmlHttp.6.0",
    "MSXML2.XmlHttp.5.0",
    "MSXML2.XmlHttp.4.0",
    "MSXML2.XmlHttp.3.0",
    "MSXML2.XmlHttp.2.0",
    "Microsoft.XmlHttp"
  ]
};

sxhr.getVersion = () => {
  for(let i=0; i<sxhr.v.length;i++) {
    try{
      return new ActiveXObject(sxhr.v[i]);
    } catch(e) {
      console.log(e.message);
    }
  }
}

sxhr.req = () => {
  return typeof XMLHttpRequest !== 'undefined'
  ? new XMLHttpRequest()
  : sxhr.getVersion();
}

sxhr.statusOk = (status) => {
  let validStatus = [200, 201];
  return validStatus.indexOf(status) !== -1 ? true : false;
}

sxhr.resultHandler = (xhr, options) => {
  let onErrorCallback = null, onSuccessCallback = null;

  if ( xhr.readyState == 4 ) {

    if( options.hasOwnProperty("error") ) onErrorCallback = options.error;

    if(options.hasOwnProperty("success")) {
      onSuccessCallback = options.success;
      if( !onErrorCallback ) onErrorCallback = options.success;
    }

    if(onSuccessCallback && onErrorCallback) {
      if(sxhr.statusOk(xhr.status)) {
        onSuccessCallback(JSON.parse(xhr.response));
      }else{
        onErrorCallback(JSON.parse(xhr.response));
      }
    }
  }
}

sxhr.make = (url, options, query, async) => {

  async = async === undefined ? true : async;

  let xhr = sxhr.req(), m = options.method.toUpperCase();

  xhr.open(m, m == "GET" ? url+query : url, async);

  xhr.onreadystatechange = function() {
    sxhr.resultHandler(xhr, options);
  };

  if(options.method == 'POST') xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  xhr.send(query);
}

sxhr.query = (url, options, async) => {
  let query = [];
  if(options.hasOwnProperty("datas")) {
    for(let k in options.datas) {
      query.push(encodeURIComponent(k) + "=" + encodeURIComponent(options.datas[k]));
    }
    let q = query.length
            ? options.method.toUpperCase() == 'POST'
              ? query.join("&")
              : "?" + query.join("&")
            : "";
    sxhr.make(url, options, q, async);
  }
}

// TEST CASE :
  let url = 'https://jsonplaceholder.typicode.com/';

  sxhr.query(url + "posts", {
    method: "GET",
    datas: { userId: 1 },
    success: function(res) {
      console.log(res);
    }
  }, true);

  sxhr.query(url + "posts", {
    method: "POST",
    datas: {
      title: 'foo',
      body: 'bar',
      userId: 1
    },
    success: function(res) {
      console.log(res);
    },
    error: function(error) {
      console.log(error);
    }
  }, true);
///////////////

'use strict';

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
  }else{
    sxhr.make(url, options, "", async);
  }
}

sxhr.get = (url, callback) => {
  let opts = {
    method: "GET",
    success: callback,
  };
  sxhr.query(url, opts, true);
}

sxhr.post = (url, datas, callback) => {
  sxhr.query(url, {
    method: "POST",
    datas: datas,
    success: callback
  }, true);
}

// TEST CASE :
  let url = 'https://jsonplaceholder.typicode.com/';

  sxhr.get(url + "posts", (res) => {
    console.log(res);
  });

  sxhr.get(url + "posts", (res) => {
    console.log(res);
  });

  sxhr.query(url + "posts", {
    method: "GET",
    datas: { userId: 1 },
    success: (res) => {
      console.log(res);
    }
  }, true);

  sxhr.post(url + "posts", {
    title: 'foo',
    body: 'bar',
    userId: 1
  }, (res) => {
    console.log(res);
  });

  sxhr.query(url + "posts", {
    method: "POST",
    datas: {
      title: 'foo',
      body: 'bar',
      userId: 1
    },
    success: (res) => {
      console.log(res);
    },
    error: (error) => {
      console.log(error);
    }
  }, true);

  sxhr.query(url + "posts/1", {
    method: "PUT",
    datas: {
      id: 1,
      title: 'foo',
      body: 'pppbar',
      userId: 1
    },
    success: (res) => {
      console.log(res);
    },
    error: (error) => {
      console.log(error);
    }
  }, true);
///////////////

(function() {

  /*
  Convert
   */
  var convert, getUrlVars, post2CorsServer, qs, saveBlobImage;
  convert = {
    base64toBlob: function(_base64) {
      var arr, blob, data, i, mime, tmp;
      i = void 0;
      tmp = _base64.split(',');
      data = atob(tmp[1]);
      mime = tmp[0].split(':')[1].split(';')[0];
      arr = new Uint8Array(data.length);
      i = 0;
      while (i < data.length) {
        arr[i] = data.charCodeAt(i);
        i++;
      }
      blob = new Blob([arr], {
        type: mime
      });
      return Blob;
    },
    toArrayBuffer: function(buffer) {
      var ab, i, view;
      ab = new ArrayBuffer(buffer.length);
      view = new Uint8Array(ab);
      i = 0;
      while (i < buffer.length) {
        view[i] = buffer[i];
        ++i;
      }
      return ab;
    }
  };

  /*
  Download
   */
  saveBlobImage = function(data) {
    var arrayBuffer, blob, filename;
    arrayBuffer = convert.toArrayBuffer(data.body.data);
    blob = new Blob([arrayBuffer], {
      type: data.type
    });
    filename = (Date.now()) + ".png";
    return saveAs(blob, filename);
  };

  /*
  Request
   */
  post2CorsServer = function(params) {
    console.log(params);
    return $.ajax({
      type: "POST",
      url: "https://aw2x.eiurur.xyz/api/downloadFromURL",
      data: params,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    }).done(function(data) {
      if (data.error) {
        chrome.runtime.sendMessage({
          data: data,
          uid: qs.uid,
          status: 'failure'
        }, function(response) {
          return console.log('fail');
        });
        return;
      }
      console.log(data);
      saveBlobImage({
        body: data.body,
        type: data.type
      });
      chrome.runtime.sendMessage({
        data: data,
        uid: qs.uid,
        status: 'success'
      }, function(response) {
        return console.log('fail');
      });
      return console.log('done');
    }).fail(function(jqXHR, textStatus) {
      console.log('jqXHR = ', jqXHR);
      console.log(textStatus);
      chrome.runtime.sendMessage({
        uid: qs.uid,
        status: 'failure'
      }, function(response) {
        return console.log('fail');
      });
      return console.log('fail');
    });
  };
  getUrlVars = function() {
    var i, key, keySearch, param, val, vars;
    vars = {};
    param = location.search.substring(1).split('&');
    i = 0;
    while (i < param.length) {
      keySearch = param[i].search(RegExp('='));
      key = '';
      if (keySearch !== -1) {
        key = param[i].slice(0, keySearch);
      }
      val = param[i].slice(param[i].indexOf('=', 0) + 1);
      if (key !== '') {
        vars[key] = decodeURI(val);
      }
      i++;
    }
    return vars;
  };
  qs = getUrlVars();
  console.log(qs);
  return post2CorsServer({
    'url': qs.srcUrl,
    'noise': qs.noise - 0,
    'scale': qs.scale - 0
  });
})();

(function() {

  /*
  Convert
   */
  var convert, post2CorsServer, saveBlobImage, url;
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
      url: "https://localhost:3000/api/downloadFromURL",
      data: params,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    }).done(function(data) {
      if (data.error) {
        return;
      }
      console.log(data);
      saveBlobImage({
        body: data.body,
        type: data.type
      });
      chrome.runtime.sendMessage({
        status: 'success'
      }, function(response) {
        return console.log('fail');
      });
      return console.log('done');
    }).fail(function(jqXHR, textStatus) {
      console.log('jqXHR = ', jqXHR);
      console.log(textStatus);
      chrome.runtime.sendMessage({
        status: 'fail'
      }, function(response) {
        return console.log('fail');
      });
      return console.log('fail');
    });
  };
  url = location.search.substr(1).split('=');
  console.log(url);
  return post2CorsServer({
    'url': url[1],
    'noise': 2,
    'scale': 2
  });
})();

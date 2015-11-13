(function() {

  /*
  Request
   */
  var downloadOriginImage, post2CorsServer, qs;
  downloadOriginImage = function(params) {
    var filename;
    filename = params.url.match(".+/(.+?)([\?#;].*)?$")[1];
    return chrome.downloads.download({
      url: params.url,
      filename: filename
    }, function(downloadId) {
      return console.log(downloadId);
    });
  };
  post2CorsServer = function(params) {
    return $.ajax({
      type: "POST",
      url: "https://aw2x.eiurur.xyz/api/download/waifu2x",
      data: params,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    }).done(function(data) {
      console.log('/post2CorsServer data =', data);
      if (data.error) {
        if (qs.isAllowedDownloadOriginalSize) {
          downloadOriginImage({
            data: data,
            url: params.url
          });
        }
        chrome.runtime.sendMessage({
          data: data,
          uid: qs.uid,
          status: 'failure'
        }, function(response) {
          return console.log('fail');
        });
        return;
      }
      eiurur.utils.saveBlobImage({
        data: data.body.data,
        type: data.type
      });
      return chrome.runtime.sendMessage({
        data: data,
        uid: qs.uid,
        status: 'success'
      }, function(response) {
        return console.log('success');
      });
    }).fail(function(jqXHR, textStatus) {
      console.log('jqXHR = ', jqXHR);
      console.log('textSTatus = ', textStatus);
      return chrome.runtime.sendMessage({
        uid: qs.uid,
        status: 'failure'
      }, function(response) {
        return console.log('fail');
      });
    });
  };

  /*
  Start!!
   */
  qs = eiurur.utils.getUrlVars();
  if (qs.noise === 'undefined') {
    qs.noise = 2;
  }
  if (qs.scale === 'undefined') {
    qs.scale = 2;
  }
  if (qs.isAllowedDownloadOriginalSize === 'undefined' || qs.isAllowedDownloadOriginalSize === 'false') {
    qs.isAllowedDownloadOriginalSize = false;
  }
  console.log(qs);
  return post2CorsServer({
    'url': qs.srcUrl,
    'noise': qs.noise - 0,
    'scale': qs.scale - 0
  });
})();

(function() {

  /*
  Request
   */
  var post2CorsServer, qs;
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
      console.log('/post2CorsServer data =', data);
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
      eiurur.utils.saveBlobImage({
        body: data.body,
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
  return post2CorsServer({
    'url': qs.srcUrl,
    'noise': qs.noise - 0,
    'scale': qs.scale - 0
  });
})();

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
      eiurur.utils.saveBlobImage({
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
  qs = eiurur.utils.getUrlVars();
  console.log(qs);
  return post2CorsServer({
    'url': qs.srcUrl,
    'noise': qs.noise - 0,
    'scale': qs.scale - 0
  });
})();

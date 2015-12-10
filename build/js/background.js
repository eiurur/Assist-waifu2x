$(function() {
  var clickHandler, get, notify;
  get = function(key) {
    return new Promise(function(resolve, reject) {
      return chrome.storage.sync.get(key, function(item) {
        return resolve(item[key]);
      });
    });
  };
  clickHandler = function(info, tab) {
    return Promise.all([get("aw2x_style"), get("aw2x_noise"), get("aw2x_scale"), get("aw2x_is_allowed_download_original_size")]).then(function(itemList) {
      var url;
      console.log(itemList);
      info.style = itemList[0];
      info.noise = itemList[1];
      info.scale = itemList[2];
      info.isAllowedDownloadOriginalSize = itemList[3];
      info.uid = Date.now();
      url = "../build/views/views/asyncpost.html?uid=" + info.uid + "&srcUrl=" + info.srcUrl + "&style=" + info.style + "&noise=" + info.noise + "&scale=" + info.scale + "&isAllowedDownloadOriginalSize=" + info.isAllowedDownloadOriginalSize;
      return chrome.tabs.create({
        url: url,
        'active': false
      }, function(tab) {
        return console.log('Go Convert and Download');
      });
    });
  };
  chrome.contextMenus.create({
    'title': 'image to waifu2x',
    'contexts': ['image'],
    'id': 'image'
  });
  chrome.contextMenus.onClicked.addListener(clickHandler);

  /*
   */
  notify = function(params, callback) {
    var opts;
    opts = {
      title: params.title,
      message: params.message,
      type: 'basic',
      iconUrl: '../build/images/icon128.png'
    };
    return chrome.notifications.create(opts, function() {
      return console.log('notify');
    });
  };
  return chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    return chrome.tabs.getAllInWindow(null, function(tabs) {
      return tabs.forEach(function(tab) {
        if (tab.url.indexOf(request.uid) === -1) {
          return;
        }
        console.log(request);
        if (request.status === 'success') {
          setTimeout(function() {
            return chrome.tabs.remove(tab.id, function() {
              return console.log('tab remove');
            });
          }, 1000);
        }
        if (request.status === 'failure') {
          return setTimeout(function() {
            chrome.tabs.remove(tab.id, function() {
              return console.log('tab remove');
            });
            if (request.data != null) {
              console.log(request.data);
              return notify({
                title: 'Failure',
                message: request.data.error.text + "\n\n" + request.data.body.url
              });
            } else {
              return notify({
                title: 'Failure',
                message: request.uid + "\n\nServer Down"
              });
            }
          }, 1000);
        }
      });
    });
  });
});

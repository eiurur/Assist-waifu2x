$(function() {

  /*
  Context Menu
   */
  var clickHandler, notify;
  clickHandler = function(info, tab) {
    return chrome.storage.sync.get("aw2x_noise", function(item) {
      info.noise = item.aw2x_noise;
      return chrome.storage.sync.get("aw2x_scale", function(item) {
        var uid;
        info.scale = item.aw2x_scale;
        uid = Date.now();
        return chrome.tabs.create({
          url: "../build/views/views/asyncpost.html?uid=" + uid + "&srcUrl=" + info.srcUrl + "&noise=" + info.noise + "&scale=" + info.scale,
          'active': false
        }, function(tab) {
          return console.log('AAA');
        });
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
        console.log(request);
        if (tab.url.indexOf(request.uid) === -1) {
          return;
        }
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
            return notify({
              title: 'Failure',
              message: request.data.error.text + "\n\n" + request.data.body.url
            });
          }, 1000);
        }
      });
    });
  });
});

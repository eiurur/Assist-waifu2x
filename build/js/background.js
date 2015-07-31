$(function() {
  var clickHandler, syncGet;
  syncGet = function(key) {
    return new Promise(function(resolve, reject) {
      return chrome.storage.sync.get(key, function(item) {
        return resolve(item.key);
      });
    });
  };
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
  return chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    return chrome.tabs.getAllInWindow(null, function(tabs) {
      return tabs.forEach(function(tab) {
        if (request.status === 'success') {
          if (tab.url.indexOf(request.uid) !== -1) {
            setTimeout(function() {
              return chrome.tabs.remove(tab.id, function() {
                return console.log('tab remove');
              });
            }, 1000);
          }
        }
        if (request.status === 'failure') {
          console.log(request);
          if (tab.url.indexOf(request.uid) !== -1) {
            return setTimeout(function() {
              return chrome.tabs.remove(tab.id, function() {
                return console.log('tab remove');
              });
            }, 1000);
          }
        }
      });
    });
  });
});

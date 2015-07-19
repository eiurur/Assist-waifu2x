$(function() {
  var clickHandler;
  clickHandler = function(info, tab) {
    var uid;
    console.log('Context Menu =====> ');
    uid = Date.now();
    return chrome.tabs.create({
      url: "../build/views/views/asyncpost.html?uid=" + uid + "&srcUrl=" + info.srcUrl,
      'active': false
    }, function(tab) {
      return console.log('AAA');
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

$(function() {
  var clickHandler;
  clickHandler = function(info, tab) {
    console.log('Context Menu =====> ');
    return chrome.tabs.create({
      url: "../build/views/views/asyncpost.html?srcUrl=" + info.srcUrl,
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
          if (tab.url.indexOf('asyncpost.html') !== -1) {
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

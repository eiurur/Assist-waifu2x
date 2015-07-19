$ ->

  clickHandler = (info, tab) ->
    console.log 'Context Menu =====> '
    chrome.tabs.create url: "../build/views/views/asyncpost.html?srcUrl=#{info.srcUrl}", 'active': false, (tab) ->
      console.log 'AAA'

  chrome.contextMenus.create
    'title': 'image to waifu2x'
    'contexts': [ 'image' ]
    'id': 'image'

  chrome.contextMenus.onClicked.addListener(clickHandler)

  chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
    chrome.tabs.getAllInWindow null, (tabs) ->
      tabs.forEach (tab) ->
        if request.status is 'success'
          if tab.url.indexOf('asyncpost.html') isnt -1
            setTimeout ->
              chrome.tabs.remove tab.id, -> console.log 'tab remove'
            ,  1000

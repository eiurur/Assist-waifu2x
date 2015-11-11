$ ->

  ###
  Context Menu
  ###

  clickHandler = (info, tab) ->
    chrome.storage.sync.get "aw2x_noise", (item) ->
      info.noise = item.aw2x_noise
      chrome.storage.sync.get "aw2x_scale", (item) ->
        info.scale = item.aw2x_scale
        uid = Date.now()
        chrome.tabs.create url: "../build/views/views/asyncpost.html?uid=#{uid}&srcUrl=#{info.srcUrl}&noise=#{info.noise}&scale=#{info.scale}", 'active': false, (tab) ->
          console.log 'AAA'

  chrome.contextMenus.create
    'title': 'image to waifu2x'
    'contexts': [ 'image' ]
    'id': 'image'

  chrome.contextMenus.onClicked.addListener(clickHandler)

  ###

  ###
  notify = (params, callback) ->
    opts =
      title: params.title
      message: params.message
      type: 'basic'
      iconUrl: '../build/images/icon128.png'
    chrome.notifications.create opts, -> console.log 'notify'

  chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
    chrome.tabs.getAllInWindow null, (tabs) ->
      tabs.forEach (tab) ->
        console.log request
        return if tab.url.indexOf(request.uid) is -1

        if request.status is 'success'
          setTimeout ->
            chrome.tabs.remove tab.id, -> console.log 'tab remove'
            # SucessはNotificationしなくてもいいかな？
            # notify title: 'Success', message: "#{request.uid}.png"
          ,  1000

        if request.status is 'failure'
          setTimeout ->
            chrome.tabs.remove tab.id, -> console.log 'tab remove'
            notify title: 'Failure', message: "#{request.data.error.text}\n\n#{request.data.body.url}"
          ,  1000
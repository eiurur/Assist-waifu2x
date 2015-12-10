$ ->

  get = (key) ->
    return new Promise (resolve, reject) ->
      chrome.storage.sync.get key, (item) -> return resolve item[key]

  clickHandler = (info, tab) ->
    Promise.all [
      get "aw2x_style"
      get "aw2x_noise"
      get "aw2x_scale"
      get "aw2x_is_allowed_download_original_size"
    ]
    .then (itemList) ->
      console.log itemList
      info.style = itemList[0]
      info.noise = itemList[1]
      info.scale = itemList[2]
      info.isAllowedDownloadOriginalSize = itemList[3]
      info.uid = Date.now()
      url = "../build/views/views/asyncpost.html?uid=#{info.uid}&srcUrl=#{info.srcUrl}&style=#{info.style}&noise=#{info.noise}&scale=#{info.scale}&isAllowedDownloadOriginalSize=#{info.isAllowedDownloadOriginalSize}"
      chrome.tabs.create url: url, 'active': false, (tab) -> console.log 'Go Convert and Download'

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
        return if tab.url.indexOf(request.uid) is -1

        console.log request
        if request.status is 'success'
          setTimeout ->
            chrome.tabs.remove tab.id, -> console.log 'tab remove'
            # SucessはNotificationしなくてもいいかな？
            # notify title: 'Success', message: "#{request.uid}.png"
          ,  1000

        if request.status is 'failure'
          setTimeout ->
            chrome.tabs.remove tab.id, -> console.log 'tab remove'
            if request.data?
              console.log request.data
              notify title: 'Failure', message: "#{request.data.error.text}\n\n#{request.data.body.url}"
            else
              notify title: 'Failure', message: "#{request.uid}\n\nServer Down"
          ,  1000
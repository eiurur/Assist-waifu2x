$ ->
  syncGet = (key) ->
    return new Promise (resolve, reject) ->
      chrome.storage.sync.get key, (item) -> resolve item.key


  clickHandler = (info, tab) ->
    # Promise.all syncGet('aw2x_noise'), syncGet('aw2x_scale')
    # .then (items) ->
    #   console.log items
    #   info.noise = items

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

  chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
    chrome.tabs.getAllInWindow null, (tabs) ->
      tabs.forEach (tab) ->
        if request.status is 'success'
          if tab.url.indexOf(request.uid) isnt -1
            setTimeout ->
              chrome.tabs.remove tab.id, -> console.log 'tab remove'

              # TODO: Success Notification
              # opts =
              #   type: 'basic'
              #   title: 'Success'
              #   message: "#{request.uid}.png"
              #   iconUrl: '../build/images/icon48.png'
              # chrome.notifications.create 'success-notify', opts, -> console.log 'notify'
            ,  1000
        if request.status is 'failure'
          console.log request

          if tab.url.indexOf(request.uid) isnt -1
            setTimeout ->
              chrome.tabs.remove tab.id, -> console.log 'tab remove'

              # TODO: Failure Notification
              # alertify.error "変換に失敗しました。<br>ErrorCode: #{request.data.error.status}.<br>ErrorText: #{request.data.error.text}.<br>画像URL: #{request.data.body.url}"
            ,  1000
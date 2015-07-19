$ ->

  clickHandler = (info, tab) ->
    uid = Date.now()
    chrome.tabs.create url: "../build/views/views/asyncpost.html?uid=#{uid}&srcUrl=#{info.srcUrl}", 'active': false, (tab) ->
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
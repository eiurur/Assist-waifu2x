do ->

  ###
  Request
  ###
  downloadOriginImage = (params) ->
    filename = params.url.match(".+/(.+?)([\?#;].*)?$")[1]
    chrome.downloads.download
      url: params.url
      filename: filename
    , (downloadId) ->
      console.log downloadId

  post2CorsServer = (params) ->
    $.ajax
      type: "POST"
      url: "https://aw2x.eiurur.xyz/api/download/waifu2x"
      # url: "https://127.0.0.1:3003/api/download/waifu2x"
      data: params
      headers: "Access-Control-Allow-Origin": "*"
    .done (data) ->
      console.log '/post2CorsServer data =', data
      if data.error
        if qs.isAllowedDownloadOriginalSize then downloadOriginImage data: data, url: params.url
        chrome.runtime.sendMessage data: data, uid: qs.uid, status: 'failure', (response) -> console.log 'fail'
        return

      eiurur.utils.saveBlobImage body: data.body.data, type: data.type
      chrome.runtime.sendMessage data: data, uid: qs.uid, status: 'success', (response) -> console.log 'success'

    .fail (jqXHR, textStatus) ->
      console.log 'jqXHR = ', jqXHR
      console.log 'textSTatus = ', textStatus
      chrome.runtime.sendMessage uid: qs.uid, status: 'failure', (response) -> console.log 'fail'

  ###
  Start!!
  ###
  qs = eiurur.utils.getUrlVars()

  # インストールしたけど、popup.htmlで設定を変更していない場合
  # noise、scaleともに"undefined"が渡され、結果的にpost2CorsServerにはNaNが渡されることになる
  # それ用の対策
  if qs.noise is 'undefined' then qs.noise = 2
  if qs.scale is 'undefined' then qs.scale = 2
  if qs.isAllowedDownloadOriginalSize is 'undefined' or qs.isAllowedDownloadOriginalSize is 'false' then qs.isAllowedDownloadOriginalSize = false

  console.log qs

  post2CorsServer
    'url': qs.srcUrl
    'noise': qs.noise - 0
    'scale': qs.scale - 0

do ->

  ###
  Request
  ###
  post2CorsServer = (params) ->
    console.log params

    $.ajax
      type: "POST"
      url: "https://aw2x.eiurur.xyz/api/downloadFromURL"
      data: params
      headers: "Access-Control-Allow-Origin": "*"
    .done (data) ->
      if data.error
        chrome.runtime.sendMessage data: data, uid: qs.uid, status: 'failure', (response) -> console.log 'fail'
        return

      eiurur.utils.saveBlobImage body: data.body, type: data.type
      chrome.runtime.sendMessage data: data, uid: qs.uid, status: 'success', (response) -> console.log 'success'

    .fail (jqXHR, textStatus) ->
      console.log 'jqXHR = ', jqXHR
      console.log textStatus
      chrome.runtime.sendMessage uid: qs.uid, status: 'failure', (response) -> console.log 'fail'

  ###
  Start!!
  ###
  qs = eiurur.utils.getUrlVars()

  # インストールしたけど、popup.htmlで設定を変更していない場合
  # noise、scaleともに"undefined"が渡され、結果的にpost2CorsServerにはNaNが渡されることになる
  # それに対策
  if qs.noise is 'undefined' then qs.noise = 2
  if qs.scale is 'undefined' then qs.scale = 2

  post2CorsServer
    'url': qs.srcUrl
    'noise': qs.noise - 0
    'scale': qs.scale - 0

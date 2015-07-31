do ->

  ###
  Request
  ###
  post2CorsServer = (params) ->
    console.log params

    # alertify.log "変換中です。 しばらくお待ちください。"

    $.ajax
      type: "POST"
      url: "https://aw2x.eiurur.xyz/api/downloadFromURL"
      data: params
      headers: "Access-Control-Allow-Origin": "*"
    .done (data) ->
      if data.error
        chrome.runtime.sendMessage data: data, uid: qs.uid, status: 'failure', (response) -> console.log 'fail'
        return

      console.log data
      eiurur.utils.saveBlobImage body: data.body, type: data.type
      chrome.runtime.sendMessage data: data, uid: qs.uid, status: 'success', (response) -> console.log 'fail'
      console.log 'done'

    .fail (jqXHR, textStatus) ->
      console.log 'jqXHR = ', jqXHR
      console.log textStatus
      chrome.runtime.sendMessage uid: qs.uid, status: 'failure', (response) -> console.log 'fail'
      console.log 'fail'

  qs = eiurur.utils.getUrlVars()
  console.log qs
  post2CorsServer
    'url': qs.srcUrl
    'noise': qs.noise - 0
    'scale': qs.scale - 0

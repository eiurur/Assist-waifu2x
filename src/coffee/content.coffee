do ->

  ###
  Convert
  ###
  convert =
    base64toBlob: (_base64) ->
      i = undefined
      tmp = _base64.split(',')
      data = atob(tmp[1])
      mime = tmp[0].split(':')[1].split(';')[0]
      arr = new Uint8Array(data.length)
      i = 0
      while i < data.length
        arr[i] = data.charCodeAt(i)
        i++
      blob = new Blob([ arr ], type: mime)
      Blob

    toArrayBuffer: (buffer) ->
      ab = new ArrayBuffer(buffer.length)
      view = new Uint8Array(ab)
      i = 0
      while i < buffer.length
        view[i] = buffer[i]
        ++i
      ab


  ###
  Download
  ###
  saveBlobImage = (data) ->
    arrayBuffer = convert.toArrayBuffer data.body.data
    blob        = new Blob([arrayBuffer], type: data.type)
    filename    = "#{Date.now()}.png"
    saveAs blob, filename


  ###
  Request
  ###
  post2CorsServer = (params) ->
    console.log params

    # alertify.log "変換中です。 しばらくお待ちください。"

    $.ajax
      type: "POST"
      # url: "https://localhost:3000/api/downloadFromURL"
      url: "https://tk2-207-13331.vs.sakura.ne.jp:3000/api/downloadFromURL"
      data: params
      headers: "Access-Control-Allow-Origin": "*"
    .done (data) ->
      if data.error
        chrome.runtime.sendMessage data: data, uid: qs.uid, status: 'failure', (response) -> console.log 'fail'

        return

      console.log data
      saveBlobImage body: data.body, type: data.type
      chrome.runtime.sendMessage data: data, uid: qs.uid, status: 'success', (response) -> console.log 'fail'
      console.log 'done'

    .fail (jqXHR, textStatus) ->
      console.log 'jqXHR = ', jqXHR
      console.log textStatus
      chrome.runtime.sendMessage uid: qs.uid, status: 'failure', (response) -> console.log 'fail'
      console.log 'fail'


  getUrlVars = ->
    vars = {}
    param = location.search.substring(1).split('&')
    i = 0
    while i < param.length
      keySearch = param[i].search(RegExp('='))
      key = ''
      if keySearch != -1
        key = param[i].slice(0, keySearch)
      val = param[i].slice(param[i].indexOf('=', 0) + 1)
      if key != ''
        vars[key] = decodeURI(val)
      i++
    vars


  qs = getUrlVars()
  console.log qs
  post2CorsServer
    'url': qs.srcUrl
    'noise': 2
    'scale': 2
    # 'scale': scale - 0

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
      url: "https://localhost:3000/api/downloadFromURL"
      # url: "https://renge.herokuapp.com/api/downloadFromURL"
      data: params
      headers: "Access-Control-Allow-Origin": "*"
    .done (data) ->
      if data.error
        # alertify.error "変換に失敗しました。<br>ErrorCode: #{data.error.status}.<br>ErrorText: #{data.error.text}.<br>画像URL: #{data.body.url}"
        return

      console.log data
      saveBlobImage body: data.body, type: data.type
      chrome.runtime.sendMessage status: 'success', (response) -> console.log 'fail'
      console.log 'done'

    .fail (jqXHR, textStatus) ->
      console.log 'jqXHR = ', jqXHR
      console.log textStatus
      chrome.runtime.sendMessage status: 'fail', (response) -> console.log 'fail'
      console.log 'fail'


  url = location.search.substr(1).split '='
  console.log url
  post2CorsServer
    'url': url[1]
    'noise': 2
    'scale': 2
    # 'scale': scale - 0

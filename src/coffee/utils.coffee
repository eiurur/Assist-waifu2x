eiurur = {}
eiurur.utils =

  ###
  Convert
  ###
  convert:
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
  saveBlobImage: (params) ->
    arrayBuffer = @convert.toArrayBuffer params.data
    blob        = new Blob([arrayBuffer], type: params.type)
    filename    = "#{Date.now()}.png"
    saveAs blob, filename

  getUrlVars: ->
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
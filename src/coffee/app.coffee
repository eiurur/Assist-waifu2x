do ->
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

  #
  saveImage = (data) ->
    console.log data
    blob = convert.base64toBlob data.base64Data
    # ext = /media\/.*\.(png|jpg|jpeg):orig/.exec(attrs.url)[1]
    filename = "#{Date.now()}.png"
    saveAs blob, filename

  saveBlobImage = (data) ->
    console.log data
    console.log data.body
    arrayBuffer = convert.toArrayBuffer data.body.data
    blob = new Blob([arrayBuffer], type: data.type)
    filename = "#{Date.now()}.png"
    saveAs blob, filename

  # TODO: 関数化すべきものが違う。
  create =
    waifu2x__wrapper: (elem) ->
      html = '<span class="waifu2x__wrapper"/>'
      $(elem).wrap html

    # elem = waifu2x_wrapper
    'waifu2x__wrapper-overlay': (elem) ->
      elem = $(elem).parent('.waifu2x__wrapper')
      html = '<div class="waifu2x__wrapper-overlay"/>'
      $(elem).append html

    # elem = img
    # 'waifu2x__button__wrapper': (elem) ->
    #   html = '<div class="waifu2x__button__wrapper"/>'
    #   $(elem).before html

    # elem = waifu2x__wrapper-overlay
    button: (elem) ->
      elem2 = $(elem).next()

      html =
        '''
        <div class="btn-group waifu2x__button__wrapper" role="group">
          <button type="button" class="btn btn-default waifu2x__button" value="0">x1</button>
          <button type="button" class="btn btn-default waifu2x__button" value="1">x1.6</button>
          <button type="button" class="btn btn-default waifu2x__button" value="2">x2</button>
        </div>
        '''
      $(elem2).append html

  cloneImage = (elem) ->
    console.log elem
    $(elem).clone().wrap('.waifu2x__wrapper')

  deleteWaifu2xElement = ->
    $('.waifu2x__button__wrapper').remove()
    $('.waifu2x__wrapper-overlay').remove()
    $('.waifu2x__wrapper').remove()

  # elem = img
  handleWaifuWrapperOverlay = (elem) ->
    $(document).on 'mouseleave', '.waifu2x__wrapper', ->
      cloneImage(elem)
      deleteWaifu2xElement()



  download = (blob, filename) ->
    objectURL = (window.URL or window.webkitURL).createObjectURL(blob)
    a = document.createElement('a')
    e = document.createEvent('MouseEvent')

    #a要素のdownload属性にファイル名を設定
    a.download = filename
    a.href = objectURL

    #clickイベントを着火
    e.initEvent 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null
    a.dispatchEvent e
    return


  post2CorsServer = (params) ->
    console.log params
    alertify.log "変換中です。\nしばらくお待ちください。"
    $.ajax
      type: "POST"
      # url: "http://127.0.0.1:3000/api/download"
      url: "http://127.0.0.1:3000/api/downloadFromURL"
      # url: "https://renge.herokuapp.com/api/downloadFromURL"
      data: params
      headers: "Access-Control-Allow-Origin": "*"
    .done (data) ->
      console.log data
      saveBlobImage body: data.body, type: data.type
      alertify.success "変換に成功しました。"
      console.log 'done'

    .fail (jqXHR, textStatus) ->
      console.log jqXHR
      console.log textStatus
      alertify.error "変換に失敗しました。"
      console.log 'fail'



  post2Waifu2x = (url, params) ->
    console.log url
    console.log params
    $.ajax
      type: 'POST'
      url: url
      data: params
      headers:
        "Access-Control-Allow-Origin": "*"
    .done (response, status, xhr) ->
      # check for a filename
      filename = Date.now()
      disposition = xhr.getResponseHeader('Content-Disposition')
      if disposition and disposition.indexOf('attachment') != -1
        filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        matches = filenameRegex.exec(disposition)
        if matches != null and matches[1]
          filename = matches[1].replace(/['"]/g, '')
      type = xhr.getResponseHeader('Content-Type')
      blob = new Blob([ response ], type: type)
      if typeof window.navigator.msSaveBlob != 'undefined'
        # IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
        window.navigator.msSaveBlob blob, filename
      else
        URL = window.URL or window.webkitURL
        downloadUrl = URL.createObjectURL(blob)
        if filename
          # use HTML5 a[download] attribute to specify filename
          a = document.createElement('a')
          # safari doesn't support this yet
          if typeof a.download == 'undefined'
          #   window.location = downloadUrl
          else
            a.href = downloadUrl
            a.download = filename
            document.body.appendChild a
            a.click()
        # else
        #   window.location = downloadUrl
        setTimeout (->
          URL.revokeObjectURL downloadUrl
          return
        ), 100
        # cleanup
      return
    .fail (response, status, xhr) ->
      console.log response
      console.log status
      console.log xhr
    return false

  handleSend2Waifu2x = (elem) ->
    console.log 'aaa'

    $(elem).next().find('.waifu2x__button').each ->
      console.log 'asdasd'
      $(this).on 'click': ->

        # ボタンセットをafterで挿入してるから、prev
        src = $(this).parent().parent().prev('img').attr('src')
        console.log src
        # srcReplacedHttp = src.replace 'https:', ''
        # console.log srcReplacedHttp

        scale = $(this).val()
        # console.log scale

        post2CorsServer
          'url': src
          'noise': 1
          'scale': scale - 0

        # コードコピペしたけど400Errorでるやつ
        # post2Waifu2x "http://waifu2x.udp.jp/api",
        #   'url': src
        #   'noise': 1
        #   'scale': scale - 0

        # もともと動いていたけどファイルがぶっ壊れているvwe
        # $.ajax
        #   type: "POST"
        #   url: "http://waifu2x.udp.jp/api"
        #   data:
        #     'url': src
        #     'noise': 1
        #     'scale': scale - 0
        #   headers:
        #     "Access-Control-Allow-Origin": "*"
        # .done (data) ->
        #   console.log data
        #   saveBlobImage body: data.body, type: data.type
        # .fail (jqXHR, textStatus) ->
        #   console.log jqXHR

        #   console.log textStatus
        #   download new Blob([jqXHR.responseText], type: 'image/png'), Date.now()
        return false
      return

  # unHandleSend2Waifu2x: ->
  #   console.log 'bbb'
  #   $('.waifu2x__button').each ->
  #     $(this).off 'click'

  # $(document).on 'mouseenter', 'img', ->
  #   # ボタンの生成
  #   createButtons this

  #   # ボタンにイベントハンドル
  #   handleSend2Waifu2x()

  $(document).on 'mouseenter', 'img', ->
    console.log 'before in'
    if $(this).parent('.waifu2x__wrapper').length
      console.log $(this).parent('.waifu2x__wrapper')
      return
    console.log 'after in'

    create.waifu2x__wrapper this
    create['waifu2x__wrapper-overlay'] this
    create.button this

    # ボタンにイベントハンドル
    handleSend2Waifu2x this

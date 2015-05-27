do ->

  ###
  Conver, Request, Download
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

  saveBlobImage = (data) ->
    console.log data
    arrayBuffer = convert.toArrayBuffer data.body.data
    blob        = new Blob([arrayBuffer], type: data.type)
    filename    = "#{Date.now()}.png"
    saveAs blob, filename

  # 後で消す
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
    alertify.log "変換中です。 しばらくお待ちください。"
    $.ajax
      type: "POST"
      # url: "http://127.0.0.1:3000/api/download"
      # url: "http://127.0.0.1:3000/api/downloadFromURL"
      url: "https://renge.herokuapp.com/api/downloadFromURL"
      data: params
      headers: "Access-Control-Allow-Origin": "*"
    .done (data) ->
      if data.error
        console.log 'Error Code = ', data.error.status
        console.log 'Error text = ', data.error.text
        console.log 'data.body.url = ', data.body.url
        alertify.error "変換に失敗しました。<br>ErrorCode: #{data.error.status}.<br>ErrorText: #{data.error.text}.<br>画像URL: #{data.body.url}"
        return

      console.log data
      saveBlobImage body: data.body, type: data.type
      alertify.success "変換に成功しました。"
      console.log 'done'

    .fail (jqXHR, textStatus) ->
      console.log 'jqXHR = ', jqXHR
      console.log textStatus
      alertify.error "変換に失敗しました。"
      console.log 'fail'


  ###
  DOMやイベントハンドラ
  ###

  ###
    元のDOM
    <img src="/priv/57e5027720a6d08b4212d0d7cce876182c7ffe14/1432661228/4751520" data-watch_url="http://seiga.nicovideo.jp/seiga/im4751520">

    hoverした後のDOM
    <span class="waifu2x__wrapper">
      <img src="/priv/57e5027720a6d08b4212d0d7cce876182c7ffe14/1432661228/4751520" data-watch_url="http://seiga.nicovideo.jp/seiga/im4751520">
      <div class="waifu2x__wrapper-overlay">
        <div class="btn-group waifu2x__button__wrapper" role="group">
          <button type="button" class="btn btn-default waifu2x__button" value="0">x1</button>
          <button type="button" class="btn btn-default waifu2x__button" value="1">x1.6</button>
          <button type="button" class="btn btn-default waifu2x__button" value="2">x2</button>
        </div>
      </div>
    </span>
  ###

  # TODO: 関数化すべきものが違う。
  create =

    # elem = img
    waifu2x__wrapper: (elem) ->
      html = '<span class="waifu2x__wrapper"/>'
      $(elem).wrap html

    # elem = waifu2x_wrapper
    'waifu2x__wrapper-overlay': (elem) ->
      elem = $(elem).parent('.waifu2x__wrapper')
      html = '<div class="waifu2x__wrapper-overlay"/>'
      $(elem).append html

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

  # 後で消す
  cloneImage = (elem) ->
    console.log elem
    $(elem).clone().wrap('.waifu2x__wrapper')

  deleteWaifu2xElement = ->
    $('.waifu2x__button__wrapper').remove()
    $('.waifu2x__wrapper-overlay').remove()
    $('.waifu2x__wrapper').remove()

  # 後で消す
  # elem = img
  handleWaifuWrapperOverlay = (elem) ->
    $(document).on 'mouseleave', '.waifu2x__wrapper', ->
      cloneImage(elem)
      deleteWaifu2xElement()


  # imgの上にマウスが置かれたら'waifu2x'にリクエストを投げるためのボタンと、位置を調整するための要素を生成
  $(document).on 'mouseenter', 'img', ->

    # 既にボタンを生成済みなら何もしない
    if $(this).parent('.waifu2x__wrapper').length
      console.log $(this).parent('.waifu2x__wrapper')
      return

    create.waifu2x__wrapper this
    create['waifu2x__wrapper-overlay'] this
    create.button this

    handleSend2Waifu2x this


  handleSend2Waifu2x = (elem) ->
    console.log 'aaa'

    $(elem).next().find('.waifu2x__button').each ->
      $(this).on 'click': ->

        # ボタンセットをafterで挿入してるから、prev
        src   = $(this).parent().parent().prev('img').attr('src')
        scale = $(this).val()

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

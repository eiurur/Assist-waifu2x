do ->


  # TODO: 関数化すべきものが違う。
  create =
    waifu2x__wrapper: (elem) ->
      html = '<div class="waifu2x__wrapper"/>'
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

  # deleteButtons = ->
  #   # $('.waifu2x__wrapper').remove()
  #   $('.waifu2x__button__wrapper').remove()


  deleteWaifu2xElement = ->
    $('.waifu2x__button__wrapper').remove()
    $('.waifu2x__wrapper-overlay').remove()
    $('.waifu2x__wrapper').remove()

  # elem = img
  handleWaifuWrapperOverlay = (elem) ->
    $(document).on 'mouseleave', '.waifu2x__wrapper', ->
      cloneImage(elem)
      deleteWaifu2xElement()




  handleSend2Waifu2x = (elem) ->
    console.log 'aaa'

    $(elem).next().find('.waifu2x__button').each ->
      console.log 'asdasd'
      $(this).on 'click': ->

        # ボタンセットをafterで挿入してるから、prev
        src = $(this).parent().parent().prev('img').attr('src')
        console.log src
        scale = $(this).val()
        console.log scale

        $.ajax
          type: "POST"
          url: "http://waifu2x.udp.jp/api"
          data:
            'url': src
            'noise': 1
            'scale': scale
          headers: "Access-Control-Allow-Origin": "*"
        .done (data) ->
          console.log data
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

$ ->

  ###
  For popup.html
  ###
  changeLanguage = (lang = 'ja') ->
    i18next.use(i18nextXHRBackend).init { lng: lang }, (err, t) ->
      jqueryI18next.init i18next, $
      $('#main').localize()
      return

  chrome.storage.sync.get "aw2x_style", (item) ->
    $("input[type=radio][name=style][value=#{item.aw2x_style}]").attr "checked", true

  chrome.storage.sync.get "aw2x_noise", (item) ->
    $("input[type=radio][name=noise][value=#{item.aw2x_noise}]").attr "checked", true

  chrome.storage.sync.get "aw2x_scale", (item) ->
    $("input[type=radio][name=scale][value=#{item.aw2x_scale}]").attr "checked", true

  chrome.storage.sync.get "aw2x_is_allowed_download_original_size", (item) ->
    $(".allowable-download-original-size").prop "checked", item.aw2x_is_allowed_download_original_size

  chrome.storage.sync.get "aw2x_is_allowed_only_show_expanded_image", (item) ->
    $(".allowable-only-show-expanded-image").prop "checked", item.aw2x_is_allowed_only_show_expanded_image

  chrome.storage.sync.get "aw2x_lang", (item) ->
    $("[name=lang").val(item.aw2x_lang)
    changeLanguage(item.aw2x_lang)


  $("input[type=radio][name=style]").on "change", ->
    style = $("input[type=radio][name=style]:checked").val()
    item  = 'aw2x_style': style
    chrome.storage.sync.set item, -> console.log 'changed style!!'

  $("input[type=radio][name=noise]").on "change", ->
    noise = $("input[type=radio][name=noise]:checked").val()
    item  = 'aw2x_noise': noise
    chrome.storage.sync.set item, -> console.log 'changed noise!!'

  $("input[type=radio][name=scale]").on "change", ->
    scale = $("input[type=radio][name=scale]:checked").val()
    item  = 'aw2x_scale': scale
    chrome.storage.sync.set item, -> console.log 'changed scale!!'

  $(".allowable-download-original-size").on "change", ->
    isAllowedDownloadOriginalSize = $(".allowable-download-original-size").prop('checked')
    item  = 'aw2x_is_allowed_download_original_size': isAllowedDownloadOriginalSize
    chrome.storage.sync.set item, -> console.log 'changed isAllowedDownloadOriginalSize!!'

  $(".allowable-only-show-expanded-image").on "change", ->
    isAllowedOnlyShowExpandedImage = $(".allowable-only-show-expanded-image").prop('checked')
    item  = 'aw2x_is_allowed_only_show_expanded_image': isAllowedOnlyShowExpandedImage
    chrome.storage.sync.set item, -> console.log 'changed isAllowedOnlyShowExpandedImage!!'

  $("[name=lang").on "change", ->
    lang = $("[name=lang").val()
    item  = 'aw2x_lang': lang
    changeLanguage(item.aw2x_lang)
    chrome.storage.sync.set item, -> console.log 'changed lang!!'

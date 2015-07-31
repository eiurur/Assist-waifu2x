$ ->

  ###
  For popup.html
  ###
  chrome.storage.sync.get "aw2x_noise", (item) ->
    $("input[type=radio][name=noise][value=#{item.aw2x_noise}]").attr "checked", true

  chrome.storage.sync.get "aw2x_scale", (item) ->
    $("input[type=radio][name=scale][value=#{item.aw2x_scale}]").attr "checked", true

  $("input[type=radio][name=noise]").on "change", ->
    noise = $("input[type=radio][name=noise]:checked").val()
    item  = 'aw2x_noise': noise
    chrome.storage.sync.set item, -> console.log 'changed noise!!'

  $("input[type=radio][name=scale]").on "change", ->
    scale = $("input[type=radio][name=scale]:checked").val()
    item  = 'aw2x_scale': scale
    chrome.storage.sync.set item, -> console.log 'changed scale!!'


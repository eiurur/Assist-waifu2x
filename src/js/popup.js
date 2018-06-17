import $ from 'jquery';
import i18next from 'i18next';
import i18nextXHRBackend from 'i18next-xhr-backend';
import jqueryI18next from 'jquery-i18next';

$(function() {
  /*
  For popup.html
  */
  const changeLanguage = function(lang) {
    if (lang == null) {
      lang = 'en';
    }
    return i18next.use(i18nextXHRBackend).init({ lng: lang }, function(err, t) {
      jqueryI18next.init(i18next, $);
      $('#main').localize();
    });
  };

  chrome.storage.sync.get('aw2x_style', item =>
    $(`input[type=radio][name=style][value=${item.aw2x_style}]`).attr(
      'checked',
      true,
    ),
  );

  chrome.storage.sync.get('aw2x_noise', item =>
    $(`input[type=radio][name=noise][value=${item.aw2x_noise}]`).attr(
      'checked',
      true,
    ),
  );

  chrome.storage.sync.get('aw2x_scale', item =>
    $(`input[type=radio][name=scale][value=${item.aw2x_scale}]`).attr(
      'checked',
      true,
    ),
  );

  chrome.storage.sync.get('aw2x_mime', item =>
    $(`input[type=radio][name=mime][value=${item.aw2x_mime}]`).attr(
      'checked',
      true,
    ),
  );

  chrome.storage.sync.get('aw2x_is_allowed_download_original_size', item =>
    $('.allowable-download-original-size').prop(
      'checked',
      item.aw2x_is_allowed_download_original_size,
    ),
  );

  chrome.storage.sync.get('aw2x_is_allowed_only_show_expanded_image', item =>
    $('.allowable-only-show-expanded-image').prop(
      'checked',
      item.aw2x_is_allowed_only_show_expanded_image,
    ),
  );

  chrome.storage.sync.get('aw2x_lang', function(item) {
    item.aw2x_lang = item.aw2x_lang || 'en';
    $('[name=lang').val(item.aw2x_lang);
    return changeLanguage(item.aw2x_lang);
  });

  $('input[type=radio][name=style]').on('change', function() {
    const style = $('input[type=radio][name=style]:checked').val();
    const item = { aw2x_style: style };
    return chrome.storage.sync.set(item, () => console.log('changed style!!'));
  });

  $('input[type=radio][name=noise]').on('change', function() {
    const noise = $('input[type=radio][name=noise]:checked').val();
    const item = { aw2x_noise: noise };
    return chrome.storage.sync.set(item, () => console.log('changed noise!!'));
  });

  $('input[type=radio][name=scale]').on('change', function() {
    const scale = $('input[type=radio][name=scale]:checked').val();
    const item = { aw2x_scale: scale };
    return chrome.storage.sync.set(item, () => console.log('changed scale!!'));
  });

  $('input[type=radio][name=mime]').on('change', function() {
    const mime = $('input[type=radio][name=mime]:checked').val();
    const item = { aw2x_mime: mime };
    return chrome.storage.sync.set(item, () => console.log('changed mime!!'));
  });

  $('.allowable-download-original-size').on('change', function() {
    const isAllowedDownloadOriginalSize = $(
      '.allowable-download-original-size',
    ).prop('checked');
    const item = {
      aw2x_is_allowed_download_original_size: isAllowedDownloadOriginalSize,
    };
    return chrome.storage.sync.set(item, () =>
      console.log('changed isAllowedDownloadOriginalSize!!'),
    );
  });

  $('.allowable-only-show-expanded-image').on('change', function() {
    const isAllowedOnlyShowExpandedImage = $(
      '.allowable-only-show-expanded-image',
    ).prop('checked');
    const item = {
      aw2x_is_allowed_only_show_expanded_image: isAllowedOnlyShowExpandedImage,
    };
    return chrome.storage.sync.set(item, () =>
      console.log('changed isAllowedOnlyShowExpandedImage!!'),
    );
  });

  return $('[name=lang').on('change', function() {
    const lang = $('[name=lang').val();
    const item = { aw2x_lang: lang };
    changeLanguage(item.aw2x_lang);
    return chrome.storage.sync.set(item, () => console.log('changed lang!!'));
  });
});

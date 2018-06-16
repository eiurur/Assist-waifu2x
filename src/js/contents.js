import $ from 'jquery';

(function() {
  const CHROME_RUNTIME_ID = 'aopdgjkfalnfokhbgkemiajgfpefgjei';
  const isProduction = chrome.runtime.id === CHROME_RUNTIME_ID;
  const DEST_URL = isProduction
    ? 'https://aw2x.eiurur.xyz/api/download/waifu2x'
    : 'https://127.0.0.1:9966/api/download/waifu2x';

  /*
  Request
  */
  const downloadOriginImage = function(params) {
    const filename = params.url.match('.+/(.+?)([?#;].*)?$')[1];
    return chrome.downloads.download(
      {
        url: params.url,
        filename,
      },
      downloadId => console.log(downloadId),
    );
  };

  const post2CorsServer = function(params) {
    console.log(DEST_URL);
    return $.ajax({
      type: 'POST',
      url: DEST_URL,
      data: params,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
      .done(function(data) {
        console.log('/post2CorsServer data =', data);

        // asyncpost.htmlに拡大した画像を表示する
        if (qs.isAllowedOnlyShowExpandedImage) {
          let src = null;
          if (data.error) {
            src = params.url;
            chrome.runtime.sendMessage(
              { type: 'show', data, uid: qs.uid, status: 'failure' },
              response => console.log('fail'),
            );
            document.title = `x_x Fin ${qs.srcUrl}`;
          } else {
            const blob = eiurur.utils.convertArrayBuffer2Blob({
              data: data.body.data,
              type: data.type,
            });
            src = URL.createObjectURL(blob);
            chrome.runtime.sendMessage(
              { type: 'show', data, uid: qs.uid, status: 'success' },
              response => console.log('success'),
            );
            document.title = `^_^ Fin ${qs.srcUrl}`;
          }
          const html = `<img class='in-screen' src='${src}'>`;
          $('#result').html(html);
          $('img').on('click', function() {
            return $(this).toggleClass('in-screen');
          });
          return;
        }

        // 通常のダウンロード処理
        if (data.error) {
          // 結果の是非に関係なく、ダウンロードする
          if (qs.isAllowedDownloadOriginalSize) {
            downloadOriginImage({ data, url: params.url });
          }
          chrome.runtime.sendMessage(
            { data, uid: qs.uid, status: 'failure' },
            response => console.log('fail'),
          );
          return;
        }

        eiurur.utils.saveBlobImage({ data: data.body.data, type: data.type });
        return chrome.runtime.sendMessage(
          { data, uid: qs.uid, status: 'success' },
          response => console.log('success'),
        );
      })
      .fail(function(jqXHR, textStatus) {
        console.log('jqXHR = ', jqXHR);
        console.log('textSTatus = ', textStatus);
        return chrome.runtime.sendMessage(
          { uid: qs.uid, status: 'failure' },
          response => console.log('fail'),
        );
      });
  };

  /*
  Start!!
  */
  var qs = eiurur.utils.getUrlVars();

  // インストールしたけど、popup.htmlで設定を変更していない場合
  // noise、scaleともに"undefined"が渡され、結果的にpost2CorsServerにはNaNが渡されることになる
  // それ用の対策
  if (qs.style === 'undefined') {
    qs.style = 'art';
  }
  if (qs.noise === 'undefined') {
    qs.noise = 2;
  }
  if (qs.scale === 'undefined') {
    qs.scale = 2;
  }
  if (
    qs.isAllowedDownloadOriginalSize === 'undefined' ||
    qs.isAllowedDownloadOriginalSize === 'false'
  ) {
    qs.isAllowedDownloadOriginalSize = false;
  }
  if (
    qs.isAllowedOnlyShowExpandedImage === 'undefined' ||
    qs.isAllowedOnlyShowExpandedImage === 'false'
  ) {
    qs.isAllowedOnlyShowExpandedImage = false;
  }

  console.log(qs);

  return post2CorsServer({
    url: qs.srcUrl,
    style: qs.style,
    noise: qs.noise - 0,
    scale: qs.scale - 0,
  });
})();

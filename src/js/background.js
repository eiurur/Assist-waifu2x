import $ from 'jquery';

$(function() {
  const get = key =>
    new Promise(function(resolve, reject) {
      return chrome.storage.sync.get(key, item => resolve(item[key]));
    });

  const clickHandler = (info, tab) =>
    Promise.all([
      get('aw2x_style'),
      get('aw2x_noise'),
      get('aw2x_scale'),
      get('aw2x_is_allowed_download_original_size'),
      get('aw2x_is_allowed_only_show_expanded_image'),
    ]).then(function(itemList) {
      console.log(itemList);
      info.style = itemList[0];
      info.noise = itemList[1];
      info.scale = itemList[2];
      info.isAllowedDownloadOriginalSize = itemList[3];
      info.isAllowedOnlyShowExpandedImage = itemList[4];
      info.uid = Date.now();
      const url = `../build/views/views/asyncpost.html?uid=${info.uid}&srcUrl=${
        info.srcUrl
      }&style=${info.style}&noise=${info.noise}&scale=${
        info.scale
      }&isAllowedDownloadOriginalSize=${
        info.isAllowedDownloadOriginalSize
      }&isAllowedOnlyShowExpandedImage=${info.isAllowedOnlyShowExpandedImage}`;
      return chrome.tabs.create({ url, active: false }, tab =>
        console.log('Go Convert and Download'),
      );
    });

  chrome.contextMenus.create({
    title: 'image to waifu2x',
    contexts: ['image'],
    id: 'image',
  });

  chrome.contextMenus.onClicked.addListener(clickHandler);

  const notify = function(params, callback) {
    const opts = {
      title: params.title,
      message: params.message,
      type: 'basic',
      iconUrl: '../build/images/icon128.png',
    };
    return chrome.notifications.create(opts, () => console.log('notify'));
  };

  return chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>
    chrome.tabs.getAllInWindow(null, tabs =>
      tabs.forEach(function(tab) {
        if (tab.url.indexOf(request.uid) === -1) {
          return;
        }

        console.log(request);

        // 拡大した画像をダウンロードせずに表示だけするときは、タブを消さず、メッセージだけ通知する
        if (request.type === 'show') {
          if (request.status === 'success') {
            notify({ title: 'Success', message: `${request.uid}.png` });
          }
          if (request.status === 'failure') {
            if (request.data != null) {
              console.log(request.data);
              notify({
                title: 'Failure',
                message: `${request.data.error.text}\n\n${
                  request.data.body.url
                }`,
              });
            } else {
              notify({
                title: 'Failure',
                message: `${request.uid}\n\nServer Down`,
              });
            }
          }
          return;
        }

        // todo: downlolad typeであることを表明しないとね
        if (request.status === 'success') {
          setTimeout(
            () => chrome.tabs.remove(tab.id, () => console.log('tab remove')),
            // SucessはNotificationしなくてもいいかな？
            // notify title: 'Success', message: "#{request.uid}.png"
            1000,
          );
        }

        if (request.status === 'failure') {
          return setTimeout(function() {
            chrome.tabs.remove(tab.id, () => console.log('tab remove'));
            if (request.data != null) {
              console.log(request.data);
              return notify({
                title: 'Failure',
                message: `${request.data.error.text}\n\n${
                  request.data.body.url
                }`,
              });
            } else {
              return notify({
                title: 'Failure',
                message: `${request.uid}\n\nServer Down`,
              });
            }
          }, 1000);
        }
      }),
    ),
  );
});

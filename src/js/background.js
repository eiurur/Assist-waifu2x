import $ from 'jquery';
import { CHROME_EXTENSION_RESOURCES } from './configs';
import ContextMenuExtensionListener from './listener/ContextMenuExtensionListener';

$(function() {
  [new ContextMenuExtensionListener()].map(listener => listener.activate());

  const notify = function(params, callback) {
    const opts = {
      title: params.title,
      message: params.message,
      type: 'basic',
      iconUrl: CHROME_EXTENSION_RESOURCES.images.ICON_128,
    };
    return chrome.notifications.create(opts, () => console.log('notify'));
  };

  return chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>
    chrome.tabs.getAllInWindow(null, tabs =>
      tabs.forEach(function(tab) {
        if (tab.url.indexOf(request.uid) === -1) {
          return;
        }
        console.log('onMessage request => ', request);

        // 拡大した画像をダウンロードせずに表示だけするときは、タブを消さず、メッセージだけ通知する
        if (request.type === 'show') {
          if (request.status === 'success') {
            notify({ title: 'Success', message: `${request.uid}` });
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
                message: `${request.uid}\n\${request.message}`,
              });
            }
          }
          return;
        }

        // todo: downlolad typeであることを表明しないといけない
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
                message: `${request.uid}\n\n${request.message}`,
              });
            }
          }, 1000);
        }
      }),
    ),
  );
});

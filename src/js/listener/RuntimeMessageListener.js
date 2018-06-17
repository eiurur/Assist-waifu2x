import { CHROME_EXTENSION_RESOURCES } from '../configs';

export default class RuntimeMessageListener {
  constructor() {
    return this;
  }

  activate() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>
      chrome.tabs.getAllInWindow(null, tabs =>
        tabs
          .filter(tab => this.existRequestTab(tab, request))
          .forEach(tab => this.onMessage(tab, request)),
      ),
    );
  }

  /**
   * リクエスト用に作成したタブが存在するか確認する
   * @param {*} tab
   * @param {*} request
   * @return {Boolean} - 存在する = true, 存在しない = false
   */
  existRequestTab(tab, request) {
    return tab.url.indexOf(request.uid) !== -1;
  }

  /**
   * 拡大処理の結果を元に通知を出したり新規タブを表示したりタブを閉じたりする。
   * @param {*} tab -
   * @param {*} request - contents.jsから受け取ったレスポンス
   */
  onMessage(tab, request) {
    console.log('onMessage request => ', request);

    // 拡大した画像をダウンロードせずに表示だけするとき
    if (request.type === 'show') {
      this.showExpandedImageOnNewTab(request);
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
      setTimeout(() => {
        chrome.tabs.remove(tab.id, () => console.log('tab remove'));
        this.notify({
          title: 'Failure',
          message: `${request.uid}\n\n${request.message}`,
        });
      }, 1000);
    }
  }

  /**
   * 拡大した画像をダウンロードせず、新規タブに表示する場合の処理
   * タブは消さずに、メッセージだけを通知する。
   * @param {*} request
   */
  showExpandedImageOnNewTab(request) {
    if (request.status === 'success') {
      this.notify({ title: 'Success', message: `${request.uid}` });
    }
    if (request.status === 'failure') {
      if (request.data != null) {
        console.log(request.data);
        this.notify({
          title: 'Failure',
          message: `${request.data.error.text}\n\n${request.data.body.url}`,
        });
        return;
      }

      this.notify({
        title: 'Failure',
        message: `${request.uid}\n\${request.message}`,
      });
    }
  }

  /**
   * Chrome Notification APIで結果をユーザに通知する。
   * @param {*} params
   * @param {*} callback
   */
  notify(params, callback) {
    const opts = {
      title: params.title,
      message: params.message,
      type: 'basic',
      iconUrl: CHROME_EXTENSION_RESOURCES.images.ICON_128,
    };
    return chrome.notifications.create(opts, () => console.log('notify'));
  }
}

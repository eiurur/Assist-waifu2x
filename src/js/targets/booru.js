import $ from 'jquery';
import { CHROME_RUNTIME_ID, ENDPOINT_ROOT, ENDPOINT } from '../configs';
import { utils } from '../utils';

/**
 * Booru2x用のクライアントクラス
 * TODO: waifu2xと共通部分を抽象化
 * TODO: axiosに置換
 */
export default class Booru {
  constructor({
    uid,
    url,
    noise,
    scale,
    mime,
    isAllowedOnlyShowExpandedImage,
    isAllowedDownloadOriginalSize,
  }) {
    this.uid = uid;
    this.options = {
      url: url,
      noise: noise - 0,
      scale: scale - 0,
      mime: mime,
    };
    this.isAllowedOnlyShowExpandedImage = isAllowedOnlyShowExpandedImage;
    this.isAllowedDownloadOriginalSize = isAllowedDownloadOriginalSize;
    this.retryCount = 3;
    return this;
  }

  post() {
    return $.ajax({
      type: 'POST',
      url: ENDPOINT.booru2x,
      data: this.options,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
      .done(response => {
        console.log('/post2CorsServer response =', response);

        if (this.isAllowedOnlyShowExpandedImage) {
          chrome.tabs.create(
            {
              url: `${ENDPOINT_ROOT}images/${response.filename}`,
              active: false,
            },
            tab => console.log('Go Convert and show'),
          );
          document.title = `^_^ Success to resize ${this.options.url}`;
          return;
        }

        // 通常のダウンロード処理
        console.log(response.data);
        console.log(typeof response.data);
        const blob = utils.convertArrayBuffer2Blob({
          data: response.data.data,
          type: `image/${this.options.mime}`,
        });
        utils.saveBlobImage({
          blob,
          type: `image/${this.options.mime}`,
          filename: response.filename,
        });
        return chrome.runtime.sendMessage(
          {
            data: response.data,
            uid: this.uid,
            status: 'success',
            message: 'ok',
          },
          response => console.log('success'),
        );
      })
      .fail(async (jqXHR, textStatus, error) => {
        console.log('jqXHR = ', jqXHR);
        console.log('textSTatus = ', textStatus);

        if (this.retryCount > 0) {
          this.retryCount--;
          const wait = (5 + Math.abs(3 - this.retryCount)) * 1000;
          await utils.sleep(wait);
          return this.post();
        } else {
          if (this.isAllowedDownloadOriginalSize) {
            utils.downloadOriginImage({ url: params.url });
          }

          return chrome.runtime.sendMessage(
            { uid: this.uid, status: 'failure', message: jqXHR.responseText },
            response => console.log('fail'),
          );
        }
      });
  }
}

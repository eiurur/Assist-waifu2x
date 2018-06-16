import ChromeSyncStorageManager from '../lib/ChromeSyncStorageManager';

export default class ContextMenuExtensionListener {
  constructor() {
    this.contexts = ['image'];
    this.create();
    return this;
  }

  activate() {
    chrome.contextMenus.onClicked.addListener(this.onClick);
  }

  create() {
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        title: 'image to waifu2x',
        contexts: this.contexts,
        id: 'assist_waifu2x_image',
      });
    });
  }

  onClick(info, tab) {
    Promise.all([
      ChromeSyncStorageManager.get('aw2x_style'),
      ChromeSyncStorageManager.get('aw2x_noise'),
      ChromeSyncStorageManager.get('aw2x_scale'),
      ChromeSyncStorageManager.get('aw2x_is_allowed_download_original_size'),
      ChromeSyncStorageManager.get('aw2x_is_allowed_only_show_expanded_image'),
    ]).then(function(itemList) {
      console.log(itemList);
      info.style = itemList[0];
      info.noise = itemList[1];
      info.scale = itemList[2];
      info.isAllowedDownloadOriginalSize = itemList[3];
      info.isAllowedOnlyShowExpandedImage = itemList[4];
      info.uid = Date.now();
      const url = `../build/views/asyncpost.html?uid=${info.uid}&srcUrl=${
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
  }
}

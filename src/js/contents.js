import { utils } from './utils';
import Booru from './targets/booru';

// TODO: あとでどかす
const parseQueryString = () => {
  var qs = utils.getUrlVars();

  // インストールしたけど、popup.htmlで設定を変更していない場合
  // noise、scaleともに"undefined"が渡され、結果的にpost()にはNaNが渡されることになる
  // それ用の対策
  if (qs.style === 'undefined' || qs.style === 'null') {
    qs.style = 'art';
  }
  if (qs.noise === 'undefined' || qs.noise === 'null') {
    qs.noise = 2;
  }
  if (qs.scale === 'undefined' || qs.scale === 'null') {
    qs.scale = 2;
  }
  if (qs.mime === 'undefined' || qs.mime === 'null') {
    qs.mime = 'jpeg';
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

  return qs;
};

(function() {
  const qs = parseQueryString();
  const requester = new Booru({
    uid: qs.uid,
    url: qs.srcUrl,
    style: qs.style,
    noise: qs.noise - 0,
    scale: qs.scale - 0,
    mime: qs.mime,
    isAllowedDownloadOriginalSize: qs.isAllowedDownloadOriginalSize,
    isAllowedOnlyShowExpandedImage: qs.isAllowedOnlyShowExpandedImage,
  });
  requester.post();
})();

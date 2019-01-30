import { utils } from './utils';
import Booru from './targets/booru';

const isUndefinedString = val => {
  return val === 'undefined' || val === 'null' || val === 'false';
};
const parseQueryString = () => {
  var qs = utils.getUrlVars();

  // インストールしたけど、popup.htmlで設定を変更していない場合
  // noise、scaleともに"undefined"が渡され、結果的にpost()にはNaNが渡されることになる
  // それ用の対策
  if (isUndefinedString(qs.style)) {
    qs.style = 'art';
  }
  if (isUndefinedString(qs.noise)) {
    qs.noise = 2;
  }
  if (isUndefinedString(qs.scale)) {
    qs.scale = 2;
  }
  if (isUndefinedString(qs.mime)) {
    qs.mime = 'jpeg';
  }
  if (isUndefinedString(qs.isAllowedDownloadOriginalSize)) {
    qs.isAllowedDownloadOriginalSize = false;
  }
  if (isUndefinedString(qs.isAllowedOnlyShowExpandedImage)) {
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

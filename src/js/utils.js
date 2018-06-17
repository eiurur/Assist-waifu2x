import { saveAs } from 'file-saver';

const utils = {
  sleep: (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms)),
  /*
  Convert
  */
  convert: {
    base64toBlob(_base64) {
      let i = undefined;
      const tmp = _base64.split(',');
      const data = atob(tmp[1]);
      const mime = tmp[0].split(':')[1].split(';')[0];
      const arr = new Uint8Array(data.length);
      i = 0;
      while (i < data.length) {
        arr[i] = data.charCodeAt(i);
        i++;
      }
      const blob = new Blob([arr], { type: mime });
      return Blob;
    },

    toArrayBuffer(buffer) {
      const ab = new ArrayBuffer(buffer.length);
      const view = new Uint8Array(ab);
      let i = 0;
      while (i < buffer.length) {
        view[i] = buffer[i];
        ++i;
      }
      return ab;
    },
  },

  /*
  Download
  */
  saveBlobImage({ blob, type, filename }) {
    // const arrayBuffer = this.convert.toArrayBuffer(params.data);
    blob = new Blob([blob], { type });
    filename = filename || `${Date.now()}.png`;
    return saveAs(blob, filename);
  },

  convertArrayBuffer2Blob({ data, type }) {
    const arrayBuffer = this.convert.toArrayBuffer(data);
    const blob = new Blob([arrayBuffer], { type: type });
    return blob;
  },

  /**
   * CAUTION: chromeAPIを使用
   */
  downloadOriginImage: ({ url }) => {
    const filename = url.match('.+/(.+?)([?#;].*)?$')[1];
    return chrome.downloads.download(
      {
        url,
        filename,
      },
      downloadId => console.log(downloadId),
    );
  },

  getUrlVars() {
    const vars = {};
    const param = location.search.substring(1).split('&');
    let i = 0;
    while (i < param.length) {
      const keySearch = param[i].search(RegExp('='));
      let key = '';
      if (keySearch !== -1) {
        key = param[i].slice(0, keySearch);
      }
      const val = param[i].slice(param[i].indexOf('=', 0) + 1);
      if (key !== '') {
        vars[key] = decodeURI(val);
      }
      i++;
    }
    return vars;
  },
};

export { utils };

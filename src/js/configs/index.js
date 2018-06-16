const CHROME_RUNTIME_ID = 'aopdgjkfalnfokhbgkemiajgfpefgjei';

const ENDPOINT_ROOT =
  chrome.runtime.id === CHROME_RUNTIME_ID
    ? 'https://aw2x.eiurur.xyz/'
    : 'https://127.0.0.1:9966/';

const ENDPOINT = {
  booru2x: `${ENDPOINT_ROOT}api/download/booru2x`,
  waifu2x: `${ENDPOINT_ROOT}api/download/waifu2x`,
};

const CHROME_EXTENSION_RESOURCES = {
  css: {
    lib: `build/css/vendors/lib.min.css`,
  },
  js: {
    contents: 'build/js/contents.bundle.js',
    insert: 'build/js/insert.bundle.js',
  },
  images: {
    ICON_128: 'build/images/icon128.png',
  },
};

export {
  CHROME_RUNTIME_ID,
  ENDPOINT_ROOT,
  ENDPOINT,
  CHROME_EXTENSION_RESOURCES,
};

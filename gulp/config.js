const path = require('path');
const src = './src';
const dest = './build';
const relativeSrcPath = path.relative('.', src);

module.exports = {
  // 出力先の指定
  dest,

  pug: {
    src: src + '/**/!(_)*.pug',
    dest: dest,
  },

  images: {
    src: src + '/images/**',
    dest: dest + '/images/',
  },

  sass: {
    src: [src + '/sass/**/*.scss'],
    dest: dest + '/css/',
  },

  vendor_js: {
    src: ['node_modules/jquery/dist/jquery.js'],
    dest: dest + '/js/vendors/',
  },

  vendor_css: {
    src: ['node_modules/bootstrap/dist/css/bootstrap.min.css'],
    dest: dest + '/css/vendors/',
  },

  popup_css: {
    src: ['node_modules/bootstrap/dist/css/bootstrap.css'],
    dest: dest + '/css/vendors/',
  },

  clean: {
    target: './build',
  },

  watch: {
    pug: relativeSrcPath + '/views/**',
    images: relativeSrcPath + '/images/**',
    sass: relativeSrcPath + '/sass/**/*.scss',
  },
};

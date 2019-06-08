const gulp = require('gulp');
gulp.task(
  'build',
  gulp.parallel(
    'sass',
    'pug',
    'images',
    'vendor_js',
    'vendor_css',
    'popup_css',
  ),
);

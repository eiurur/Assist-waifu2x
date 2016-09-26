gulp   = require 'gulp'
$      = do require 'gulp-load-plugins'
config = require('../config').locales_copy

# locales copy
gulp.task 'locales_copy', ->
  gulp.src config.src
    .pipe $.plumber()
    .pipe gulp.dest config.dest
    .pipe $.notify 'locales task complete'
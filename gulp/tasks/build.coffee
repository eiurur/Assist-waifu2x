gulp = require 'gulp'
gulp.task 'build', [
  'bower_js'
  'coffee'
  'images_copy'
]
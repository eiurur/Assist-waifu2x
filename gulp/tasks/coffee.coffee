path    = require 'path'
gulp    = require 'gulp'
$       = do require 'gulp-load-plugins'
config  = require('../config').coffee
optFile = path.resolve 'config.json'

# coffee (src)
gulp.task 'coffee', ->
  gulp.src config.src
    .pipe $.plumber()
    .pipe $.coffeelint(optFile: optFile)
    .pipe $.coffeelint.reporter()
    .pipe $.coffee(bare: true)
    # .pipe $.concat('app.js')
    .pipe gulp.dest config.dest
    .pipe $.stripDebug()
    .pipe $.rename suffix: '.min'
    .pipe $.uglify mangle: false
    .pipe gulp.dest config.dest
    .pipe $.notify 'coffee task complete'
path = require("path")
dest = "./build"
src = "./src"

#//
# path.relative(from, to)
#
# path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb')
# returns
# '../../impl/bbb'
#
# gulp-watchの第一引数にはglobで監視対象のパスを指定するのですが、パスの先頭を./みたいに.から始めると正常に動作しません。
# それで./src/js/**みたいなパスをpath.relative()を使ってsrc/js/**に直す必要があります。
# これで監視対象以下でファイルの追加や削除があってもwatchしてくれるようになりました。
relativeSrcPath = path.relative(".", src)
module.exports =

  # 出力先の指定
  dest: dest

  coffee:
    src: src + "/coffee/*.coffee"
    dest: dest + "/js/"


  # jade:
  #   src: src + '/**/!(_)*.jade'
  #   dest: dest + '/app/views/'

  # jade_copy:
  #   src: src + app + "/views/**"
  #   dest: dest + app + '/views/'

  images_copy:
    src: src + "/images/**"
    dest: dest + '/images/'

  # sass:
  #   src: [src + "/sass/**//!(_)*"] # ファイル名の先頭がアンスコはビルド対象外にする
  #   dest: dest + "/css/"

  bower_js:
    src: [
      'bower_components/jquery/dist/jquery.min.js'
      'bower_components/es6-promise/promise.min.js'
    ]
    dest: dest + "/js/vendors/"

  clean:
    target: './build'

  watch:
    coffee: relativeSrcPath + "/coffee/*.coffee"
    images_copy: relativeSrcPath + "/images/**"
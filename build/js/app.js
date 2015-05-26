var Tumblr;

Tumblr = (function() {
  function Tumblr(hour) {
    this.hour = hour;
    this.hour = this.hour === 0 ? 24 : this.hour;
    this.RANDOM_NUMBER = 25;
    this.API_KEY = 'HaCz28sHvTdHBp8aNp4hMdkLusoykgigKw0OP0dahWGEH8IhSq';
    this.TUMBLOG_NAME = "ritz-repo";
    this.TUMBLR_DOMAIN = this.TUMBLOG_NAME + ".tumblr.com";
    this.API_URL = "https://api.tumblr.com/v2/blog/" + this.TUMBLR_DOMAIN;
    this.info_url = this.API_URL + "/info?api_key=" + this.API_KEY;
    this.posts_url = this.API_URL + "/posts/photo?api_key=" + this.API_KEY + "&tag=" + this.hour;
    this.random_posts_url = this.API_URL + "/posts/photo?api_key=" + this.API_KEY + "&tag=" + this.RANDOM_NUMBER;
  }

  Tumblr.prototype.getPosts = function(url) {
    return new Promise(function(resolve, reject) {
      return $.ajax({
        type: "GET",
        url: url,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      }).done(function(data) {
        console.log('getPosts = ', data);
        return resolve(data);
      });
    });
  };

  Tumblr.prototype.getOffset = function(url) {
    return new Promise(function(resolve, reject) {
      return $.ajax({
        type: "GET",
        url: "" + url,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      }).done(function(data) {
        var offset;
        offset = Math.floor(Math.random() * data.response.total_posts);
        return resolve(offset);
      });
    });
  };


  /*
   * 時間帯に限らない画像をランダムに取得
   */

  Tumblr.prototype.getRandomPosts = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return _this.getOffset(_this.random_posts_url).then(function(offset) {
          return _this.getPosts(_this.random_posts_url + "&offset=" + offset + "&limit=5");
        }).then(function(data) {
          return resolve(data.response);
        });
      };
    })(this));
  };


  /*
   * 対象の時間帯に属する画像をすべて取得ver
   */

  Tumblr.prototype.getRitz = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return _this.getPosts(_this.posts_url).then(function(data) {
          return resolve(data.response);
        });
      };
    })(this));
  };

  return Tumblr;

})();

(function() {

  /*
  Conver, Request, Download
   */
  var cloneImage, convert, create, deleteWaifu2xElement, download, handleSend2Waifu2x, handleWaifuWrapperOverlay, post2CorsServer, saveBlobImage;
  convert = {
    base64toBlob: function(_base64) {
      var arr, blob, data, i, mime, tmp;
      i = void 0;
      tmp = _base64.split(',');
      data = atob(tmp[1]);
      mime = tmp[0].split(':')[1].split(';')[0];
      arr = new Uint8Array(data.length);
      i = 0;
      while (i < data.length) {
        arr[i] = data.charCodeAt(i);
        i++;
      }
      blob = new Blob([arr], {
        type: mime
      });
      return Blob;
    },
    toArrayBuffer: function(buffer) {
      var ab, i, view;
      ab = new ArrayBuffer(buffer.length);
      view = new Uint8Array(ab);
      i = 0;
      while (i < buffer.length) {
        view[i] = buffer[i];
        ++i;
      }
      return ab;
    }
  };
  saveBlobImage = function(data) {
    var arrayBuffer, blob, filename;
    console.log(data);
    arrayBuffer = convert.toArrayBuffer(data.body.data);
    blob = new Blob([arrayBuffer], {
      type: data.type
    });
    filename = (Date.now()) + ".png";
    return saveAs(blob, filename);
  };
  download = function(blob, filename) {
    var a, e, objectURL;
    objectURL = (window.URL || window.webkitURL).createObjectURL(blob);
    a = document.createElement('a');
    e = document.createEvent('MouseEvent');
    a.download = filename;
    a.href = objectURL;
    e.initEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
  };
  post2CorsServer = function(params) {
    console.log(params);
    alertify.log("変換中です。 しばらくお待ちください。");
    return $.ajax({
      type: "POST",
      url: "https://renge.herokuapp.com/api/downloadFromURL",
      data: params,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    }).done(function(data) {
      if (data.error) {
        console.log('Error Code = ', data.error.status);
        console.log('Error text = ', data.error.text);
        console.log('data.body.url = ', data.body.url);
        alertify.error("変換に失敗しました。<br>ErrorCode: " + data.error.status + ".<br>ErrorText: " + data.error.text + ".<br>画像URL: " + data.body.url);
        return;
      }
      console.log(data);
      saveBlobImage({
        body: data.body,
        type: data.type
      });
      alertify.success("変換に成功しました。");
      return console.log('done');
    }).fail(function(jqXHR, textStatus) {
      console.log('jqXHR = ', jqXHR);
      console.log(textStatus);
      alertify.error("変換に失敗しました。");
      return console.log('fail');
    });
  };

  /*
  DOMやイベントハンドラ
   */

  /*
    元のDOM
    <img src="/priv/57e5027720a6d08b4212d0d7cce876182c7ffe14/1432661228/4751520" data-watch_url="http://seiga.nicovideo.jp/seiga/im4751520">
  
    hoverした後のDOM
    <span class="waifu2x__wrapper">
      <img src="/priv/57e5027720a6d08b4212d0d7cce876182c7ffe14/1432661228/4751520" data-watch_url="http://seiga.nicovideo.jp/seiga/im4751520">
      <div class="waifu2x__wrapper-overlay">
        <div class="btn-group waifu2x__button__wrapper" role="group">
          <button type="button" class="btn btn-default waifu2x__button" value="0">x1</button>
          <button type="button" class="btn btn-default waifu2x__button" value="1">x1.6</button>
          <button type="button" class="btn btn-default waifu2x__button" value="2">x2</button>
        </div>
      </div>
    </span>
   */
  create = {
    waifu2x__wrapper: function(elem) {
      var html;
      html = '<span class="waifu2x__wrapper"/>';
      return $(elem).wrap(html);
    },
    'waifu2x__wrapper-overlay': function(elem) {
      var html;
      elem = $(elem).parent('.waifu2x__wrapper');
      html = '<div class="waifu2x__wrapper-overlay"/>';
      return $(elem).append(html);
    },
    button: function(elem) {
      var elem2, html;
      elem2 = $(elem).next();
      html = '<div class="btn-group waifu2x__button__wrapper" role="group">\n  <button type="button" class="btn btn-default waifu2x__button" value="0">x1</button>\n  <button type="button" class="btn btn-default waifu2x__button" value="1">x1.6</button>\n  <button type="button" class="btn btn-default waifu2x__button" value="2">x2</button>\n</div>';
      return $(elem2).append(html);
    }
  };
  cloneImage = function(elem) {
    console.log(elem);
    return $(elem).clone().wrap('.waifu2x__wrapper');
  };
  deleteWaifu2xElement = function() {
    $('.waifu2x__button__wrapper').remove();
    $('.waifu2x__wrapper-overlay').remove();
    return $('.waifu2x__wrapper').remove();
  };
  handleWaifuWrapperOverlay = function(elem) {
    return $(document).on('mouseleave', '.waifu2x__wrapper', function() {
      cloneImage(elem);
      return deleteWaifu2xElement();
    });
  };
  $(document).on('mouseenter', 'img', function() {
    if ($(this).parent('.waifu2x__wrapper').length) {
      console.log($(this).parent('.waifu2x__wrapper'));
      return;
    }
    create.waifu2x__wrapper(this);
    create['waifu2x__wrapper-overlay'](this);
    create.button(this);
    return handleSend2Waifu2x(this);
  });
  return handleSend2Waifu2x = function(elem) {
    console.log('aaa');
    return $(elem).next().find('.waifu2x__button').each(function() {
      $(this).on({
        'click': function() {
          var scale, src;
          src = $(this).parent().parent().prev('img').attr('src');
          scale = $(this).val();
          post2CorsServer({
            'url': src,
            'noise': 1,
            'scale': scale - 0
          });
          return false;
        }
      });
    });
  };
})();

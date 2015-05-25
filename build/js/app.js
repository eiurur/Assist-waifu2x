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
  var cloneImage, create, deleteWaifu2xElement, handleSend2Waifu2x, handleWaifuWrapperOverlay;
  create = {
    waifu2x__wrapper: function(elem) {
      var html;
      html = '<div class="waifu2x__wrapper"/>';
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
  handleSend2Waifu2x = function(elem) {
    console.log('aaa');
    return $(elem).next().find('.waifu2x__button').each(function() {
      console.log('asdasd');
      $(this).on({
        'click': function() {
          var scale, src;
          src = $(this).parent().parent().prev('img').attr('src');
          console.log(src);
          scale = $(this).val();
          console.log(scale);
          $.ajax({
            type: "POST",
            url: "http://waifu2x.udp.jp/api",
            data: {
              'url': src,
              'noise': 1,
              'scale': scale
            },
            headers: {
              "Access-Control-Allow-Origin": "*"
            }
          }).done(function(data) {
            return console.log(data);
          });
          return false;
        }
      });
    });
  };
  return $(document).on('mouseenter', 'img', function() {
    console.log('before in');
    if ($(this).parent('.waifu2x__wrapper').length) {
      console.log($(this).parent('.waifu2x__wrapper'));
      return;
    }
    console.log('after in');
    create.waifu2x__wrapper(this);
    create['waifu2x__wrapper-overlay'](this);
    create.button(this);
    return handleSend2Waifu2x(this);
  });
})();

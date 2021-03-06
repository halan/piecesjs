(function() {
  ;
  (function($, window, document) {
    var Plugin, defaults, pluginName;
    pluginName = 'pieces';
    defaults = {
      pieces: 5,
      interval: 500,
      duration: 1000
    };
    Plugin = (function() {

      function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.$el = $(this.element);
        this.init(options);
      }

      Plugin.prototype.init = function(options) {
        if (!this.$el.filter('ul').length < 1) {
          if (options === 'next' || options === 'prev') {
            this.plugin = this.$el.data("plugin_" + this._name);
            this.options = this.plugin.options;
            this.height = this.plugin.height;
            this.width = this.plugin.width;
            return this.prev_or_next(options);
          } else {
            return this._prepare();
          }
        } else if (this.$el.filter('li').length > 0 && this.$el.parent().data("plugin_" + this._name)) {
          this.plugin = this.$el.parent().data("plugin_" + this._name);
          this.options = this.plugin.options;
          this.height = this.plugin.height;
          this.width = this.plugin.width;
          return this.move_me(this.$el, options);
        }
      };

      Plugin.prototype._prepare = function() {
        var _this = this;
        this.images = this.$el.find('img');
        this.images.filter(':first').load(function() {
          _this.height = _this.images.height();
          _this.width = _this.images.width();
          _this.$el.css({
            height: _this.height,
            overflow: 'hidden',
            display: 'block',
            position: 'relative'
          }).find('li').css({
            display: 'block',
            position: 'absolute',
            top: 0
          });
          _this._split_all();
          return _this.start();
        });
        return this.images.hide();
      };

      Plugin.prototype._split_all = function() {
        var $image, $li, $piece, $pieces, bg_x_pos, i, image_src, li, piece_h, piece_w, pieces, _i, _len, _ref, _results;
        _ref = this.$el.find('li');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          li = _ref[_i];
          $li = $(li);
          $image = $li.find('img:first');
          image_src = $image.attr('src');
          pieces = this.options.pieces;
          $pieces = $('<div class="pieces"></div>').appendTo($li);
          $li.data('piece-image-bg', image_src);
          _results.push((function() {
            var _results2;
            _results2 = [];
            for (i = 1; 1 <= pieces ? i <= pieces : i >= pieces; 1 <= pieces ? i++ : i--) {
              $piece = $('<div class="piece"></div>').appendTo($pieces);
              piece_w = this.width / pieces;
              piece_h = this.height;
              bg_x_pos = (i - 1) * piece_w;
              $piece.data('bg_x_pos', bg_x_pos);
              _results2.push($piece.css({
                backgroundImage: "url(" + image_src + ")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: "-" + bg_x_pos + "px -" + piece_h + "px",
                opacity: 0,
                height: piece_h,
                width: piece_w,
                float: 'left'
              }));
            }
            return _results2;
          }).call(this));
        }
        return _results;
      };

      Plugin.prototype.start = function() {
        return this.show_me(this.$el.find('li:first'), 'show');
      };

      Plugin.prototype.prev = function() {
        return this.prev_or_next('prev');
      };

      Plugin.prototype.next = function() {
        return this.prev_or_next('next');
      };

      Plugin.prototype.prev_or_next = function(direction) {
        var $target, filter;
        filter = {
          next: 'first',
          prev: 'last'
        };
        $target = this.$el.find('.current')[direction]();
        if ($target.length < 1) $target = this.$el.find('li:' + filter[direction]);
        return this.show_me($target);
      };

      Plugin.prototype.show_me = function($li) {
        var $old_current;
        $li = $($li);
        if ($($li).filter('li').length === !1) return;
        $old_current = $li.parent().find('.current');
        $old_current.removeClass('current').css('z-index', 9);
        $li.addClass('current').css('z-index', 10);
        if ($old_current.length > 0) this.move_me($old_current, 'top');
        return this.move_me($li, 'show');
      };

      Plugin.prototype.move_me = function($li, action) {
        var $pieces, $ul, delay, piece, _i, _len, _results,
          _this = this;
        $li = $($li);
        if ($($li).filter('li').length === !1) return;
        $ul = $li.parent();
        delay = 0;
        $pieces = $li.find('.pieces .piece');
        $ul.trigger('start-animation');
        $pieces.filter(':last').bind('end-piece-animation', function() {
          return $ul.trigger('end-animation');
        });
        _results = [];
        for (_i = 0, _len = $pieces.length; _i < _len; _i++) {
          piece = $pieces[_i];
          _results.push((function() {
            var $piece, bg_y_pos, duration, opacity;
            delay += _this.options.interval;
            $piece = $(piece);
            duration = _this.options.duration;
            bg_y_pos = _this.y_coord(action);
            opacity = action === 'show' ? 1 : 0;
            return setTimeout(function() {
              $piece.trigger('start-piece-animation');
              return $piece.stop().animate({
                backgroundPositionY: bg_y_pos + 'px',
                opacity: opacity
              }, duration, function() {
                return $piece.trigger('end-piece-animation');
              });
            }, delay);
          })());
        }
        return _results;
      };

      Plugin.prototype.y_coord = function(action) {
        return {
          show: 0,
          top: -this.height,
          bottom: this.height
        }[action];
      };

      return Plugin;

    })();
    return $.fn[pluginName] = function(options) {
      return this.each(function() {
        return $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      });
    };
  })(jQuery, window, document);

}).call(this);

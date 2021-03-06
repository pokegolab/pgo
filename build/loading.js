(function($) {
  return $.fn.loading = function(done) {
    var PI, TAU, c, cos, d, draw, fallback_image, max, max_size, min, min_size, s, sin;
    fallback_image = "http://d1ktyob8e4hu6c.cloudfront.net/static/img/wait.gif";
    min_size = 32;
    max_size = 100;
    s = max_size;
    c = s * 0.5;
    sin = Math.sin, cos = Math.cos, min = Math.min, max = Math.max, PI = Math.PI;
    TAU = PI * 2;
    draw = function(ctx, t) {
      var i, n, _i, _results;
      ctx.globalAlpha = 0.05;
      ctx.clearRect(0, 0, s, s);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#FFF';
      ctx.strokeStyle = '#000';
      ctx.shadowColor = '#999';
      ctx.shadowBlur = 20;
      n = 10;
      _results = [];
      for (i = _i = 0; 0 <= n ? _i <= n : _i >= n; i = 0 <= n ? ++_i : --_i) {
        ctx.beginPath();
        ctx.arc(c + sin(t * 0.05 + i) * c * 0.8, c + cos(t * 0.05 + i) * c * 0.8, c * 0.05 * (1 + cos(t * 0.2 + i * 0.2)), 0, TAU);
        ctx.fill();
        _results.push(ctx.stroke());
      }
      return _results;
    };
    d = "loading-indicator";
    return this.each(function() {
      var $canvas, $indicator, $parent, canvas, ctx, img, indicator, parent, start, t, update;
      parent = this;
      $parent = $(parent);
      $indicator = $parent.data(d);
      t = Math.random() * 100;
      if (done) {
        if ($indicator) {
          return $indicator.fadeOut(500, function() {
            $indicator.remove();
            return $parent.data(d, null);
          });
        }
      } else {
        if ($indicator) {
          return $indicator.stop().fadeIn(200);
        } else {
          indicator = canvas = document.createElement("canvas");
          $canvas = $(canvas);
          if (canvas.getContext) {
            ctx = canvas.getContext("2d");
            $indicator = $canvas;
          } else {
            indicator = img = document.createElement("img");
            $indicator = $(img).attr({
              src: fallback_image
            });
          }
          indicator = $indicator[0];
          document.body.appendChild(indicator);
          indicator.width = indicator.height = s;
          update = function() {
            var rect;
            rect = parent.getBoundingClientRect();
            s = max(min_size, 5, min(max_size, min(rect.width, rect.height)));
            c = s * 0.5;
            indicator.style.left = rect.left + (rect.width - s) * 0.5 + "px";
            indicator.style.top = rect.top + (rect.height - s) * 0.5 + "px";
            if (indicator.width !== s) {
              indicator.width = s;
            }
            if (indicator.height !== s) {
              indicator.height = s;
            }
            if (ctx) {
              draw(ctx, t += 0.3);
            }
            if ($.contains(document, indicator)) {
              return setTimeout(update, 15);
            }
          };
          start = function() {
            indicator.style.display = "block";
            indicator.style.position = "absolute";
            indicator.style.pointerEvents = "none";
            indicator.style.zIndex = "2";
            return update();
          };
          indicator.style.display = "none";
          setTimeout(start, 15);
          return $parent.data(d, $indicator);
        }
      }
    });
  };
})(jQuery);

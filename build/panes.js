var $G, E, EditorPane, G, Pane, PanesPane, PreviewPane, hell,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

$G = $(G = window);

E = function(tagname) {
  return document.createElement(tagname);
};

hell = function(boo) {
  return boo;
};

Pane = (function() {
  function Pane() {
    this.$ = $(E('div'));
    this.$.addClass("pane");
    this.flex = 1;
  }

  Pane.prototype.layout = function() {};

  Pane.prototype.destroy = function() {};

  return Pane;

})();

PanesPane = (function(_super) {
  var resizer_size;

  __extends(PanesPane, _super);

  resizer_size = 10;

  function PanesPane(_arg) {
    var orientation;
    orientation = _arg.orientation;
    PanesPane.__super__.constructor.call(this);
    this.$.addClass("panes-pane");
    this.orientation = orientation || "y";
    this.children = [];
    this.$resizers = $();
  }

  PanesPane.prototype.orient = function(orientation) {
    this.orientation = orientation;
    return this.layout();
  };

  PanesPane.prototype.layout = function() {
    var after, before, child_pane, child_pane_size, display, i, n_children, n_resizers, o, parent_pane, space_to_distribute_in_d1, _col_row, _d1, _d1_end, _d1_start, _d2, _d2_end, _d2_start, _i, _j, _len, _mouse_d1, _mouse_d2, _ref, _ref1, _results;
    parent_pane = this;
    o = this.orientation;
    display = {
      x: "inline-block",
      y: "block"
    }[o];
    _col_row = {
      x: "col",
      y: "row"
    }[o];
    _d1 = {
      x: "width",
      y: "height"
    }[o];
    _d1_start = {
      x: "left",
      y: "top"
    }[o];
    _d1_end = {
      x: "right",
      y: "bottom"
    }[o];
    _d2 = {
      x: "height",
      y: "width"
    }[o];
    _d2_start = {
      x: "top",
      y: "left"
    }[o];
    _d2_end = {
      x: "bottom",
      y: "right"
    }[o];
    _mouse_d1 = {
      x: "clientX",
      y: "clientY"
    }[o];
    _mouse_d2 = {
      x: "clientY",
      y: "clientX"
    }[o];
    n_children = parent_pane.children.length;
    n_resizers = Math.max(0, n_children - 1);
    space_to_distribute_in_d1 = parent_pane.$[_d1]() - resizer_size * n_resizers;
    _ref = parent_pane.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child_pane = _ref[_i];
      child_pane_size = child_pane.flex / n_children * space_to_distribute_in_d1;
      child_pane.$.css(_d1, child_pane_size);
      child_pane.$.css(_d2, parent_pane.$[_d2]());
      child_pane.$.css({
        display: display
      });
      child_pane.layout();
    }
    parent_pane.$resizers.remove();
    parent_pane.$resizers = $();
    _results = [];
    for (i = _j = 1, _ref1 = parent_pane.children.length - 1; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 1 <= _ref1 ? ++_j : --_j) {
      before = parent_pane.children[i - 1];
      after = parent_pane.children[i];
      _results.push((function(before, after) {
        var $more_resizers, $resizer;
        $resizer = $(E("div")).addClass("resizer " + _col_row + "-resizer");
        $resizer.insertAfter(before.$);
        $resizer.css(_d1, resizer_size);
        $resizer.css(_d2, parent_pane.$[_d2]());
        $resizer.css({
          display: display
        });
        $resizer.css({
          cursor: "" + _col_row + "-resize"
        });
        $more_resizers = $();
        $resizer.on("mouseover mousemove", function(e) {
          if (!$resizer.hasClass("drag")) {
            $more_resizers = $();
            $(".resizer").each(function(i, res_el) {
              var rect, _ref2;
              if ($resizer[0] === res_el) {
                return;
              }
              if (!$.contains(parent_pane.$[0], res_el)) {
                return;
              }
              rect = res_el.getBoundingClientRect();
              if ((rect[_d2_start] < (_ref2 = e[_mouse_d2]) && _ref2 < rect[_d2_end])) {
                return $more_resizers = $more_resizers.add(res_el);
              }
            });
            return $resizer.css({
              cursor: ($more_resizers.length ? "move" : "" + _col_row + "-resize")
            });
          }
        });
        $resizer.on("mouseout", function(e) {
          if (!$resizer.hasClass("drag")) {
            return $more_resizers = $();
          }
        });
        $resizer.on("mousedown", function(e, synthetic) {
          var mousemove;
          e.preventDefault();
          $resizer.addClass("drag");
          $more_resizers.addClass("drag");
          $("body").addClass("dragging");
          if (!synthetic) {
            $("body").addClass(($more_resizers.length ? "multi" : _col_row) + "-resizing");
          }
          $more_resizers.trigger(e, "synthetic");
          mousemove = function(e) {
            var after_end, b, before_start, mouse_pos, pane, total_size, _k, _len1, _ref2, _results1;
            before_start = before.$[0].getBoundingClientRect()[_d1_start];
            after_end = after.$[0].getBoundingClientRect()[_d1_end];
            b = resizer_size / 2 + 1;
            mouse_pos = e[_mouse_d1];
            mouse_pos = Math.max(before_start + b, Math.min(after_end - b, mouse_pos));
            before.$.css(_d1, mouse_pos - before_start - resizer_size / 2);
            after.$.css(_d1, after_end - mouse_pos - resizer_size / 2);
            before.layout();
            after.layout();
            total_size = (parent_pane.$[_d1]()) - (resizer_size * n_resizers);
            _ref2 = parent_pane.children;
            _results1 = [];
            for (_k = 0, _len1 = _ref2.length; _k < _len1; _k++) {
              pane = _ref2[_k];
              _results1.push(pane.flex = pane.$[_d1]() / total_size * n_children);
            }
            return _results1;
          };
          $G.on("mousemove", mousemove);
          return $G.on("mouseup", function() {
            $G.off("mousemove", mousemove);
            $("body").removeClass("dragging col-resizing row-resizing multi-resizing");
            $resizer.removeClass("drag");
            return $more_resizers.removeClass("drag");
          });
        });
        return parent_pane.$resizers = parent_pane.$resizers.add($resizer);
      })(before, after));
    }
    return _results;
  };

  PanesPane.prototype.add = function(pane) {
    this.$.append(pane.$);
    return this.children.push(pane);
  };

  PanesPane.prototype.destroy = function() {
    var child_pane, _i, _len, _ref, _results;
    _ref = this.children;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child_pane = _ref[_i];
      _results.push(typeof child_pane.destroy === "function" ? child_pane.destroy() : void 0);
    }
    return _results;
  };

  return PanesPane;

})(Pane);

PreviewPane = (function(_super) {
  __extends(PreviewPane, _super);

  function PreviewPane(_arg) {
    var $iframe, $pane, iframe, project;
    project = _arg.project;
    PreviewPane.__super__.constructor.call(this);
    this.$.addClass("preview-pane");
    $pane = this.$;
    this._codes_previous = {};
    this._coffee_body = "";
    $iframe = $(iframe = E('iframe')).attr({
      sandbox: "allow-same-origin allow-scripts allow-forms"
    });
    $iframe.appendTo($pane);
    project.$codes.on("change", (function(_this) {
      return function(e, lang) {
        var all_languages_are_there, body, codes, data_uri, error_handling, expected_lang, head, html, js, _i, _len, _ref;
        codes = project.codes;
        all_languages_are_there = true;
        _ref = project.languages;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          expected_lang = _ref[_i];
          if (codes[expected_lang] == null) {
            all_languages_are_there = false;
          }
        }
        if (!all_languages_are_there) {
          return;
        }
        $pane.loading();
        head = body = "";
        error_handling = function() {
          var d;
          d = document.createElement("div");
          d.className = "error bubble script-error";
          return window.onerror = function(error) {
            document.body.appendChild(d);
            d.style.position = "absolute";
            d.style.borderRadius = d.style.padding = d.style.bottom = d.style.right = "5px";
            return d.innerText = d.textContent = error;
          };
        };
        body += "<script>~" + error_handling + "()</script>\n<style>\n	.error {\n		color: red;\n	}\n	.error.bubble {\n		background: rgba(255, 0, 0, 0.8);\n		color: white;\n	}\n	body {\n		font-family: Helvetica, sans-serif;\n	}\n</style>";
        if (codes.html) {
          body += codes.html;
        }
        if (codes.css) {
          head += "<style>" + codes.css + "</style>";
        }
        if (codes.javascript) {
          body += "<script>" + codes.javascript + "</script>";
        }
        if (codes.coffee) {
          if (codes.coffee !== _this._codes_previous.coffee) {
            _this._coffee_body = (function() {
              try {
                js = CoffeeScript.compile(codes.coffee);
                return "<script>" + js + "</script>";
              } catch (_error) {
                e = _error;
                return "<h4 class='error'>CoffeeScript Compilation Error</h4>\n<p>" + e.message + "</p>";
              }
            })();
          }
          body += _this._coffee_body;
        }
        html = "<!doctype html>\n<html>\n	<head>\n		<meta charset=\"utf-8\">\n		" + head + "\n	</head>\n	<body style='background:black;color:white;'>\n		" + body + "\n	</body>\n</html>";
        $iframe.one("load", function() {
          return $pane.loading("done");
        });
        if (typeof $iframe[0].srcdoc === "string") {
          $iframe.attr({
            srcdoc: html
          });
        } else {
          data_uri = "data:text/html," + encodeURI(html);
          if (iframe.contentWindow) {
            iframe.contentWindow.location.replace(data_uri);
          } else {
            $iframe.attr({
              src: data_uri
            });
          }
        }
        return $.each(codes, function(lang, code) {
          return _this._codes_previous[lang] = code;
        });
      };
    })(this));
  }

  return PreviewPane;

})(Pane);

EditorPane = (function(_super) {
  __extends(EditorPane, _super);

  EditorPane.s = [];

  function EditorPane(_arg) {
    var $pad, $pane, editor, fb_fp, firepad, lang, project, session, trigger_code_change;
    lang = _arg.lang, project = _arg.project;
    EditorPane.s.push(this);
    EditorPane.__super__.constructor.call(this);
    this.$.addClass("editor-pane");
    $pane = this.$;
    trigger_code_change = function() {
      project.codes[lang] = editor.getValue();
      return project.$codes.triggerHandler("change", lang);
    };
    $pad = $(E('div'));
    $pad.appendTo($pane);
    $pane.loading();
    fb_fp = project.fb.child(lang);
    editor = this.editor = ace.edit($pad[0]);
    editor.on('change', trigger_code_change);
    session = editor.getSession();
    editor.setShowPrintMargin(false);
    editor.setReadOnly(true);
    editor.setSelectionStyle("text");
    session.setUseWrapMode(false);
    session.setUseWorker(lang !== "html");
    session.setUseSoftTabs(hell(false));
    session.setMode("ace/mode/" + lang);
    firepad = Firepad.fromACE(fb_fp, editor);
    firepad.on('ready', function() {
      var _ref;
      trigger_code_change();
      $pane.loading("done");
      editor.setReadOnly(false);
      if (firepad.isHistoryEmpty()) {
        return firepad.setText((_ref = {
          javascript: '// JavaScript\n\ndocument.write("Hello World!");\n',
          coffee: '\nspans = \n	for char in "Hello World from CoffeeScript!"\n		span = document.createElement("span")\n		document.body.appendChild(span)\n		span.innerHTML = char\n		(span)\n\nt = 0\nrainbow = ->\n	t += 0.05\n	for span, i in spans\n		span.style.color = "hsl(#{\n			Math.sin(t - i / 23) * 360\n		},100%,80%)"\n\nsetInterval rainbow, 30\n',
          css: 'body {\n	font-family: Helvetica, sans-serif;\n}'
        }[lang]) != null ? _ref : "");
      }
    });
  }

  EditorPane.prototype.layout = function() {
    return this.editor.resize();
  };

  EditorPane.prototype.destroy = function() {
    return this.editor.destroy();
  };

  return EditorPane;

})(Pane);

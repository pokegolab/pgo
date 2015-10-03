// Generated by CoffeeScript 1.9.3
(function() {
  var $G, E, G, hell,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  $G = $(G = window);

  E = function(tagname) {
    return document.createElement(tagname);
  };

  hell = function(b) {
    return b;
  };

  this.Pane = (function() {
    function Pane() {
      this.$ = $(E('div'));
      this.$.addClass("pane");
      this.flex = 1;
    }

    Pane.prototype.layout = function() {};

    Pane.prototype.destroy = function() {};

    return Pane;

  })();

  this.PanesPane = (function(superClass) {
    var resizer_size;

    extend(PanesPane, superClass);

    resizer_size = 8;

    function PanesPane(arg) {
      var orientation;
      orientation = arg.orientation;
      PanesPane.__super__.constructor.apply(this, arguments);
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
      var _col_row, _d1, _d1_end, _d1_start, _d2, _d2_end, _d2_start, _mouse_d1, _mouse_d2, after, before, child_pane, child_pane_size, display, i, j, k, len, len1, n_children, n_resizers, o, parent_pane, ref, ref1, results, space_to_distribute_in_d1;
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
      ref = parent_pane.children;
      for (j = 0, len = ref.length; j < len; j++) {
        child_pane = ref[j];
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
      ref1 = parent_pane.children;
      results = [];
      for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {
        before = ref1[i];
        if (after = parent_pane.children[i + 1]) {
          results.push((function(before, after) {
            var $more_resizers, $resizer;
            $resizer = $(E("div")).addClass("resizer " + _col_row + "-resizer");
            $resizer.insertAfter(before.$);
            $resizer.css(_d1, resizer_size);
            $resizer.css(_d2, parent_pane.$[_d2]());
            $resizer.css({
              display: display
            });
            $resizer.css({
              cursor: _col_row + "-resize"
            });
            $more_resizers = $();
            $resizer.on("mouseover mousemove", function(e) {
              if (!$resizer.hasClass("drag")) {
                $more_resizers = $();
                $(".resizer").each(function(i, res_el) {
                  var rect, ref2;
                  if ($resizer[0] === res_el) {
                    return;
                  }
                  if (!$.contains(parent_pane.$[0], res_el)) {
                    return;
                  }
                  rect = res_el.getBoundingClientRect();
                  if ((rect[_d2_start] < (ref2 = e[_mouse_d2]) && ref2 < rect[_d2_end])) {
                    return $more_resizers = $more_resizers.add(res_el);
                  }
                });
                return $resizer.css({
                  cursor: ($more_resizers.length ? "move" : _col_row + "-resize")
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
                var after_end, b, before_start, l, len2, mouse_pos, pane, ref2, results1, total_size;
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
                ref2 = parent_pane.children;
                results1 = [];
                for (l = 0, len2 = ref2.length; l < len2; l++) {
                  pane = ref2[l];
                  results1.push(pane.flex = pane.$[_d1]() / total_size * n_children);
                }
                return results1;
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
      }
      return results;
    };

    PanesPane.prototype.add = function(pane) {
      this.$.append(pane.$);
      return this.children.push(pane);
    };

    PanesPane.prototype.destroy = function() {
      var child_pane, j, len, ref, results;
      ref = this.children;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        child_pane = ref[j];
        results.push(typeof child_pane.destroy === "function" ? child_pane.destroy() : void 0);
      }
      return results;
    };

    return PanesPane;

  })(Pane);

  this.LeafPane = (function(superClass) {
    extend(LeafPane, superClass);

    LeafPane.instances = [];

    function LeafPane(arg) {
      var $label, $pane, lang, project;
      lang = arg.lang, project = arg.project;
      LeafPane.instances.push(this);
      LeafPane.__super__.constructor.apply(this, arguments);
      $pane = this.$;
      $pane.addClass("leaf-pane");
      $label = $(E('button')).addClass("label");
      $label.appendTo($pane);
      $label.text((function() {
        switch (lang) {
          case "coffee":
            return "CoffeeScript";
          case "js":
            return "JavaScript";
          case "css":
            return "CSS";
          case "html":
            return "HTML";
          case void 0:
            return "Output";
          default:
            return ("" + lang).toUpperCase();
        }
      })());
    }

    return LeafPane;

  })(Pane);

  this.OutputPane = (function(superClass) {
    extend(OutputPane, superClass);

    function OutputPane(arg) {
      var $errors, $iframe, $pane, iframe, project, show_error, wait_then;
      project = arg.project;
      OutputPane.__super__.constructor.apply(this, arguments);
      this.disable_output_key = "prevent running " + (project.fb.key());
      this.disable_output = localStorage[this.disable_output_key] != null;
      this.loaded = false;
      this.destroyed = false;
      $pane = this.$;
      $pane.addClass("output-pane");
      this._codes_previous = {};
      this._coffee_body = "";
      $errors = $(E('div')).addClass("errors");
      $errors.appendTo($pane);
      $iframe = $(iframe = E('iframe')).attr({
        sandbox: "allow-scripts allow-forms",
        allowfullscreen: true
      });
      $iframe.appendTo($pane);
      show_error = function(text) {
        var $error, go_to_line, line_number, line_text, match;
        $error = $(E("div")).addClass("error");
        if (match = text.match(/line (\d+)/)) {
          line_text = match[0];
          line_number = parseInt(match[1]);
          go_to_line = function() {
            var editor, editor_pane, j, len, ref;
            ref = EditorPane.instances;
            for (j = 0, len = ref.length; j < len; j++) {
              editor_pane = ref[j];
              if (editor_pane.lang === "coffee") {
                editor = editor_pane.editor;
              }
            }
            editor.resize(true);
            editor.focus();
            editor.scrollToLine(line_number, true, true, function() {});
            return editor.gotoLine(line_number, 0, true);
          };
          $error.append(document.createTextNode(text.slice(0, match.index)), $(E("button")).text(line_text).click(go_to_line), document.createTextNode(text.slice(match.index + line_text.length)));
        } else {
          $error.text(text);
        }
        return $error.appendTo($errors);
      };
      window.addEventListener("message", function(e) {
        var message;
        message = (function() {
          try {
            return JSON.parse(e.data);
          } catch (_error) {}
        })();
        switch (message != null ? message.type : void 0) {
          case "error":
            return show_error(message.error);
          default:
            return console.error("Unhandled message:", e.data);
        }
      });
      wait_then = function(fn) {
        var tid;
        tid = -1;
        return function() {
          var args;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          clearTimeout(tid);
          return tid = setTimeout(function() {
            return fn.apply(null, args);
          }, 600);
        };
      };
      project.$codes.on("change", wait_then((function(_this) {
        return function() {
          var $disabled_output, all_languages_are_there, body, codes, e, error_handling, expected_lang, head, html, j, js, len, ref, run;
          if (_this.destroyed) {
            return;
          }
          codes = project.codes;
          all_languages_are_there = true;
          ref = project.languages;
          for (j = 0, len = ref.length; j < len; j++) {
            expected_lang = ref[j];
            if (codes[expected_lang] == null) {
              all_languages_are_there = false;
            }
          }
          if (!all_languages_are_there) {
            return;
          }
          $pane.loading();
          $errors.empty();
          head = body = "";
          error_handling = function(parent_origin) {
            return window.onerror = function(error_message, src, lineno, linecol, error) {
              var message;
              message = {
                type: "error",
                error: error_message
              };
              return parent.postMessage(JSON.stringify(message), parent_origin);
            };
          };
          body += "<script>~" + error_handling + "(" + (JSON.stringify(location.origin)) + ")</script>";
          head += "<style>\n	body {\n		font-family: Helvetica, sans-serif;\n		background: black;\n		color: white;\n	}\n</style>";
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
                  if (e.location != null) {
                    show_error("CoffeeScript Compilation Error on line " + (e.location.first_line + 1) + ": " + e.message);
                  } else {
                    show_error("CoffeeScript Compilation Error: " + e.message);
                  }
                  return "";
                }
              })();
            }
            body += _this._coffee_body;
          }
          html = "<!doctype html>\n<html>\n	<head>\n		<meta charset=\"utf-8\">\n		<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n		" + head + "\n	</head>\n	<body>\n		" + body + "\n	</body>\n</html>";
          run = function() {
            var data_uri;
            localStorage[_this.disable_output_key] = true;
            $pane.find(".disabled-output").remove();
            $iframe.show();
            $(window).on("beforeunload", function() {
              if (_this.loaded) {
                delete localStorage[_this.disable_output_key];
              }
            });
            $iframe.on("load", function() {
              $pane.loading("done");
              return _this.loaded = true;
            });
            if (typeof $iframe[0].srcdoc === "string") {
              $iframe.attr({
                srcdoc: html
              });
            } else {
              data_uri = "data:text/html," + (encodeURI(html));
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
          $pane.find(".disabled-output").remove();
          if (_this.disable_output) {
            $pane.loading("done");
            $iframe.hide();
            $disabled_output = $("<div>").addClass("disabled-output").append($("<button>").click(run).append($('<svg height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg">\n	<defs xmlns="http://www.w3.org/2000/svg">\n		<filter id="drop-shadow" height="130%">\n			<feOffset dx="0" dy="2" in="SourceAlpha"/>\n			<feMerge>\n				<feMergeNode/>\n				<feMergeNode in="SourceGraphic"/>\n			</feMerge>\n		</filter>\n		<filter id="recessed" height="130%">\n			<feOffset dx="0" dy="2" in="SourceGraphic"/>\n		</filter>\n	</defs>\n	<path d="M20 33l12-9-12-9v18zm4-29C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 36c-8.82 0-16-7.18-16-16S15.18 8 24 8s16 7.18 16 16-7.18 16-16 16z"/>\n</svg>')), $("<p>This might crash...</p>"));
            return $pane.append($disabled_output);
          } else {
            return run();
          }
        };
      })(this)));
    }

    OutputPane.prototype.destroy = function() {
      if ((!this.disable_output) || (this.disable_output && this.loaded)) {
        delete localStorage[this.disable_output_key];
      }
      return this.destroyed = true;
    };

    return OutputPane;

  })(LeafPane);

  this.EditorPane = (function(superClass) {
    extend(EditorPane, superClass);

    EditorPane.instances = [];

    function EditorPane(arg) {
      var $pad, $pane, editor, fb_fp, lang, project, session, trigger_code_change;
      lang = arg.lang, project = arg.project;
      EditorPane.instances.push(this);
      this.lang = lang;
      EditorPane.__super__.constructor.apply(this, arguments);
      $pane = this.$;
      $pane.addClass("editor-pane");
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
      editor.setOption("highlightActiveLine", false);
      editor.setOption("highlightGutterLine", false);
      editor.$blockScrolling = Infinity;
      session.setUseWrapMode(false);
      session.setUseWorker(lang !== "html");
      session.setUseSoftTabs(hell(false));
      session.setMode("ace/mode/" + lang);
      this.firepad = Firepad.fromACE(fb_fp, editor);
      this.firepad.on('ready', (function(_this) {
        return function() {
          trigger_code_change();
          $pane.loading("done");
          return editor.setReadOnly(false);
        };
      })(this));
    }

    EditorPane.prototype.layout = function() {
      return this.editor.resize();
    };

    EditorPane.prototype.destroy = function() {
      var instance;
      this.firepad.dispose();
      this.editor.destroy();
      return EditorPane.instances = (function() {
        var j, len, ref, results;
        ref = EditorPane.instances;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          instance = ref[j];
          if (instance !== this) {
            results.push(instance);
          }
        }
        return results;
      }).call(this);
    };

    return EditorPane;

  })(LeafPane);

}).call(this);

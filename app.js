// Generated by CoffeeScript 1.6.3
var $G, $code, EditorPane, G, Pane, PanesPane, PreviewPane, code, fb_project, fb_root, hash, hell,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

code = {};

$code = $(code);

$G = $(G = window);

hell = function(boo) {
  return boo;
};

Pane = (function() {
  function Pane() {
    var $pane;
    $pane = this.$pane = $('<div class="pane">');
  }

  return Pane;

})();

PanesPane = (function(_super) {
  __extends(PanesPane, _super);

  function PanesPane(_arg) {
    var orientation,
      _this = this;
    orientation = _arg.orientation;
    PanesPane.__super__.constructor.call(this);
    this.orientation = orientation || "y";
    this.children = [];
    this.$pane.on("resize", function() {
      return _this.layout();
    });
  }

  PanesPane.prototype.orient = function(orientation) {
    this.orientation = orientation;
    return this.layout();
  };

  PanesPane.prototype.layout = function() {
    var child, display, mpl, mpm, n_children, n_resizers, opl, opm, _i, _len, _ref, _results;
    mpm = this.orientation === "x" ? "width" : "height";
    opm = this.orientation === "x" ? "height" : "width";
    display = this.orientation === "x" ? "inline-block" : "block";
    mpl = this.$pane[mpm]();
    opl = this.$pane[opm]();
    n_children = this.children.length;
    n_resizers = Math.max(0, n_children - 1);
    _ref = this.children;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      child.$pane.css(mpm, (mpl / n_children) - (10 * n_resizers));
      child.$pane.css(opm, opl);
      child.$pane.css({
        display: display
      });
      _results.push(child.$pane.triggerHandler("resize"));
    }
    return _results;
  };

  PanesPane.prototype.add = function(pane, location) {
    this.$pane.append(pane.$pane);
    return this.children.push(pane);
  };

  return PanesPane;

})(Pane);

PreviewPane = (function(_super) {
  __extends(PreviewPane, _super);

  function PreviewPane() {
    var $iframe, $pane;
    PreviewPane.__super__.constructor.call(this);
    $pane = this.$pane;
    $iframe = $('<iframe sandbox="allow-scripts allow-forms">');
    $iframe.appendTo($pane);
    $code.on("change", function() {
      var body, data_uri, e, error_handling, head, html, iframe, js;
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
      if (code.html) {
        body += code.html;
      }
      if (code.css) {
        head += "<style>" + code.css + "</style>";
      }
      if (code.javascript) {
        body += "<script>" + code.javascript + "</script>";
      }
      if (code.coffee) {
        try {
          js = CoffeeScript.compile(code.coffee);
          body += "<script>" + js + "</script>";
        } catch (_error) {
          e = _error;
          body += "<h4 class='error'>CoffeeScript Compilation Error</h4>\n<p>" + e.message + "</p>";
        }
      }
      html = "<!doctype html>\n<html>\n	<head>\n		<meta charset=\"utf-8\">\n		" + head + "\n	</head>\n	<body style='background:black;color:white;'>\n		" + body + "\n	</body>\n</html>";
      $iframe.one("load", function() {
        return $pane.loading("done");
      });
      if (typeof $iframe[0].srcdoc === "string") {
        return $iframe.attr({
          srcdoc: html
        });
      } else {
        data_uri = "data:text/html," + encodeURI(html);
        iframe = $iframe[0];
        if (iframe.contentWindow) {
          return iframe.contentWindow.location.replace(data_uri);
        } else {
          return $iframe.attr({
            src: data_uri
          });
        }
      }
    });
  }

  return PreviewPane;

})(Pane);

EditorPane = (function(_super) {
  __extends(EditorPane, _super);

  EditorPane.s = [];

  function EditorPane(_arg) {
    var $pad, $pane, editor, fb_fp, firepad, lang, session;
    lang = _arg.lang;
    EditorPane.s.push(this);
    EditorPane.__super__.constructor.call(this);
    $pane = this.$pane;
    $pad = $('<div>');
    $pad.appendTo($pane);
    $pane.loading();
    fb_fp = fb_project.child(lang);
    editor = this.editor = ace.edit($pad.get(0));
    editor.on('input', function() {
      code[lang] = editor.getValue();
      return $code.triggerHandler("change");
    });
    session = editor.getSession();
    editor.setShowPrintMargin(false);
    editor.setReadOnly(true);
    editor.setSelectionStyle("text");
    session.setUseWrapMode(true);
    session.setUseWorker(true);
    session.setUseSoftTabs(hell(false));
    session.setMode("ace/mode/" + lang);
    firepad = Firepad.fromACE(fb_fp, editor);
    firepad.on('ready', function() {
      var _ref;
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

  return EditorPane;

})(Pane);

fb_root = new Firebase("https://multifiddle.firebaseio.com/");

fb_project = null;

hash = G.location.hash.replace('#', '');

if (hash) {
  fb_project = fb_root.child(hash);
} else {
  fb_project = fb_root.push();
  G.location = G.location + '#' + fb_project.name();
}

$(function() {
  var bottom_pane, main_pane, relayout, setTheme, themes, themesByName, top_pane, _ref;
  main_pane = new PanesPane({
    orientation: "y"
  });
  main_pane.add(top_pane = new PanesPane({
    orientation: "x"
  }));
  main_pane.add(bottom_pane = new PanesPane({
    orientation: "x"
  }));
  top_pane.add(new EditorPane({
    lang: "coffee"
  }));
  top_pane.add(new EditorPane({
    lang: "css"
  }));
  bottom_pane.add(new EditorPane({
    lang: "html"
  }));
  bottom_pane.add(new PreviewPane);
  $('body').append(main_pane.$pane);
  relayout = function() {
    return main_pane.$pane.triggerHandler("resize");
  };
  $G.on("resize", relayout);
  relayout();
  _ref = ace.require("ace/ext/themelist"), themes = _ref.themes, themesByName = _ref.themesByName;
  setTheme = function(theme_name) {
    var edpane, theme, _i, _len, _ref1, _results;
    theme = themesByName[theme_name];
    if (theme.isDark) {
      $("body").addClass("dark");
    } else {
      $("body").removeClass("dark");
    }
    _ref1 = EditorPane.s;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      edpane = _ref1[_i];
      _results.push(edpane.editor.setTheme(theme.theme));
    }
    return _results;
  };
  setTheme("tomorrow_night_bright");
  return console.log(themes);
});

// NOTE: works with _$elz embeded scripts
// require jQuery

// mock _$elz global variable
var _$elz = _$elz || {};

!function ($) {
    // plugin config
    var config = {
        domain: "https://selz.com",
        settings: { colors: null }
    };

    // mock _$elz modal
    _$elz.m = _$elz.m || {
        s: {
            src: config.domain + "/assets/js/embed/modal.js"
        }
    };

    function openOverlay() {
        $.getJSON(config.domain + "/embed/itemdata/?itemUrl=" + $(this).attr("href") + "&callback=?", function (res) {
            _$elz.m.open(res.Url, null);
        });

        return false;
    }

    function setTheme($e) {
        var msg = null,
           e = $e.originalEvent;

        // liosten only selz messages
        if (e.origin !== config.domain || config.settings.colors === null) {
            return;
        }

        if (typeof e.message !== "undefined") {
            msg = e.message;
        } else if (typeof e.data !== "undefined") {
            msg = e.data;
        }

        if (/modal_colors/i.test(msg)) {
            var reply = config.settings.colors.buttonText + "," + config.settings.colors.buttonBg;
            e.source.postMessage(reply, config.domain);
        }
    }

    // listeners
    function listeners() {
        $(document.body).on("click", 'a[href^="http://selz.co/"]', openOverlay);
        $(window).on("message", setTheme);
    }

    // preload _$elz modal script if needed
    if (typeof _$elz.m.open === "undefined") {
        $.getScript(_$elz.m.s.src, function (data, textStatus, jqxhr) {
            listeners();
        });
    } else {
        listeners();
    }

    // plugin
    $.selz = function (options) {
        config.settings.colors = $.extend({}, config.settings.colors, options);
    };

} (window.jQuery);
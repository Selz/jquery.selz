// NOTE: works with _$elz embeded scripts
// require jQuery

// mock _$elz global variable
var _$elz = _$elz || {};

!function ($) {

    // plugin config
    var config = {
        domain: "https://selz.com",
        shortDomain: "http://selz.co",
        settings: {
            colors: null,
            prefetch: false
        },
        items: {}
    };
    
    // listeners
    function listeners() {
        $(document.body).on("click", 'a[href^="' + config.shortDomain + '/"]', openOverlay);
        $(window).on("message", onMessage);
    }
    
    function getItemData($link, callback) {
        // check cache first
        if (typeof config.items[$link.attr("href")] !== "undefined") {
            onDataReady($link, config.items[$link.attr("href")], callback, false);
        }
        else {
            $.getJSON(config.domain + "/embed/itemdata/?itemUrl=" + $link.attr("href") + "&callback=?", function (data) {
                // cache url & data
                $link.data("modal-url", data.Url);
                config.items[$link.attr("href")] = data;

                onDataReady($link, data, callback, true);
            });
        }
    }

    function onDataReady($link, data, callback, trigger) {
        // plugin callback
        if ($.isFunction(callback)) {
            callback(data);
        }

        // user defined callback
        if ($.isFunction(config.settings.onDataReady) && trigger) {
            config.settings.onDataReady($link, data);
        }
    }

    function openOverlay() {
        var $this = $(this),
            modalUrl = $this.data("modal-url"),
            href = $this.attr("href");

        if (typeof modalUrl === "string" && modalUrl.length > 0) {
            _$elz.m.open(modalUrl, null);
        } else {
            getItemData($this, function (res) {
                _$elz.m.open(res.Url, null);
            });
        }

        // user defined callback
        if ($.isFunction(config.settings.onModalOpen)) {
            config.settings.onModalOpen($this);
        }

        return false;
    }
    
    function onMessage($e) {
        var msg = null,
           e = $e.originalEvent;

        // listen only selz messages
        if (e.origin !== config.domain || config.settings.colors === null) {
            return;
        }

        if (typeof e.message !== "undefined") {
            msg = e.message;
        } else if (typeof e.data !== "undefined") {
            msg = e.data;
        }

        if (msg === "_$elz_modal_colors") {
            var reply = config.settings.colors.buttonText + "," + config.settings.colors.buttonBg;
            e.source.postMessage(reply, config.domain);
        }
		
		var keyValue = msg.split('|'),
				key = keyValue[0],
				value = keyValue[1];
		
		switch (key) {
			case "purchase":
				if ($.isFunction(config.settings.onPurchase)) {
					config.settings.onPurchase(JSON.parse(value));
				}
                break;

            case "processing":
				if ($.isFunction(config.settings.onProcessing)) {
					config.settings.onProcessing(JSON.parse(value));
				}
                break;
		}
    }

    function addModalTheme(type, color) {
        if (typeof color === "string" && color.length > 0) {
            if (config.settings.colors === null) {
                config.settings.colors = {};
            }
            config.settings.colors[type] = color;
        }
    }
    
    function prefetch() {
        $('a[href^="' + config.shortDomain + '/"]').each(function (i, link) {
            getItemData($(link), null);
        });
    }
        
    // mock _$elz modal
    _$elz.m = _$elz.m || {
        s: {
            src: config.domain + "/assets/js/embed/modal.js"
        }
    };

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
        // NOTE: only 2 colors now, but it would be better to have options.theme object, so we can simply use extend
        addModalTheme("buttonBg", options.buttonBg);
        addModalTheme("buttonText", options.buttonText);

        if (typeof options.onDataReady !== "undefined") {
            config.settings.onDataReady = options.onDataReady;
        }

        if (typeof options.onModalOpen !== "undefined") {
            config.settings.onModalOpen = options.onModalOpen;
        }
		
		if (typeof options.onPurchase !== "undefined") {
            config.settings.onPurchase = options.onPurchase;
        }

        if (typeof options.onProcessing !== "undefined") {
            config.settings.onProcessing = options.onProcessing;
        }

        if (options.prefetch) {
            config.settings.prefetch = true;
            prefetch();
        }
    };
    
} (window.jQuery);
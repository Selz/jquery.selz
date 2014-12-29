// NOTE: works with _$elz embeded scripts
// requires jQuery

;(function ($) {
	"use strict";

	// Set _$elz global variable
	window._$elz = window._$elz || {};

	// Plugin config
	var config = {
		domain: "https://selz.com",
		shortDomain: "http://selz.co",
		settings: {
			colors: null,
			prefetch: false
		},
		items: {}
	};
	
	// Listeners
	function listeners() {
		$(document.body).on("click", "a[href^='" + config.shortDomain + "/']", openOverlay);
		$(window).on("message", onMessage);
	}
	
	function getItemData($link, callback) {
		// Check cache first
		if (typeof config.items[$link.attr("href")] !== "undefined") {
			onDataReady($link, config.items[$link.attr("href")], callback, false);
		}
		else {
			$.getJSON(config.domain + "/embed/itemdata/?itemUrl=" + $link.attr("href") + "&callback=?", function (data) {
				// Cache url & data
				$link.data("modal-url", data.Url);
				config.items[$link.attr("href")] = data;

				onDataReady($link, data, callback, true);
			});
		}
	}

	function onDataReady($link, data, callback, trigger) {
		// Plugin callback
		if ($.isFunction(callback)) {
			callback(data);
		}
		// User defined callback
		if ($.isFunction(config.settings.onDataReady) && trigger) {
			config.settings.onDataReady($link, data);
		}
	}

	var openOverlay = function() {
		var $this = $(this),
			modalUrl = $this.data("modal-url");

		if (typeof modalUrl === "string" && modalUrl.length > 0) {
			window._$elz.m.open(modalUrl, null);
		} 
		else {
			getItemData($this, function (res) {
				window._$elz.m.open(res.Url, null);
			});
		}

		// User defined callback
		if ($.isFunction(config.settings.onModalOpen)) {
			config.settings.onModalOpen($this);
		}

		return false;
	};
	
	function onMessage($e) {
		var msg = null,
		   e = $e.originalEvent;

		// Listen only to Selz messages
		if (e.origin !== config.domain) {
			return;
		}

		if (typeof e.message !== "undefined") {
			msg = e.message;
		} else if (typeof e.data !== "undefined") {
			msg = e.data;
		}

		if (msg === "modaltheme|get" && config.settings.colors !== null) {
			var reply = config.settings.colors.buttonText + "," + config.settings.colors.buttonBg;
			e.source.postMessage(reply, config.domain);
			return;
		}
		
		var keyValue = msg.split("|"),
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
		$("a[href^='" + config.shortDomain + "/']").each(function (i, link) {
			getItemData($(link), null);
		});
	}
		
	// Mock _$elz modal
	window._$elz.m = window._$elz.m || {
		s: {
			src: config.domain + "/assets/js/embed/modal.js"
		}
	};

	// Preload _$elz modal script if needed
	if (typeof window._$elz.m.open === "undefined") {
		$.getScript(window._$elz.m.s.src, function () {
			listeners();
		});
	} 
	else {
		listeners();
	}

	// Plugin
	$.selz = function (options) {
		// For testing
		if (typeof options.domain !== "undefined") {
			config.domain = options.domain;
		}
		if (typeof options.shortDomain !== "undefined") {
			config.shortDomain = options.shortDomain;
		}

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

})(window.jQuery);
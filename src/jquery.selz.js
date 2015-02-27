// NOTE: works with _$elz embeded scripts
// requires jQuery

;(function ($) {
	"use strict";

	// Set _$elz global variable
	window._$elz = window._$elz || {};

	// Plugin config
	var config = {
		domain: 		"https://local.selz.com",
		shortDomain: 	"http://bit.ly",
		settings: {
			colors: 	null,
			prefetch: 	false
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
	
	function onMessage(event) {
		event = event.originalEvent;
		var message = event.data;

		// Listen only to Selz messages
		if (event.origin !== config.domain || typeof message !== "string") {
			return;
		}

		// Handle message
		try {
			var json = JSON.parse(message);

			switch(json.key) {
				case "modal-theme":
					if (config.settings.colors !== null) {
						event.source.postMessage(JSON.stringify({ 
	                        key: 	"modal-theme", 
	                        data: 	config.settings.colors.buttonText + "," + config.settings.colors.buttonBg 
	                    }), config.domain);
					}
					break;

				case "purchase":
					if ($.isFunction(config.settings.onPurchase)) {
						config.settings.onPurchase(json.data);
					}
					break;

				case "processing":
					if ($.isFunction(config.settings.onProcessing)) {
						config.settings.onProcessing(json.data);
					}
					break;
			}
		}
		// Invalid JSON, do nothing
		catch (exception) {}
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
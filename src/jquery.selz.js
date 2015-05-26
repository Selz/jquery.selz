// ==========================================================================
// Selz jQuery Plugin
// NOTE: Also works with _$elz embeded scripts
// Issues - https://github.com/selz/jquery.selz/issues
// ==========================================================================

;(function ($) {
	"use strict";

	// Set _$elz global variable
	window._$elz = window._$elz || {};

	// Plugin config
	var config = {
		domain: 			"https://selz.com",
		shortDomain: 	"http://selz.co",
		settings: {
			colors: 	null,
			prefetch: 	false
		},
		items: {}
	};
	
	// Listeners
	function listeners() {
		$(document.body)
			.on("click", "a[href^='" + config.shortDomain + "/']", openOverlay);
		
		$(window)
			.on("message", onMessage)
			.on("unload", function() {
				if ($.isFunction(config.settings.onClose) && "checkoutData" in config) {
					config.settings.onClose(config.checkoutData);
				}
			});
	}

	function isNullOrEmpty(value) {
        return (typeof value === "undefined" || value === null || value === "");
    }
	
	function getItemData($link, callback) {
		// Check cache first
		if (typeof config.items[$link.attr("href")] !== "undefined") {
			onDataReady($link, config.items[$link.attr("href")], callback, false);
		}
		else {
			$.getJSON(config.domain + "/embed/itemdata/?itemurl=" + $link.attr("href") + "&callback=?", function (data) {
				// Cache url & data
				$link.data("modal-url", data.Url);
				config.items[$link.attr("href")] = data;

				onDataReady($link, data, callback, true);
			})
			.fail(function() {
				console.error("Woops. It looks like your link is to a product that can't be found!");
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

	function openOverlay(event) {
		var $trigger = $(event.target),
			modalUrl = $trigger.data("modal-url");

		if (typeof modalUrl === "string" && modalUrl.length > 0) {
			window._$elz.m.open(modalUrl, null);
		} 
		else {
			getItemData($trigger, function (res) {
				window._$elz.m.open(res.Url, null);
			});
		}

		// User defined callback
		if ($.isFunction(config.settings.onModalOpen)) {
			config.settings.onModalOpen($trigger);
		}

		config.currentTrigger = $trigger;

		// Prevent the link click
		event.preventDefault();
	}
	
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
							data: 	{
								ct: 	config.settings.colors.buttonText,
								cb: 	config.settings.colors.buttonBg,
								chbg: 	config.settings.colors.checkoutHeaderBg,
								chtx: 	config.settings.colors.checkoutHeaderText
							}
						}), config.domain);

						// Get tracking parameter if it's set
						if($.isFunction(config.settings.getTracking)) {
							var tracking = config.settings.getTracking(config.currentTrigger);

							// Send to modal frame
							if(!isNullOrEmpty(tracking)) {
								event.source.postMessage(JSON.stringify({
									key: 	"set-tracking",
									data: 	tracking
								}), config.domain);
							}
						}
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

				case "modal-close":
					if ($.isFunction(config.settings.onClose)) {
						config.settings.onClose(json.data);
					}
					break;

				case "beforeunload":
					config.checkoutData = json.data;
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

		if (typeof options.onClose !== "undefined") {
			config.settings.onClose = options.onClose;
		}

		if(typeof options.getTracking !== "undefined") {
			config.settings.getTracking = options.getTracking;
		}

		if (options.prefetch) {
			config.settings.prefetch = true;
			prefetch();
		}
	};   

})(window.jQuery);
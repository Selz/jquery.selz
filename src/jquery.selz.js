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
		domain: 		"https://selz.com",
		shortDomain: 	"http://selz.co",
		prefetch: 		false,
		items: 			{},
		theme: 			{ checkout: {}, button: {} }
	},

	// Cache object
	cache = {
		items: {}
	};
	
	// Listeners
	function listeners() {
		$(document.body)
			.on("click", "a[href^='" + config.shortDomain + "/']", openOverlay);
		
		$(window)
			.on("message", onMessage)
			.on("unload", function() {
				if ($.isFunction(config.onClose) && "checkoutData" in config) {
					config.onClose(cache.checkoutData);
				}
			});
	}

	function isNullOrEmpty(value) {
        return (typeof value === "undefined" || value === null || value === "");
    }
	
	function getItemData($link, callback) {
		// Check cache first
		if (typeof cache.items[$link.attr("href")] !== "undefined") {
			onDataReady($link, cache.items[$link.attr("href")], callback, false);
		}
		else {
			$.getJSON(config.domain + "/embed/itemdata/?itemurl=" + $link.attr("href") + "&callback=?", function (data) {
				// Cache url & data
				$link.data("modal-url", data.Url);
				cache.items[$link.attr("href")] = data;

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
		if ($.isFunction(config.onDataReady) && trigger) {
			config.onDataReady($link, data);
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
		if ($.isFunction(config.onModalOpen)) {
			config.onModalOpen($trigger);
		}

		// Cache the current trigger
		cache.currentTrigger = $trigger;

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
					console.log(config.theme.checkout.headerBg);

					if (config.theme !== null) {
						event.source.postMessage(JSON.stringify({ 
							key: 	"modal-theme", 
							data: 	{
								ct: 	config.theme.button.text,
								cb: 	config.theme.button.bg,
								chbg: 	config.theme.checkout.headerBg,
								chtx: 	config.theme.checkout.headerText
							}
						}), config.domain);
					}

					// Get tracking parameter if it's set
					if($.isFunction(config.getTracking)) {
						var tracking = config.getTracking(cache.currentTrigger);

						// Send to modal frame
						if(!isNullOrEmpty(tracking)) {
							event.source.postMessage(JSON.stringify({
								key: 	"set-tracking",
								data: 	tracking
							}), config.domain);
						}
					}

					break;

				case "purchase":
					if ($.isFunction(config.onPurchase)) {
						config.onPurchase(json.data);
					}
					break;

				case "processing":
					if ($.isFunction(config.onProcessing)) {
						config.onProcessing(json.data);
					}
					break;

				case "modal-close":
					if ($.isFunction(config.onClose)) {
						config.onClose(config.currentTrigger, json.data);
					}
					break;

				case "beforeunload":
					cache.checkoutData = json.data;
					break;
			}
		}
		// Invalid JSON, do nothing
		catch (exception) {}
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
		// Extend users options with base config
		$.extend(true, config, options);

		// Prefetch data
		if (config.prefetch) {
			prefetch();
		}
	};   

})(window.jQuery);
// ==========================================================================
// Selz jQuery Plugin
// Issues - https://github.com/selz/jquery.selz/issues
// ==========================================================================

;
(function ($) {
    "use strict";

    // Set _$elz global variable
    window._$elz = window._$elz || {};

    // Plugin config
    var config = {
            domain: "https://selz.com",
            shortDomain: ["http://selz.co/", "http://bit.ly/"],
            longDomain: ".selz.com/item/",
            theme: {},
            cache: 300,
            checkout: false,
            redirect: false
        },

        // Callbacks
        callbacks = {},

        // Cache object
        cache = {
            supported: function () {
                if (!("localStorage" in window)) {
                    return false;
                }

                // Try to use it (it might be disabled, e.g. user is in private/porn mode)
                try {
                    window.localStorage.setItem("___support_test", "OK");
                    var result = window.localStorage.getItem("___support_test");
                    window.localStorage.removeItem("___support_test");
                    return (result === "OK");
                } catch (e) {
                    return false;
                }

                return false;
            },
            set: function (key, data, ttl) {
                // Bail if no support or no key specified
                if (!this.supported() || typeof key === "undefined") {
                    return;
                }

                // Default TTL to one hour
                if (!(typeof ttl === "boolean" && !ttl) && typeof ttl !== "number") {
                    ttl = 3600;
                }

                // Stringify objects to JSON
                if (data !== null && typeof data === "object") {
                    data = JSON.stringify(data);
                }

                // Store it
                window.localStorage.setItem(key, data);

                // Set a ttl (time to live)
                if (!(typeof ttl === "boolean" && !ttl)) {
                    window.localStorage.setItem(key + "_ttl", Date.now() + (ttl * 1000));
                }
            },
            get: function (key) {
                // If there's no support, the kye doesn't exist or it's stale, return null
                if (!this.supported() || !this.exists(key) || !this.validity(key)) {
                    return null;
                }

                var result;

                try {
                    result = JSON.parse(window.localStorage.getItem(key));
                } catch (e) {
                    result = window.localStorage.getItem(key);
                }

                return result;
            },
            clean: function () {
                // Bail if no support
                if (!this.supported()) {
                    return;
                }

                for (var key in window.localStorage) {
                    this.validity(key);
                }
            },
            validity: function (key) {
                if (key + "_ttl" in window.localStorage && window.localStorage[key + "_ttl"] < Date.now()) {
                    window.localStorage.removeItem(key);
                    window.localStorage.removeItem(key + "_ttl");
                    return false;
                }
                return true;
            },
            exists: function (key) {
                // Bail if no support
                if (!this.supported()) {
                    return false;
                }

                return (key in window.localStorage);
            }
        };

    // Listeners
    function listeners() {
        $(document.body)
            .on("click", generateSelector(), openOverlay);

        $(window)
            .on("message", onMessage)
            .on("unload", function () {
                if ($.isFunction(config.onClose) && "checkoutData" in config) {
                    config.onClose(cache.checkoutData);
                }
            });
    }

    function isNullOrUndefined(value) {
        return typeof value === "undefined" || value === null;
    }

    function isNullOrEmpty(value) {
        return isNullOrUndefined(value) || value === "";
    }

    // Generate the selector for the links
    function generateSelector() {
        var selector = "";

        // Short links
        // e.g. http://selz.co/1abc234 or http://bit.ly/1abc234
        $.each(config.shortDomain, function (index, value) {
            selector += "a[href^='" + value + "']" + (index < (config.shortDomain.length - 1) ? "," : "");
        });

        // Add support for full links
        // e.g. https://store.selz.com/item/563809ddf...
        if (typeof config.longDomain === "string") {
            selector += ",a[href*='" + config.longDomain + "']";
        }

        return selector;
    }

    // Fetch the item data
    function getItemData($link, callback) {
        // Get the URL for item
        var url = $link.attr("href");
        var useCache = typeof config.cache === "number";

        // Process the callbacks queue
        function processCallbacks(data) {
            // Bail if the URL has no callbacks or data isn't defined
            if (!(url in callbacks) || isNullOrUndefined(data) || !Object.keys(data).length) {
                return;
            }

            // Run all callbacks
            callbacks[url].forEach(function (item) {
                var $link = item[0];
                var callback = item[1];

                // Plugin callback
                if ($.isFunction(callback)) {
                    callback(data);
                }

                // Set modal url
                if (config.checkout) {
                    $link
                        .data("modal-url", data.CheckoutUrl)
                        .attr("href", data.CheckoutUrl);
                } else {
                    $link.data("modal-url", data.Url);
                }

                // User defined callback - allow overwriting "modal-url" with data.CheckoutUrl (skip to checkout)
                if ($.isFunction(config.onDataReady)) {
                    config.onDataReady($link, data);
                }
            });

            // Delete from queue
            delete callbacks[url];
        }

        // Callbacks queue
        // If queue exists for url, then just add and wait
        if (url in callbacks) {
            callbacks[url].push([$link, callback]);
            return;
        }
        // If no queue, create and add to it
        callbacks[url] = [];
        callbacks[url].push([$link, callback]);

        // Try from cache first
        if (useCache && cache.exists(url)) {
            processCallbacks(cache.get(url));
        } else {
            $.getJSON(config.domain + "/embed/itemdata/?itemurl=" + url + "&callback=?", function (data) {
                    if (useCache) {
                        cache.set(url, data, config.cache);
                    }
                    processCallbacks(data);
                })
                .fail(function () {
                    // Check for support
                    // https://developer.mozilla.org/en-US/docs/Web/API/Console/error
                    if ("console" in window) {
                        console.error("We couldn't find a matching item for that link");
                    }
                });
        }
    }

    // Open the actual overlay
    function openOverlay(event) {
        /*jshint validthis: true */
        var $trigger = $(this);
        var url = $trigger.data("modal-url");

        // Bail if the url is not set
        if (typeof url !== "string") {
            return;
        }

        // Prevent the link click
        event.preventDefault();

        // Open modal
        window._$elz.m.open(url, null);

        // User defined callback
        if ($.isFunction(config.onModalOpen)) {
            config.onModalOpen($trigger);
        }

        // Cache the current trigger
        cache.currentTrigger = $trigger;
    }

    // Message handler
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

            switch (json.key) {
                case "modal-theme":
                    var theme = {};

                    // Convert into new object
                    $.each(config.theme, function (element, colors) {
                        switch (element) {
                            case "button":
                                $.each(colors, function (key, color) {
                                    switch (key) {
                                        case "bg":
                                            theme.cb = color;
                                            break;

                                        case "text":
                                            theme.ct = color;
                                            break;
                                    }
                                });
                                break;

                            case "checkout":
                                $.each(colors, function (key, color) {
                                    switch (key) {
                                        case "headerBg":
                                            theme.chbg = color;
                                            break;

                                        case "headerText":
                                            theme.chtx = color;
                                            break;
                                    }
                                });
                                break;
                        }
                    });

                    event.source.postMessage(JSON.stringify({
                        key: "modal-theme",
                        data: (Object.keys(theme).length ? theme : null)
                    }), config.domain);

                    if (!config.redirect) {
                        event.source.postMessage(JSON.stringify({
                            key: "set-redirect",
                            data: config.redirect
                        }), config.domain);
                    }

                    // Get tracking parameter if it's set
                    if ($.isFunction(config.getTracking)) {
                        var tracking = config.getTracking(cache.currentTrigger);

                        // Send to modal frame
                        if (!isNullOrEmpty(tracking)) {
                            event.source.postMessage(JSON.stringify({
                                key: "set-tracking",
                                data: tracking
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
                        config.onClose(cache.currentTrigger, json.data);
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
    } else {
        listeners();
    }

    // Plugin
    $.selz = function (options) {
        // Extend users options with base config
        $.extend(true, config, options);

        // Make shortDomain an array
        if (!$.isArray(config.shortDomain)) {
            config.shortDomain = [config.shortDomain];
        }

        // Push domain to trigger domains to allow skip to checkout
        config.shortDomain.push(config.domain + "/checkout/item/");

        // Prefetch data
        $(generateSelector()).each(function () {
            getItemData($(this));
        });
    };

})(window.jQuery);
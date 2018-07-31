// ==========================================================================
// Selz jQuery Plugin
// Issues - https://github.com/selz/jquery.selz/issues
// ==========================================================================

($ => {
    const version = '1.0.17';

    // Helpers
    const isNullOrUndefined = value =>
        $.type(value) === 'undefined' || value === null;
    const isNullOrEmpty = value => isNullOrUndefined(value) || value === '';

    // Plugin config
    let config = {};
    const defaults = {
        domain: 'https://selz.com',
        shortDomain: ['http://selz.co/', 'http://bit.ly/'],
        longDomain: '.selz.com/item/',
        theme: {},
        cache: 300,
        checkout: false,
        redirect: false,
    };

    // Callbacks
    const callbacks = {};

    // Caching using local storage
    const cache = {
        supported: (() => {
            if (!('localStorage' in window)) {
                return false;
            }

            // Try to use it (it might be disabled, e.g. user is in private mode)
            try {
                const key = '___test';
                window.localStorage.setItem(key, key);
                window.localStorage.removeItem(key);
                return true;
            } catch (e) {
                return false;
            }
        })(),
        set: (key, data, ttl = 3600) => {
            // Bail if no support or no key/data specified
            if (!cache.supported || !key || !data) {
                return;
            }

            // Store it
            window.localStorage.setItem(
                key,
                $.isPlainObject(data) ? JSON.stringify(data) : data,
            );

            // Set a ttl (time to live)
            if ($.isNumeric(ttl)) {
                window.localStorage.setItem(
                    `${key}_ttl`,
                    Date.now() + ttl * 1000,
                );
            }
        },
        get: key => {
            // If there's no support, the kye doesn't exist or it's stale, return null
            if (
                !cache.supported ||
                !cache.exists(key) ||
                !cache.validity(key)
            ) {
                return null;
            }

            const result = window.localStorage.getItem(key);

            if (!result) {
                return null;
            }

            try {
                return JSON.parse(result);
            } catch (e) {
                return result;
            }
        },
        clean: () => {
            // Bail if no support
            if (!cache.supported) {
                return;
            }

            Object.keys(window.localStorage).forEach(key =>
                cache.validity(key),
            );
        },
        validity: key => {
            if (
                `${key}_ttl` in window.localStorage &&
                window.localStorage[`${key}_ttl`] < Date.now()
            ) {
                window.localStorage.removeItem(key);
                window.localStorage.removeItem(`${key}_ttl`);
                return false;
            }
            return true;
        },
        exists: key => {
            // Bail if no support
            if (!cache.supported) {
                return false;
            }

            return (
                !isNullOrUndefined(window.localStorage.getItem(key)) &&
                cache.validity(key)
            );
        },
    };

    // Parse a URL
    // https://gist.github.com/jlong/2428561
    function parseUrl(url = window.location.href) {
        // Create a faux anchor
        const parser = document.createElement('a');

        // Set the href to the url to parse
        parser.href = url;

        // Return the parts we need
        // Fix pathname for IE
        const info = {
            host: parser.host,
            hostname: parser.hostname,
            hash: parser.hash,
            protocol: parser.protocol,
            pathname:
                parser.pathname.indexOf('/') !== 0
                    ? `/${parser.pathname}`
                    : parser.pathname,
            search: parser.search,
        };

        // Get the filename from path
        const parts = info.pathname.split('/');
        info.filename = parts[parts.length - 1];

        return info;
    }

    // Generate the selector for the links
    function generateSelector() {
        let selector = '';

        // Short links
        // e.g. http://selz.co/1abc234 or http://bit.ly/1abc234
        $.each(config.shortDomain, (index, value) => {
            const separator = index < config.shortDomain.length - 1 ? ',' : '';
            selector += `a[href^='${value}']${separator}`;
        });

        // Add support for full links
        // e.g. https://store.selz.com/item/563809ddf...
        if ($.type(config.longDomain) === 'string') {
            selector += `,a[href*='${config.longDomain}']`;
        }

        return selector;
    }

    // Process the callbacks queue
    function processCallbacks(url, data) {
        // Bail if the URL has no callbacks or data isn't defined
        if (!data || !Object.keys(data).length) {
            return;
        }

        // Run all callbacks
        callbacks[url].forEach(item => {
            const $link = item[0];
            const callback = item[1];

            // Plugin callback
            if ($.isFunction(callback)) {
                callback(data);
            }

            // Set modal url
            if (config.checkout) {
                $link
                    .data('modal-url', data.CheckoutUrl)
                    .attr('href', data.CheckoutUrl);
            } else {
                $link.data('modal-url', data.Url);
            }

            // User defined callback - allow overwriting "modal-url" with data.CheckoutUrl (skip to checkout)
            if ($.isFunction(config.onDataReady)) {
                config.onDataReady($link, data);
            }
        });

        // Delete from queue
        delete callbacks[url];
    }

    // Fetch the item data
    function getItemData($link, callback) {
        // Get the URL for item
        const url = $link.attr('href');
        const useCache = $.type(config.cache) === 'number';

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
            processCallbacks(url, cache.get(url));
        } else {
            const { domain } = config;

            $.getJSON(
                `${domain}/embed/itemdata?v=${version}&itemurl=${url}&callback=?`,
                data => {
                    processCallbacks(url, data);

                    if (useCache) {
                        cache.set(url, data, config.cache);
                    }
                },
            ).fail(() => {
                throw new Error(
                    'We could not find a matching item for that link',
                );
            });
        }
    }

    // Open the actual overlay
    function openOverlay(event) {
        const $trigger = $(this);
        const url = $trigger.data('modal-url');

        // Bail if the url is not set
        if ($.type(url) !== 'string') {
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
    function onMessage(e) {
        const event = e.originalEvent;
        const message = event.data;

        const origin = parseUrl(event.origin);
        const current = parseUrl(config.domain);
        const allowedOrigin =
            origin.hostname === current.hostname ||
            origin.hostname.endsWith(`.${current.hostname}`);

        // Listen only to Selz messages
        if (!allowedOrigin || $.type(message) !== 'string') {
            return;
        }

        // Handle message
        try {
            const json = JSON.parse(message);
            const theme = {};

            switch (json.key) {
                case 'modal-theme':
                    // Convert into new object
                    $.each(config.theme, (element, colors) => {
                        switch (element) {
                            case 'button':
                                $.each(colors, (key, color) => {
                                    switch (key) {
                                        case 'bg':
                                            theme.cb = color;
                                            break;

                                        case 'text':
                                            theme.ct = color;
                                            break;

                                        default:
                                            break;
                                    }
                                });
                                break;

                            case 'checkout':
                                $.each(colors, (key, color) => {
                                    switch (key) {
                                        case 'headerBg':
                                            theme.chbg = color;
                                            break;

                                        case 'headerText':
                                            theme.chtx = color;
                                            break;

                                        default:
                                            break;
                                    }
                                });
                                break;

                            default:
                                break;
                        }
                    });

                    event.source.postMessage(
                        JSON.stringify({
                            key: 'modal-theme',
                            data: Object.keys(theme).length ? theme : null,
                        }),
                        event.origin,
                    );

                    if (!config.redirect) {
                        event.source.postMessage(
                            JSON.stringify({
                                key: 'set-redirect',
                                data: config.redirect,
                            }),
                            event.origin,
                        );
                    }

                    // Get tracking parameter if it's set
                    if ($.isFunction(config.getTracking)) {
                        const tracking = config.getTracking(
                            cache.currentTrigger,
                        );

                        // Send to modal frame
                        if (!isNullOrEmpty(tracking)) {
                            event.source.postMessage(
                                JSON.stringify({
                                    key: 'set-tracking',
                                    data: tracking,
                                }),
                                event.origin,
                            );
                        }
                    }

                    break;

                case 'purchase':
                    if ($.isFunction(config.onPurchase)) {
                        config.onPurchase(json.data);
                    }
                    break;

                case 'processing':
                    if ($.isFunction(config.onProcessing)) {
                        config.onProcessing(json.data);
                    }
                    break;

                case 'modal-close':
                    if ($.isFunction(config.onClose)) {
                        config.onClose(cache.currentTrigger, json.data);
                    }
                    break;

                case 'beforeunload':
                    cache.checkoutData = json.data;
                    break;

                default:
                    break;
            }
        } catch (exception) {
            // Invalid JSON, do nothing
        }
    }

    // Listeners
    function listeners() {
        $(document.body).on('click', generateSelector(), openOverlay);

        $(window)
            .on('message', onMessage)
            .on('unload', () => {
                if ($.isFunction(config.onClose) && 'checkoutData' in config) {
                    config.onClose(cache.checkoutData);
                }
            });
    }

    // Mock the _$elz modal object
    function mockModal() {
        // Set _$elz global variable
        window._$elz = window._$elz || {};

        // Mock _$elz modal
        window._$elz.m = window._$elz.m || {
            d: config.domain,
            s: {
                src: `${config.domain}/assets/js/embed/modal.js`,
            },
        };
    }

    // Plugin
    $.selz = options => {
        // Extend users options with base config
        config = $.extend(true, {}, defaults, options);

        // Make shortDomain an array
        if (!$.isArray(config.shortDomain)) {
            config.shortDomain = [config.shortDomain];
        }

        mockModal();

        // Push domain to trigger domains to allow skip to checkout
        config.shortDomain.push(`${config.domain}/checkout/item/`);

        // Prefetch data
        $(generateSelector()).each((index, element) => getItemData($(element)));

        // Preload _$elz modal script if needed
        if ($.type(window._$elz.m.open) === 'undefined') {
            $.getScript(window._$elz.m.s.src, listeners);
        } else {
            listeners();
        }
    };
})(window.jQuery);

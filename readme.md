# Selz jQuery Plugin

Open your [Selz.com](https://selz.com) item links in an overlay to let your customers complete their purchase directly on your site.

## Changelog

See [changelog.md](changelog.md).

## Examples

See bundled `index.html` and `index.options.html` file for examples.

## Basic Setup

For a very simple installation where you only want the overlay functionality for any Selz item, the setup is very easy.

#### JavaScript

Include jQuery (if you haven't already) and `jquery.selz.js` (from `dist`) files, just before the closing `</body>` tag.

```html
<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
<script src="dist/jquery.selz.js"></script>
```

Then in your document.ready block add the following:

```javascript
$.selz();
```

You can pass extra options as outlined below.

#### CSS

Include `jquery.selz.css` (from `dist`) into the `<head>` of your page.

```html
<link href="src/jquery.selz.min.css" rel="stylesheet">
```

#### HTML

Add the short link to your [Selz.com](https://selz.com) products into the `<body>` of your page. This can be found on the share item page within Selz

```html
<a href="https://selz.co/1gfLTzi">Buy now</a>
```

## Installation

To install the Selz plugin, you will have to include the following resources in your page. The JS files should be loaded in the order below. For the CSS file, you can either incorporate it with your site's stylesheet, or load it externally through the `<link>` element in `<head>`.

| Type       | File Name                                                      | Description                                                                                                                                                                                                                                                                             |
| ---------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| JavaScript | [`jquery.min.js`](https://code.jquery.com/jquery-3.3.1.min.js) | The _latest_ verson of jQuery is recommended for the Selz plugin functionality but v1.9 is minimum.                                                                                                                                                                                     |
| JavaScript | `jquery.selz.js`                                               | Confers the main functionality of the Selz plugin. Alternatively, you can load the minified version, `jquery.selz.min.js`.                                                                                                                                                              |
| CSS        | `jquery.selz.css`                                              | Offers styles that are crucial for the correct display of the Selz overlay. The appearance will break if this is not included. You can customise the styles in the source less file `jquery.selz.less` or write your own _at your own risk_. Minified version is `jquery.selz.min.css`. |

## Options

You can also fetch data about your product, customise overlay button colors and add event callbacks.

| Option                      | Type     | Default     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------------- | -------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `cache`                     | number   | `300`       | How long to cache the product data in seconds, using local storage (if supported). This will improve performance for end users when navigating your site. To disable caching, set this to <code>false</code>.                                                                                                                                                                                                                                    |
| `checkout`                  | boolean  | `false`     | Bypass the item detail page and go straight to the checkout with the item already in the cart. This speeds up the purchase process.                                                                                                                                                                                                                                                                                                              |
| `redirect`                  | boolean  | `false`     | Disables redirect after successful purchase (if it's enabled in your store checkout settings).                                                                                                                                                                                                                                                                                                                                                   |
| `theme.button.bg`           | String   | `#6d48cc`   | The button base gradient color for primary call to actions within the overlay. This needs to be hex color code.                                                                                                                                                                                                                                                                                                                                  |
| `theme.button.text`         | String   | `#fff`      | Sets the color for the button text.                                                                                                                                                                                                                                                                                                                                                                                                              |
| `theme.checkout.headerBg`   | String   | `#6d48cc`   | The checkout header base gradient color.                                                                                                                                                                                                                                                                                                                                                                                                         |
| `theme.checkout.headerText` | String   | `#fff`      | Sets the <code>color</code> for the checkout header text.                                                                                                                                                                                                                                                                                                                                                                                        |
| `getTracking`               | Function | `undefined` | This function is fired as soon as the overlay is loaded allowing you to pass through your custom tracking ID (max 250 characters long) that can be received after a successful purchase within the data in your `onPurchase` callback, a [webhook](https://selz.com/support/using-webhooks-selz), or in your dashboard's order detail page. The function gets passed a single argument, a jQuery object for the link that triggered the overlay. |  | `onDataReady` | Function | `undefined` | This callback is fired as soon as the item data has loaded allowing you to customise your link with data about the item. The function gets passed two arguments; a jQuery object for the current link that is being parsed and the data for that item link as below. |
| `onModalOpen`               | Function | `undefined` | Callback for when the overlay is shown. The function gets passed a single argument, a jQuery object for the link that triggered the overlay being opened.                                                                                                                                                                                                                                                                                        |
| `onPurchase`                | Function | `undefined` | Callback for when the item is purchased. The function gets passed a single argument, the data for the order as below.                                                                                                                                                                                                                                                                                                                            |
| `onProcessing`              | Function | `undefined` | Callback for when the item purchase is pending processing. The function gets passed a single argument, the data for the processing order.                                                                                                                                                                                                                                                                                                        |
| `onClose`                   | Function | `undefined` | Callback for when the overlay or window/tab is closed. The function gets passed two arguments; a jQuery object for the current link that triggered overlay and a JSON object containing data for the cart (items, buyers details and address etc) as below if the user had entered any data into the checkout and not completed. Otherwise the object will be empty.                                                                             |

#### Example data returned by onDataReady

Here's some example data returned by the `onDataReady` callback:

```json
{
    "CanPickup": true,
    "CanShip": true,
    "Description": "Example of an item description",
    "ImageUrlLarge":
        "https://selzimg.s3.amazonaws.com/items/xxxx/xxxx/large.jpg",
    "ImageUrlSmall":
        "https://selzimg.s3.amazonaws.com/items/xxxx/xxxx/small.jpg",
    "IsSoldOut": false,
    "Price": "A$9.99",
    "Quantity": 8,
    "QuantityLeft": 8,
    "RegularPrice": "$29.99",
    "SellerCountryCode": "US",
    "ShipInternationalPrice": "$20.00",
    "ShipPrice": "$10.00",
    "ShortUrl": "http://selz.co/xxxxxx",
    "Title": "Example Item",
    "Url": "https://selz.com/items/detail/xxxx",
    "CheckoutUrl": "https://selz.com/checkout/item/xxxx"
}
```

#### Example data returned by onPurchase

Here's some example data returned by the `onPurchase` callback:

```json
{
    "BuyerEmail": "johnny@selz.com",
    "BuyerFirstName": "Johnny",
    "BuyerLastName": "Appleseed",
    "Currency": "USD",
    "ReferenceId": "XXX",
    "Shipping": 20,
    "Timestamp": 1398921408,
    "TrackingId": "123",
    "TotalPrice": 29.99,
    "Items": [
        {
            "ItemId": "xxxx",
            "ItemTitle": "Example Item",
            "ItemVariantTitle": "Variant 1",
            "UnitPrice": 9.99,
            "DiscountCode": "",
            "Quantity": 1,
            "Currency": "USD"
        }
    ],
    "RedirectUrl": "http://example.com/thanks?selz_refid=XXX&selz_tracking=123"
}
```

#### Example data returned by onProcessing

Here's some example data returned by the `onProcessing` callback:

```javascript
{
	ReferenceId: "XXXXXXXX",
	Timestamp: 1398921408
}
```

#### Example data returned by onClose

Here's some example data returned by the `onClose` callback:

```json
{
    "id": "xxxx", // Unique checkout ID
    "expires": "1433122978", // Unix time that the cart will expire
    "modal_url": "https://...", // URL used for a modal
    "url": "https://...", // URL used for a page tab
    "buyer": {
        "firstname": "John",
        "lastname": "Appleseed",
        "email": "example@domain.com",
        "delivery": {
            "city": "San Francisco",
            "country": "US"
        },
        "billing": {
            "city": "San Francisco",
            "country": "US"
        }
    }
}
```

#### Example setup using options

```javascript
$(function() {
    $.selz({
        theme: {
            button: {
                bg: '#5fa9df',
                text: '#fff',
            },
            checkout: {
                headerBg: '#5fa9df',
                headerText: '#fff',
            },
        },
        getTracking: function($link) {
            return $link.data('tracking');
        },
        onDataReady: function($link, data) {
            // Customise the link with item data
            $link.html(
                `<img src="${data.ImageUrlSmall}" alt="${data.Title}">${
                    data.Title
                }`
            );

            // Skip to checkout
            // You can set the 'checkout' config option or set the URL yourself
            $link.data('modal-url', data.CheckoutUrl);
        },
        onModalOpen: function($link) {
            // Track open in Google Analytics
            ga('send', 'pageview', $link.attr('href'));
        },
        onPurchase: function(data) {
            // Track purchase
        },
        onProcessing: function(data) {
            // Track processing
        },
        onClose: function($link, data) {
            // Continue checkout flow
            if (data.modal_url) {
                $link.data('modal-url', data.modal_url);
            }
        },
    });
});
```

**Please note:** If you don't use the default `$` as your jQuery variable name then you will need to use `jQuery.` rather than `$.` when referencing the jQuery core library, incuding in callbacks. For the majority of users, this won't be an issue.

## CDN Hosting

You can use our CDN for the JavaScript and CSS files:

```html
<link href="https://jquery.selzstatic.com/1.0.15/jquery.selz.css" rel="stylesheet">
<script src="https://jquery.selzstatic.com/1.0.15/jquery.selz.js"></script>
```

## Licensed under the MIT

[License text](http://www.opensource.org/licenses/mit-license.php)

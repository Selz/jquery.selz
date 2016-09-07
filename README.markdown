# Selz jQuery Plugin

Open your [Selz.com](https://selz.com) item links in an overlay to let your customers complete their purchase directly on your site.

## Changelog

<table class="table" width="100%">
  <tr>
    <th width="15%">Version</th>
    <th width="85%">Comments</th>
  </tr>
  <tr>
    <td>1.0.14</td>
    <td>Improved support for iOS and Android devices</td>
  </tr>
  <tr>
    <td>1.0.13</td>
    <td>Added a new option to override your store auto-redirect checkout settings</td>
  </tr>
  <tr>
    <td>1.0.12</td>
    <td>Added a new option to skip the item overlay and go straight to the checkout</td>
  </tr>
  <tr>
    <td>1.0.11</td>
    <td>Bug fix for privacy mode and client side caching</td>
  </tr>
  <tr>
    <td>1.0.10</td>
    <td>Performance improvements, caching option, small bug fix for prefetching</td>
  </tr>
  <tr>
    <td>1.0.9</td>
    <td>Added support for bit.ly (fallback) and full selz.com URLs</td>
  </tr>
  <tr>
    <td>1.0.8</td>
    <td>Prefetching <em>always</em> (no longer an option), to fix a bug with mobile browsers</td>
  </tr>
  <tr>
    <td>1.0.7</td>
    <td>Bug fix for click event propagation</td>
  </tr>
  <tr>
    <td>1.0.6</td>
    <td>Added <code>onClose</code> callback, <code>getTracking</code> option, and extended theme color options</td>
  </tr>
  <tr>
    <td>1.0.5</td>
    <td>Minor bug fixes</td>
  </tr>
  <tr>
    <td>1.0.4</td>
    <td>Added to Bower packages: <code>bower install jquery-selz</code></td>
  </tr>
  <tr>
    <td>1.0.3</td>
    <td>Added <code>onProcessing</code> callback</td>
  </tr>
  <tr>
    <td>1.0.2</td>
    <td>Added <code>onPurchase</code> callback</td>
  </tr>
  <tr>
    <td>1.0.1</td>
    <td>Added <code>onDataReady</code> and <code>onModalOpen</code> callbacks and option to prefetch item data</td>
  </tr>
</table>


## Examples

See bundled `index.html` and `index.options.html` file for examples.

## Basic Setup

For a very simple installation where you only want the overlay functionality for any Selz item, the setup is very easy.

Include jQuery (if you haven't already) and `jquery.selz.min.js` files. These can go in the bottom of your html, just before the closing `</body>` tag

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
<script src="src/jquery.selz.min.js"></script>
```
Include `jquery.selz.min.css` or add your stylesheet into the `<head>` of your page

```html
<link href="src/jquery.selz.min.css" rel="stylesheet">
```

Add the short link to your [Selz.com](https://selz.com) products into the `<body>` of your page. This can be found on the share item page within Selz

```html
<a href="http://selz.co/1gfLTzi">Buy now</a>
```

## Installation

To install the Selz plugin, you will have to include the following resources in your page. The JS files should be loaded in the order below. For the CSS file, you can either incorporate it with your site's stylesheet, or load it externally through the `<link>` element in `<head>`.

<table class="table" width="100%">
  <tr>
    <th width="10%">Type</th>
    <th width="25%">File Name</th>
    <th width="65%">Description</th>
  </tr>
  <tr>
    <td>JS</td>
    <td><a href="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js" target="_blank">jQuery 1.x</a></td>
    <td><strong>External Dependency</strong>: The <em>latest verson</em> of jQuery 1.x library is needed for the Selz plugin functionality.</td>
  </tr>
  <tr>
    <td>JS</td>
    <td><code>jquery.selz.js</code></td>
    <td>Confers the main functionality of the Selz plugin. Alternatively, you can load the minified version, <code>jquery.selz.min.js</code></td>
  </tr>
  <tr>
    <td>CSS</td>
    <td><code>jquery.selz.min.css</code></td>
    <td>Offers styles that are crucial for the correct display of the Selz overlay. The appearance will break if this is not included. You can customise the styles in the source less file <code>jquery.selz.less</code> or write your own <strong>at your own risk</strong>.</td>
  </tr>
</table>


## Options

You can also fetch data about your product, customise overlay button colors and add event callbacks.

<table class="table" width="100%">
  <tr>
    <th width="20%">Option</th>
    <th width="15%">Type</th>
    <th width="15%">Default</th>
    <th width="50%">Description</th>
  </tr>
  <tr>
    <td><code>cache</code></td>
    <td>number</td>
    <td><code>300</code></td>
    <td>How long to cache the item data, using local storage (if supported). This will improve performance for end users when navigating your site. The default is <code>300</code> (5 minutes). To disable caching, set this to <code>false</code>.</td>
  </tr>
  <tr>
    <td><code>checkout</code></td>
    <td>boolean</td>
    <td><code>false</code></td>
    <td>Bypass the item detail page and go straight to the checkout with the item already in the cart. This speeds up the purchase process.</td>
  </tr>
  <tr>
    <td><code>redirect</code></td>
    <td>boolean</td>
    <td><code>false</code></td>
    <td>Disables redirect after successful purchase (if it's enabled in your store checkout settings).</td>
  </tr>
  <tr>
    <td><code>theme.button.bg</code></td>
    <td>String</td>
    <td><code>#6d48cc</code></td>
    <td>The button base gradient color for primary call to actions within the overlay. This needs to be hex color code. Defaults to the Selz purple.</td>
  </tr>
  <tr>
    <td><code>theme.button.text</code></td>
    <td>String</td>
    <td><code>#fff</code></td>
    <td>Sets the <code>color</code> for the button text. Defaults to white.</td>
  </tr>
  <tr>
    <td><code>theme.checkout.headerBg</code></td>
    <td>String</td>
    <td><code>#6d48cc</code></td>
    <td>The checkout header base gradient <code>color</code>. Defaults to the Selz purple.</td>
  </tr>
  <tr>
    <td><code>theme.checkout.headerText</code></td>
    <td>String</td>
    <td><code>#fff</code></td>
    <td>Sets the <code>color</code> for the checkout header text. Defaults to white.</td>
  </tr>
  <tr>
    <td><code>getTracking</code></td>
    <td>Function</td>
    <td><code>null</code></td>
    <td>This function is fired as soon as the overlay is loaded allowing you to pass through your custom tracking ID (max 250 characters long) that can be received after a successful purchase within the data in your <code>onPurchase</code> callback, a <a href="https://selz.com/support/using-webhooks-selz" target="_blank">webhook</a>, or in your dashboard's order detail page. The function gets passed a single argument, a jQuery object for the link that triggered the overlay.</td>
  </tr>
  <tr>
    <td><code>onDataReady</code></td>
    <td>Function</td>
    <td><code>null</code></td>
    <td>This callback is fired as soon as the item data has loaded allowing you to customise your link with data about the item. The function gets passed two arguments; a jQuery object for the current link that is being parsed and the data for that item link as below.</td>
  </tr>
  <tr>
    <td><code>onModalOpen</code></td>
    <td>Function</td>
    <td><code>null</code></td>
    <td>Callback for when the overlay is shown. The function gets passed a single argument, a jQuery object for the link that triggered the overlay being opened.</td>
  </tr>
  <tr>
    <td><code>onPurchase</code></td>
    <td>Function</td>
    <td><code>null</code></td>
    <td>Callback for when the item is purchased. The function gets passed a single argument, the data for the order as below.</td>
  </tr>
  <tr>
    <td><code>onProcessing</code></td>
    <td>Function</td>
    <td><code>null</code></td>
    <td>Callback for when the item purchase is pending processing. The function gets passed a single argument, the data for the processing order.</td>
  </tr>
  <tr>
    <td><code>onClose</code></td>
    <td>Function</td>
    <td><code>null</code></td>
    <td>Callback for when the overlay or window/tab is closed. The function gets passed two arguments; a jQuery object for the current link that triggered overlay and a JSON object containing data for the cart (items, buyers details and address etc) as below if the user had entered any data into the checkout and not completed. Otherwise the object will be empty.</td>
  </tr>
</table>

#### Example data returned by onDataReady

Here's some example data returned by the `onDataReady` callback:

```javascript
{
	CanPickup: true,
	CanShip: true,
	Description: "Example of an item description",
	DirectClicks: 200,
	DownloadFileName: null,
	DownloadFileSize: null,
	DownloadUrl: null,
	FacebookClicks: 100,
	ImageUrlLarge: "https://selzimg.s3.amazonaws.com/items/xxxx/xxxx/large.jpg",
	ImageUrlSmall: "https://selzimg.s3.amazonaws.com/items/xxxx/xxxx/small.jpg",
	IsSoldOut: false,
	PinterestClicks: 100,
	Price: "A$9.99",
	Quantity: 8,
	QuantityLeft: 8,
	RegularPrice: "$29.99",
	SellerCountryCode: "US",
	ShipInternationalPrice: "$20.00",
	ShipPrice: "$10.00",
	ShortUrl: "http://selz.co/xxxxxx",
	Title: "Example Item",
	TotalSales: 0,
	TotalViews: 0,
	TwitterClicks: 100,
	Url: "https://selz.com/items/detail/xxxx",
	CheckoutUrl: "https://selz.com/checkout/item/xxxx"
}
```

#### Example data returned by onPurchase

Here's some example data returned by the `onPurchase` callback:

```javascript
{
	BuyerEmail: "johnny@selz.com",
	BuyerFirstName: "Johnny",
	BuyerLastName: "Appleseed",
	Currency: "USD",
	ReferenceId: "XXXXXXXX",
	Shipping: 20,
	Timestamp: 1398921408,
	TrackingId: "123456",
	TotalPrice: 29.99,
	Items = [{
		ItemId: "xxxx",
		ItemTitle: "Example Item",
		ItemVariantTitle: "Variant 1",
		UnitPrice: 9.99,
		DiscountCode: "",
		Quantity: 1,
		Currency: "USD"
	}],
	RedirectUrl: "http://yourdomain.com/purchased?selz_refid=XXXXXXXX&selz_tracking=123456"
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

```javascript
{
  id: "xxxx",					// Unique checkout ID
  expires: "1433122978", 		// Unix time that the cart will expire
  modal_url: "https://...", 	// URL used for a modal
  url: "https://...", 		// URL used for a page tab
  buyer: {
    firstname: "John",
    lastname: "Appleseed",
    email: "example@domain.com",
    delivery: {
      city: "San Francisco",
      country: "US"
    },
    billing: {
      city: "San Francisco",
      country: "US"
    }
}
```

#### Example setup using options

```javascript
$(function() {
  $.selz({
      theme: {
        button: {
          bg:             "#5fa9df",
          text:           "#fff"
        },
        checkout: {
          headerBg:       "#5fa9df",
          headerText:     "#fff"
        }
      },
      getTracking: function($link) {
        return $link.data("tracking");
      },
      onDataReady: function ($link, data) {
        // Customise the link with item data
        $link.html('<img src="' + data.ImageUrlSmall + '" alt="' + data.Title + '">' + data.Title);

        // Skip to checkout
        // You can set the 'checkout' config option or set the URL yourself
        $link.data('modal-url', data.CheckoutUrl);
      },
      onModalOpen: function ($link) {
        // Track open in Google Analytics
        ga('send', 'pageview', $link.attr("href"));
      },
      onPurchase: function (data) {
        // Track purchase
      },
      onProcessing: function (data) {
        // Track processing
      },
      onClose: function ($link, data) {
        // Continue checkout flow
        if(typeof data.modal_url === "string"){
          $link.data("modal-url", data.modal_url);
        }
      }
    });
});
```

**Reminder:** If you don't use the default `$` as your jQuery variable name then you will need to use `jQuery.` rather than `$.` when referencing the jQuery core library, incuding in callbacks. For the majority of users, this won't be an issue.

## CDN Hosting

You can use our CDN for the JavaScript and CSS files:

```html
<link href="https://cdn.selz.com/jquery/1.0.14/jquery.selz.min.css" rel="stylesheet">
<script src="https://cdn.selz.com/jquery/1.0.14/jquery.selz.min.js"></script>
```

## Licensed under the MIT

[License text](http://www.opensource.org/licenses/mit-license.php)

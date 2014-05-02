# jQuery.selz

Open your [Selz.com](https://selz.com) item links in an overlay to let your customers complete their purchase directly onto your site. 

## Changelog

<table class="table">
  <tr>
    <th>Version</th>
    <th>Comments</th>
  </tr>
  <tr>
    <td>1.0.2</td> 
    <td>Added <code>onPurchase</code> callback.</td>
  </tr>
  <tr>
    <td>1.0.1</td> 
    <td>Added <code>onDataReady</code> and <code>onModalOpen</code> callbacks and option to prefect item data.</td>
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

<table class="table">
  <tr>
    <th>Type</th>
    <th>File Name</th>
    <th>Description</th>
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

<table class="table">
  <tr>
    <th>Option</th>
    <th>Type</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>buttonBg</code></td>
    <td>String</td>
    <td><code>#6d48cc</code></td>
    <td>Sets the <code>color</code> for the button text. Defaults to white.</td>
  </tr>
  <tr>
    <td><code>buttonText</code></td>
    <td>String</td>
    <td><code>#fff</code></td>
    <td>The button base gradient color for primary call to actions within the overlay. This needs to be hex color code. Defaults to the Selz purple.</td>
  </tr>
  <tr>
    <td><code>prefetch</code></td>
    <td>Boolean</td>
    <td><code>false</code></td>
    <td>Whether to prefecth data on plugin load so it is available to the <code>onDataReady</code> callback. Defaults to false.</td>
  </tr>
  <tr>
    <td><code>onDataReady</code></td>
    <td>Function</td>
    <td><code>null</code></td>
    <td>If <code>prefetch</code> is <code>true</code> then this callback is fired as soon as the plugin is loaded allowing you to customise your link with item data. Otherwise, the callback is fired when the overlay is opened (see below). The function gets passed two arguments; a jQuery object for the current link that is being parsed and the data for that item link.</td>
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
    <td>Callback for when the item is purchased. The function gets passed a single argument, the data for successful order.</td>
  </tr>
</table>

#### Example data returned by onDataReady

Here's some example data returned by the `onDataReady` callback:

```javascript
{
	CanPickup: true
	CanShip: true
	Description: "Example of an item description"
	DirectClicks: 200
	DownloadFileName: null
	DownloadFileSize: null
	DownloadUrl: null
	FacebookClicks: 100
	ImageUrlLarge: "https://selzimg.s3.amazonaws.com/items/xxxx/xxxx/large.jpg"
	ImageUrlSmall: "https://selzimg.s3.amazonaws.com/items/xxxx/xxxx/small.jpg"
	IsSoldOut: false
	PinterestClicks: 100
	Price: "A$9.99"
	Quantity: 8
	QuantityLeft: 8
	RegularPrice: "$29.99"
	SellerCountryCode: "US"
	ShipInternationalPrice: "$20.00"
	ShipPrice: "$10.00"
	ShortUrl: "http://selz.co/xxxxxx"
	Title: "Example Item"
	TotalSales: 0
	TotalViews: 0
	TwitterClicks: 100
	Url: "https://selz.com/items/detail/xxxx"
}
```

#### Example data returned by onPurchase 

Here's some example data returned by the `onPurchase` callback:

```javascript
{
	BuyerEmail: "johnny@selz.com"
	BuyerFirstName: "Johnny"
	BuyerLastName: "Appleseed"
	Currency: "USD"
	DiscountCode: ""
	ItemId: "xxxx"
	ItemTitle: "Example Item"
	ItemVariantTitle: "Variant 1"
	Quantity: 1
	ReferenceId: "xxxx"
	Shipping: 20
	Timestamp: 1398921408
	TotalPrice: 29.99
	UnitPrice: 9.99
}
```

#### Example setup using options

```javascript
$(function() {
	$.selz({
    	buttonBg: "#60aae0",
    	buttonText: "#fff",
   		prefetch: true,
    	onDataReady: function ($link, data) {
    		// Customise the link with item data
        	$link.html('<img src="' + data.ImageUrlSmall + '" alt="' + data.Title + '">' + data.Title);
    	},
    	onModalOpen: function ($link) {
    		// Track open in Google Analytics
			ga('send', 'pageview', $link.attr("href")); 
    	},
        onPurchase: function (data) {
            // Track purchase
        }
    });
});
```

**Reminder:** If you don't use the default `$` as your jQuery variable name then you will need to use `jQuery.` rather than `$.` when referencing the jQuery core library, incuding in callbacks. For the majority of users, this won't be an issue.

## CDN Hosting

You can use our CDN for the JavaScript and CSS files:

```html
<link href="http://cdn.selz.com/jquery/1.0.1/jquery.selz.min.css" rel="stylesheet">
<script src="http://cdn.selz.com/jquery/1.0.1/jquery.selz.min.js"></script>
```

## Licensed under the MIT

[License text](http://www.opensource.org/licenses/mit-license.php)

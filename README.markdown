# jQuery.selz

Open your [Selz.com](https://selz.com) item links in an overlay to let your customers complete their purchase directly onto your site. 

## Changelog
| Version | Comments |
|---------|----------|
| 1.0.0   | Added callbacks and option to prefect item data. |


## Examples

See bundled `index.html` and `index.options.html` file for examples.

## Basic Setup
For a very simple installation where you only want the overlay functionality for any Selz item, the setup is very easy. 

1. Include jQuery (if you haven't already) and `jquery.selz.min.js` files. These can go in the bottom of your html, just before the closing `</body>` tag

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
        <script src="src/jquery.selz.min.js"></script>

2. Include `jquery.selz.min.css` or add your stylesheet into the `<head>` of your page

        <link href="src/jquery.selz.min.css" rel="stylesheet">

3. Add the short link to your [Selz.com](https://selz.com) products into the `<body>` of your page. This can be found on the share item page within Selz

        <a href="http://selz.co/1gfLTzi">Buy now</a>
        
## Installation
To install the Selz plugin, you will have to include the following resources in your page. The JS files should be loaded in the order below. For the CSS file, you can either incorporate it with your site's stylesheet, or load it externally through the `<link>` element in `<head>`.

| Type | File Name            | Description                                                                                                            |
|------|----------------------|------------------------------------------------------------------------------------------------------------------------|
| JS   | [jQuery 1.x](http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js) | **External Dependency**: The *latest verson* of jQuery 1.x library is needed for the Selz plugin functionality. |
| JS   | `jquery.selz.js` 	| Confers the main functionality of the Selz plugin. Alternatively, you can load the minified version, `jquery.selz.min.js` |
| CSS  | `jquery.selz.min.css`   | Offers styles that are crucial for the correct display of the Selz overlay. The appearance will break if this is not included. You can customise the styles in the source less file `jquery.selz.less` or write your own **at your own risk**. |


## Options

You can also fetch data about your product, customise overlay button colors and add event callbacks. 

| Option           | Type      | Default value | Description                           |
|------------------|-----------|---------------|---------------------------------------|
| `buttonBg`   		| String 	| `#6d48cc`    | The button base gradient color for primary call to actions within the overlay. This needs to be hex color code. Defaults to the Selz purple.  |
| `buttonText`   	| String    | `#ff` 		| Sets the `color` for the button text. Defaults to white. |
| `prefetch` 		| Boolean   | `false`      | Whether to prefecth data on plugin load so it is available to the `onDataReady` callback. Defaults to false. |
| `onDataReady`   	| Function  | `null` 		| If `prefetch` is `true` then this callback is fired as soon as the plugin is loaded allowing you to customise your link with item data. Otherwise, the callback is fired when the overlay is opened (see below). The function gets passed two arguments; a jQuery object for the current link that is being parsed and the data for that item link. |
| `onModalOpen`  	| Function  | `null`       | Callback for when the overlay is shown. The function gets passed a single parameter, a jQuery object for the link that triggered the overlay being opened. |

#### Example using options

	jQuery.selz({
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
    	}
	});

### CDN Hosting
You can use our CDN for the JavaScript and CSS files:

- `<link href="http://selzstatic.s3.amazonaws.com/jquery/1.0.0/jquery.selz.min.css" rel="stylesheet">`
- `<script src="http://selzstatic.s3.amazonaws.com/jquery/1.0.0/jquery.selz.min.js"></script>`

Currently the CDN hosted version does not support SSL (https). 


### Licensed under the MIT

[License text](http://www.opensource.org/licenses/mit-license.php)

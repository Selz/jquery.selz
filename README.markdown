# jQuery.selz

Open [Selz.com](https://selz.com) product hyperlinks in overlay to let your customers complete their purchase directly onto your site.

### Examples

See bundled `index.html` and `index.options.html` file for examples.

### Usage

1. include jQuery (if you haven't already) and `jquery.selz.min.js` files.

        <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
        <script src="src/jquery.selz.min.js"></script>

2. include `jquery.selz.min.css` or add your stylesheet.

        <link href="src/jquery.selz.min.css" rel="stylesheet">

3. add hyperlinks to your [Selz.com](https://selz.com) products into `<body>`.

        <a href="http://selz.co/1gfLTzi">Buy now</a>

4. and if you like, add options to customize overlay.

        <script>
            jQuery.selz({
                buttonBg: "#ff0000",
                buttonText: "#fff",
                prefetch: true,
                onDataReady: function ($link, data) {
                    // triggered when item data are fetched
                    // you can customise your hyperlinks here if 'prefetch: true'
                    $link.html('<img src="' + data.ImageUrlSmall + '" alt="' + data.Title + '">' + data.Title);
                },
                onModalOpen: function ($link) {
                    // triggered on modal open
                    // add some event tracking here
                }
            });
        </script>

### CDN Hosting
You can use our CDN for the JavaScript and CSS files:

- `<link href="//selzimg.s3.amazonaws.com/plugins/jquery/jquery.selz.min.css" rel="stylesheet">`
- `<script src="//selzimg.s3.amazonaws.com/plugins/jquery/jquery.selz.min.js"></script>`

### Licensed under the MIT

[License text](http://www.opensource.org/licenses/mit-license.php)

# jQuery.selz

Open [Selz.com](https://selz.com) product hyperlinks in overlay to let your customers complete their purchase directly onto your site.

### Examples

See bundled `index.html` and `index.theme.html` file for examples.

### Usage

1. include jQuery and `jquery.selz.min.js` files.

        <script>window.jQuery || document.write('<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.11.0/jquery.min.js"<\/script>')</script>
        <script src="src/jquery.selz.min.js"></script>

2. include `jquery.selz.min.css` or add your stylesheet.

        <link href="src/jquery.selz.min.css" rel="stylesheet">

3. add your colors to customize overlay.

        <script>
            jQuery.selz({
                buttonBg: "#ff0000",
                buttonText: "#fff"
            });
        </script>

4. add hyperlinks to your [Selz.com](https://selz.com) products into `<body>`.

        <a href="http://selz.co/19HmDA4">Buy now</a>

### CDN Hosting
You can use our CDN for the JavaScript and CSS files:

- `<link href="//selzimg.s3.amazonaws.com/plugins/jquery/jquery.selz.min.css" rel="stylesheet">`
- `<script src="//selzimg.s3.amazonaws.com/plugins/jquery/jquery.selz.min.js"></script>`

### Licensed under the MIT

[License text](http://www.opensource.org/licenses/mit-license.php)

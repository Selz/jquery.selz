# jQuery.selz

## Open [Selz.com](https://selz.com) product hyperlinks in overlay to let your customers complete their purchase directly onto your site.

### Examples

See bundled `index.html` and `index.theme.html` file for examples.

### Usage

1. include jQuery and `jquery.selz.min.js` files.

        <script src="http://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js" type="text/javascript"></script>
        <script src="src/jquery.selz.min.js" type="text/javascript"></script>

2. include `jquery.selz.min.css` or add your stylesheet.

        <link href="src/jquery.selz.min.css" type="text/css" rel="stylesheet">

3. add your colors to customize overlay.

        <script type="text/javascript">
            $.selz({
                buttonBg: "#ff0000",
                buttonText: "#fff"
            });
        </script>

4. add hyperlinks to your [Selz.com](https://selz.com) products into `<body>`.

        <a href="http://selz.co/19HmDA4">Buy now</a>


### Licensed under the MIT

[License text](http://www.opensource.org/licenses/mit-license.php)

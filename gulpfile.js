// ==========================================================================
// Gulp build script
// ==========================================================================
/*global require, __dirname*/
/*jshint -W079 */

var fs 			= require("fs"),
	path        = require("path"),
	gulp 		= require("gulp"),
	gutil 		= require("gulp-util"),
	concat 		= require("gulp-concat"),
	uglify 		= require("gulp-uglify"),
	less 		= require("gulp-less"),
	minifyCss 	= require("gulp-minify-css"),
	rename 		= require("gulp-rename"),
	s3          = require("gulp-s3"),
	gzip        = require("gulp-gzip"),
	prefixer 	= require("gulp-autoprefixer"),
	replace     = require("gulp-replace"),
	size        = require("gulp-size"),
	run 		= require("run-sequence");

// Load json
function loadJSON(path) {
    return JSON.parse(fs.readFileSync(path));
}

// Set paths
var root = __dirname,
	paths = {
		scripts: 	["src/jquery.selz.js"],
		css: 		["src/jquery.selz.less"],
		build: 		"dist",
		docs: 		["README.markdown", "*.html"],
		cdn: {
			root: 	"cdn.selz.com/jquery",
			upload: path.join(root, "dist/**")
		}
	};

// Default development tasks
// ------------------------------------------
gulp.task("scripts", function() {
	return gulp.src(paths.scripts)
		.pipe(uglify())
		.pipe(concat("jquery.selz.min.js"))
		.pipe(gulp.dest(paths.build));
});

gulp.task("css", function() {
	return gulp.src(paths.css)
		.pipe(less()).on("error", gutil.log)
		.pipe(concat("jquery.selz.min.css"))
		.pipe(prefixer(["last 2 versions", "> 1%", "ie 9"], { cascade: true }))
		.pipe(minifyCss())
		.pipe(gulp.dest(paths.build));
});

gulp.task("watch", function() {
	gulp.watch(paths.scripts, ["scripts"]);
	gulp.watch(paths.css, ["css"]);
});

gulp.task("default", ["scripts", "css", "watch"]);

// Publish to production
// ------------------------------------------
// Fetch info from JSON
var package = loadJSON("package.json"),
	aws 	= loadJSON("aws.json"),
	version = package.version,
	maxAge  = 31536000, // seconds 1 year
	options = {
        headers: {
            "Cache-Control": "max-age=" + maxAge,
            "Vary": "Accept-Encoding"
        },
        gzippedOnly: true
	},
	cdnpath = new RegExp(paths.cdn.root + "\/(\\d+\\.)?(\\d+\\.)?(\\*|\\d+)","gi");

// Update version references
gulp.task("docs", function () {
    console.log("Updating version references to " + version);

    gulp.src(paths.docs)
        .pipe(replace(cdnpath, paths.cdn.root + "/" + version))
        .pipe(gulp.dest(root));
});

// Upload to S3
gulp.task("upload", function () {
    return gulp.src(paths.cdn.upload)
    	.pipe(size({
            showFiles: true,
            gzip: true
        }))
 		.pipe(rename(function (path) {
		    path.dirname += "/jquery/" + version;
		}))
		.pipe(gzip())
        .pipe(s3(aws, options));
});

gulp.task("publish", function() { 
	run("scripts", "css", "upload", "docs");
});
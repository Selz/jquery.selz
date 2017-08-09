// ==========================================================================
// Gulp build script
// ==========================================================================
/*global require, __dirname*/
/*jshint -W079 */

var fs = require("fs");
var path = require("path");
var gulp = require("gulp");
var gutil = require("gulp-util");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var less = require("gulp-less");
var cleanCss = require("gulp-clean-css");
var rename = require("gulp-rename");
var s3 = require("gulp-s3");
var gzip = require("gulp-gzip");
var prefixer = require("gulp-autoprefixer");
var replace = require("gulp-replace");
var size = require("gulp-size");
var run = require("run-sequence");

// Load json
function loadJSON(path) {
	return JSON.parse(fs.readFileSync(path));
}

// Set paths
var root = __dirname;
var paths = {
	scripts: ["src/jquery.selz.js"],
	css: ["src/jquery.selz.less"],
	build: "dist",
	docs: ["readme.md", "*.html"],
	cdn: {
		root: "jquery.selzstatic.com",
		upload: path.join(root, "dist/**")
	}
};

// Default development tasks
// ------------------------------------------
gulp.task("scripts", function () {
	return gulp.src(paths.scripts)
		.pipe(uglify())
		.pipe(concat("jquery.selz.js"))
		.pipe(gulp.dest(paths.build));
});

gulp.task("css", function () {
	return gulp.src(paths.css)
		.pipe(less()).on("error", gutil.log)
		.pipe(concat("jquery.selz.css"))
		.pipe(prefixer({
			cascade: false
		}))
		.pipe(cleanCss({
			keepSpecialComments: 0
		}))
		.pipe(gulp.dest(paths.build));
});

gulp.task("watch", function () {
	gulp.watch(paths.scripts, ["scripts"]);
	gulp.watch(paths.css, ["css"]);
});

gulp.task("default", ["scripts", "css", "watch"]);

// Publish to production
// ------------------------------------------
// Fetch info from JSON
var package = loadJSON("package.json");
var aws = loadJSON("aws.json");
var version = package.version;
var maxAge = 31536000; // seconds 1 year
var options = {
	headers: {
		"Cache-Control": "max-age=" + maxAge,
		"Vary": "Accept-Encoding"
	},
	gzippedOnly: true
};
var cdnpath = new RegExp(paths.cdn.root + "\/(\\d+\\.)?(\\d+\\.)?(\\*|\\d+)", "gi");

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

gulp.task("publish", function () {
	run("scripts", "css", "upload", "docs");
});
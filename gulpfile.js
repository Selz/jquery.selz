var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var changed = require('gulp-changed');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var rename = require("gulp-rename");
var awspublish = require('gulp-awspublish');

var paths = {
	scripts: ['src/jquery.selz.js'],
	css: ['src/jquery.selz.less'],
	build: 'src'
};

gulp.task('scripts', function() {
	return gulp.src(paths.scripts)
		//.pipe(changed(paths.build, { extension: '.js' }))
		.pipe(uglify())
		.pipe(concat('jquery.selz.min.js'))
		.pipe(gulp.dest(paths.build));
});

gulp.task('css', function() {
	return gulp.src(paths.css)
		//.pipe(changed(paths.build, { extension: '.less' }))
		.pipe(less()).on('error', gutil.log)
		.pipe(concat('jquery.selz.min.css'))
		.pipe(minifyCss())
		.pipe(gulp.dest(paths.build));
});

gulp.task('watch', function() {
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.css, ['css']);
});

gulp.task('default', ['scripts', 'css', 'watch']);


/* publish task */

var aws = {
	"key": "",
	"secret": "",
	"bucket": ""
};

try {
	aws = JSON.parse(fs.readFileSync('./aws.json'));
} catch (e) {
}

gulp.task('upload', function () {
    var publisher = awspublish.create(aws);
    var maxAge = 31536000; // seconds 1 year

    var headers = {
        "Cache-Control": "max-age=" + maxAge,
        "Expires": new Date(Date.now() + (maxAge * 1000)).toUTCString(),
        "Content-Encoding": "gzip"
    };

    return gulp.src('src/jquery.selz.min**')
		.pipe(rename(function (path) {
		    path.dirname += '/jquery/1.0.3';
		}))
		.pipe(awspublish.gzip())
		.pipe(publisher.publish(headers))
    //.pipe(publisher.cache())
		.pipe(awspublish.reporter());
});

gulp.task('publish', ['scripts', 'css', 'upload']);
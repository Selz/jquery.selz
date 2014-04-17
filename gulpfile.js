var gulp = require('gulp');

var gutil = require('gulp-util');
var changed = require('gulp-changed');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');

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
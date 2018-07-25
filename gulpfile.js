// ==========================================================================
// Gulp build script
// ==========================================================================
/* global require, __dirname */

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const gutil = require('gulp-util');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const less = require('gulp-less');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const s3 = require('gulp-s3');
const prefixer = require('gulp-autoprefixer');
const replace = require('gulp-replace');
const size = require('gulp-size');
const run = require('run-sequence');
const babel = require('gulp-babel');

const loadJSON = filePath => JSON.parse(fs.readFileSync(filePath));

// Set paths
const root = __dirname;
const paths = {
    js: ['src/jquery.selz.js'],
    css: ['src/jquery.selz.less'],
    build: 'dist',
    docs: ['readme.md', '*.html'],
    cdn: {
        root: 'jquery.selzstatic.com',
        upload: path.join(root, 'dist/**'),
    },
};

const pkg = loadJSON('./package.json');
const { version } = pkg;
const maxAge = 31536000; // seconds 1 year
const options = {
    headers: {
        'Cache-Control': `max-age=${maxAge}`,
        Vary: 'Accept-Encoding',
    },
};
const cdnpath = new RegExp(
    `${paths.cdn.root}/(\\d+\\.)?(\\d+\\.)?(\\*|\\d+)`,
    'gi'
);

// Try and get AWS credentials
let credentials = {};
try {
    credentials = loadJSON('./credentials.json');
} catch (e) {
    // Do nothing
}

// Default development tasks
// ------------------------------------------
const browsers = ['> 1%'];

gulp.task('js', () =>
    gulp
        .src(paths.js)
        .pipe(
            babel({
                presets: [
                    [
                        'env',
                        {
                            targets: {
                                browsers,
                            },
                            useBuiltIns: true,
                            modules: false,
                        },
                    ],
                ],
            })
        )
        .pipe(uglify())
        .pipe(concat('jquery.selz.js'))
        .pipe(gulp.dest(paths.build))
);

gulp.task('css', () =>
    gulp
        .src(paths.css)
        .pipe(less())
        .on('error', gutil.log)
        .pipe(concat('jquery.selz.css'))
        .pipe(
            prefixer({
                cascade: false,
            })
        )
        .pipe(
            cleanCss({
                keepSpecialComments: 0,
            })
        )
        .pipe(gulp.dest(paths.build))
);

gulp.task('watch', () => {
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.css, ['css']);
});

gulp.task('default', () => run('js', 'css', 'watch'));

// Publish to production
// ------------------------------------------
// Fetch info from JSON
if (Object.keys(credentials).length) {
    // Update version references
    gulp.task('docs', () => {
        gutil.log(`Updating version references to ${version}`);

        gulp.src(paths.docs)
            .pipe(replace(cdnpath, `${paths.cdn.root}/${version}`))
            .pipe(gulp.dest(root));
    });

    // Upload to S3
    gulp.task('upload', () =>
        gulp
            .src(paths.cdn.upload)
            .pipe(
                size({
                    showFiles: true,
                    gzip: true,
                })
            )
            .pipe(
                rename(filePath => {
                    filePath.dirname += `/jquery/${version}`;
                })
            )
            .pipe(s3(credentials, options))
    );

    gulp.task('deploy', () => run('js', 'css', 'upload', 'docs'));
}

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var csso = require('gulp-csso');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('default', ['sass', 'scripts'], function () {
    browserSync.init({
        server: "./"
    });

    gulp.watch("./src/scss/**/*.scss", ['sass']);
    gulp.watch("./src/js/**/*.js", ['scripts']);
    gulp.watch("./*.html").on('change', browserSync.reload);
});

gulp.task('scripts', function() {
    return gulp.src([
        './node_modules/jquery/dist/jquery.js',

        // Foundation core - needed if you want to use any of the components below
        './node_modules/foundation-sites/js/foundation.core.js',
        './node_modules/foundation-sites/js/foundation.util.*.js',

        // Pick the components you need in your project
        //'./node_modules/foundation-sites/js/foundation.orbit.js',

        './src/js/**/*.js'
    ])
        .pipe(babel({
            presets: ['es2015'],
            compact: true
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
    return gulp.src("./src/scss/*.scss")
        .pipe(sass()).on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(csso())
        .pipe(gulp.dest("./dist"))
        .pipe(browserSync.stream());
});

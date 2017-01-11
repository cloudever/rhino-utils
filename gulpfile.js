var gulp = require('gulp');

var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var del = require('del');

var runSequence = require('run-sequence');

gulp.task('default', function(cb) {
    return runSequence('clean', 'hint', 'build')
})

gulp.task('clean', function(cb) {
    return del(['dist'], cb)
})

gulp.task('hint', function(cb) {
    gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .on('finish', cb)
})

gulp.task('build', function() {
    gulp.src('src/**/*.js')
        .pipe(gulp.dest('dist'))
        .pipe(concat('build.js', { newLine: '\n\n' }))
        .pipe(gulp.dest('dist/build'))
})




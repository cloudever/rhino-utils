var gulp = require("gulp");

var concat = require("gulp-concat");
var strip = require('gulp-strip-comments');

gulp.task("default", function() {
    gulp.src("src/**/*.js")
        .pipe(gulp.dest("dist"))
        .pipe(concat("build.js"))
        .pipe(gulp.dest("dist"))
})

gulp.start("default");



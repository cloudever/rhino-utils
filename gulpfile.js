var gulp = require("gulp");

var concat = require("gulp-concat");
var clean = require("gulp-clean");

gulp.task("default", function() {
    gulp.src("src/**/*.js")
        .pipe(gulp.dest("dist"))
        .pipe(concat("build.js"))
        .pipe(gulp.dest("dist/build"))
})




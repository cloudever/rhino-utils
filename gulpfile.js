var gulp = require("gulp");

var ejs = require("gulp-ejs");
var concat = require("gulp-concat");
var strip = require('gulp-strip-comments');

var config = require("./config.json")

gulp.task("default", function() {
    gulp.src("src/**/*.js")
        .pipe(ejs(config))
        .pipe(gulp.dest("dist"))
        .pipe(concat("build.js"))
        .pipe(gulp.dest("dist"))
})

gulp.start("default");



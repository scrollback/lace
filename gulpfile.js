/* jshint node: true */

// Load plugins and declare variables
var gulp = require("gulp"),
	gutil = require("gulp-util"),
	jshint = require("gulp-jshint"),
	concat = require("gulp-concat"),
	streamify = require("gulp-streamify"),
	uglify = require("gulp-uglify"),
	rename = require("gulp-rename"),
	sass = require("gulp-ruby-sass"),
	prefix = require("gulp-autoprefixer"),
	minify = require("gulp-minify-css");

// Lint JavaScript files
gulp.task("lint", function() {
	return gulp.src("src/js/*.js")
	.pipe(jshint())
	.pipe(jshint.reporter("jshint-stylish"));
});

// Combine and minify scripts
gulp.task("scripts", function() {
	return gulp.src("src/js/*.js")
	.pipe(concat("lace.js"))
	.pipe(streamify(uglify()))
	.pipe(rename({ suffix: ".min" }))
	.pipe(gulp.dest("dist/scripts"))
	.on("error", gutil.log);
});

// Generate styles
gulp.task("styles", function() {
	return gulp.src("src/scss/*.scss")
	.pipe(sass({ sourcemapPath: "../scss" }))
	.on("error", function(e) { gutil.log(e.message); })
	.pipe(prefix())
	.pipe(minify())
	.pipe(gulp.dest("dist/styles"))
	.on("error", gutil.log);
});

gulp.task("watch", function() {
	gulp.watch("src/js/*.js", [ "scripts" ]);
	gulp.watch("src/scss/*.scss", [ "styles" ]);
});

// Default Task
gulp.task("default", [ "scripts", "styles" ]);

// Load plugins and declare variables
var gulp = require("gulp"),
	bower = require("bower"),
	browserify = require("browserify"),
	source = require("vinyl-source-stream"),
	es = require("event-stream"),
	gutil = require("gulp-util"),
	plumber = require("gulp-plumber"),
	concat = require("gulp-concat"),
	streamify = require("gulp-streamify"),
	uglify = require("gulp-uglify"),
	rename = require("gulp-rename"),
	sass = require("gulp-ruby-sass"),
	prefix = require("gulp-autoprefixer"),
	minify = require("gulp-minify-css"),
	jshint = require("gulp-jshint"),
	qunit = require("gulp-qunit");

// Make browserify bundle
function bundle(files, opts) {
	var streams = [],
		bundler = function(file) {
			opts.entries = "./" + file;

			return browserify(opts).bundle()
			.pipe(source(file.split(/[\\/]/).pop()))
			.on("error", gutil.log);
		};

	opts = opts || {};

	if (files && files instanceof Array) {
		for (var i = 0, l = files.length; i < l; i++) {
			if (typeof files[i] === "string") {
				streams.push(bundler(files[i]));
			}
		}
	} else if (typeof files === "string") {
		streams.push(bundler(files));
	}

	return es.merge.apply(null, streams);
}

// Install and copy third-party libraries
gulp.task("bower", function() {
	return bower.commands.install([], { save: true }, {})
	.on("error", gutil.log);
});

// Combine and minify scripts
gulp.task("scripts", [ "bower" ], function() {
	return bundle("test/test.js", { debug: !gutil.env.production })
	.pipe(plumber())
	.pipe(gutil.env.production ? streamify(uglify()) : gutil.noop())
	.pipe(rename("test.min.js"))
	.pipe(gulp.dest("dist/scripts"))
	.on("error", gutil.log);
});

// Generate styles
gulp.task("styles", function() {
	return gulp.src("test/test.scss")
	.pipe(plumber())
	.pipe(sass({ sourcemapPath: "../src/scss" }))
	.on("error", function(e) { gutil.log(e.message); })
	.pipe(prefix())
	.pipe(gutil.env.production ? minify() : gutil.noop())
	.pipe(gulp.dest("dist/styles"))
	.on("error", gutil.log);
});

// Lint JavaScript files
gulp.task("lint", function() {
	return gulp.src([ "src/js/**/*.js", "test/**/*.js" ])
	.pipe(plumber())
	.pipe(jshint())
	.pipe(jshint.reporter("jshint-stylish"))
	.on("error", gutil.log);
});

// Run unit tests with phantom.js
gulp.task("test", [ "scripts", "styles" ], function() {
	return gulp.src("test/index.html")
	.pipe(plumber())
	.pipe(qunit())
	.on("error", gutil.log);
});

gulp.task("watch", function() {
	gulp.watch([ "src/js/**/*.js", "test/**/*.js" ], [ "scripts" ]);
	gulp.watch([ "src/scss/**/*.scss", "test/**/*.scss" ], [ "styles" ]);
});

// Default Task
gulp.task("default", [ "lint", "test", "scripts", "styles" ]);

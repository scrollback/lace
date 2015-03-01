// Load plugins and declare variables
var gulp = require("gulp"),
    del = require("del"),
    bower = require("bower"),
    browserify = require("browserify"),
    source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    es = require("event-stream"),
    qunit = require("node-qunit-phantomjs"),
    styledown = require("gulp-styledown"),
    gutil = require("gulp-util"),
    sourcemaps = require("gulp-sourcemaps"),
    plumber = require("gulp-plumber"),
    notify = require("gulp-notify"),
    bump = require("gulp-bump"),
    git = require("gulp-git"),
    gitmodified = require("gulp-gitmodified"),
    jshint = require("gulp-jshint"),
    jscs = require("gulp-jscs"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    sass = require("gulp-sass"),
    combinemq = require("gulp-combine-mq"),
    autoprefixer = require("gulp-autoprefixer"),
    minify = require("gulp-minify-css"),
    onerror = notify.onError("Error: <%= error.message %>");

// Make browserify bundle
function bundle(files, opts) {
    var streams = [],
        bundler = function(file) {
            opts.entries = "./" + file;

            return browserify(opts).bundle()
            .on("error", function(error) {
                onerror(error);

                // End the stream to prevent gulp from crashing
                this.end();
            })
            .pipe(source(file.split(/[\\/]/).pop()));
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

    return es.merge.apply(null, streams).pipe(buffer());
}

// Install and copy third-party libraries
gulp.task("bower", function() {
    return bower.commands.install([], { save: true }, {})
    .on("error", onerror);
});

// Bump version and do a new release
gulp.task("bump", function() {
    return gulp.src([ "package.json", "bower.json" ])
    .pipe(plumber({ errorHandler: onerror }))
    .pipe(bump())
    .pipe(gulp.dest("."));
});

gulp.task("release", [ "bump" ], function() {
    var version = require("./package.json").version,
        message = "Release " + version;

    return gulp.src([ "package.json", "bower.json" ])
    .pipe(plumber({ errorHandler: onerror }))
    .pipe(git.add())
    .pipe(git.commit(message))
    .on("end", function() {
        git.tag("v" + version, message, function() {
            git.push("origin", "master", { args: "--tags" }, function() {});
        });
    });
});

// Lint JavaScript files
gulp.task("lint", function() {
    return gulp.src([ "src/js/**/*.js", "test/**/*.js" ])
    .pipe(plumber({ errorHandler: onerror }))
    .pipe(gitmodified("modified"))
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"))
    .pipe(jshint.reporter("fail"))
    .pipe(jscs());
});

// Combine and minify scripts
gulp.task("bundle", function() {
    return bundle("test/test.js", { debug: true })
    .pipe(plumber({ errorHandler: onerror }))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(gutil.env.production ? uglify() : gutil.noop())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/scripts"));
});

gulp.task("scripts", [ "bower", "bundle" ]);

// Generate styles
gulp.task("styles", function() {
    return gulp.src("test/**/*.scss")
    .pipe(plumber({ errorHandler: onerror }))
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: "expanded",
        lineNumbers: !gutil.env.production,
        sourceMap: true
    }))
    .pipe(combinemq())
    .pipe(gutil.env.production ? autoprefixer() : gutil.noop())
    .pipe(gutil.env.production ? minify() : gutil.noop())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/styles"));
});

// Generate living styleguide
gulp.task("styleguide", function() {
    return gulp.src("src/scss/**/*.scss")
    .pipe(styledown({
        config: "styledown.md",
        filename: "index.html"
    }))
    .pipe(gulp.dest("dist/styleguide"));
});

// Clean up generated files
gulp.task("clean", function() {
    return del([ "dist" ]);
});

// Build scripts and styles
gulp.task("build", [ "scripts", "styles" ]);

// Run unit tests with phantom.js
gulp.task("test", [ "build" ], function() {
    return qunit("./test/index.html", {
        verbose: true,
        timeout: 10
    });
});

gulp.task("watch", function() {
    gulp.watch([ "src/js/**/*.js", "test/**/*.js" ], [ "scripts" ]);
    gulp.watch([ "src/scss/**/*.scss", "test/**/*.scss" ], [ "styles" ]);
});

// Default Task
gulp.task("default", [ "lint", "clean" ], function() {
    gulp.start("build");
});

let  gulp          = require("gulp"),
     scss          = require("gulp-sass"),
     plumber       = require("gulp-plumber"),
     autoprefixer  = require('gulp-autoprefixer'),
     minify        = require("gulp-csso"),
     rename        = require("gulp-rename"),
     imagemin      = require('gulp-imagemin'),
     webp          = require("gulp-webp"),
     htmlmin       = require('gulp-htmlmin'),
     del           = require('del'),
     sync          = require('browser-sync').create();



gulp.task("style", function () {
    return gulp.src("app/scss/style.scss")
        .pipe(plumber())
        .pipe(scss())
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(gulp.dest("app/css"))
        .pipe(minify())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("app/css"))
        .pipe(sync.stream());
});


gulp.task("copy", function () {
   return gulp.src([
       "app/fonts/**/*.{woff,woff2}",
       "app/img/**",
       "app/js/**",
       "app/*html",
       "app/css/style.min.css"
   ], {
       base: "./app"
   })
       .pipe(gulp.dest("build"));
});

gulp.task("images", function () {
    return gulp.src("app/img/**/*.{png,jpg,svg}")
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.jpegtran({progressive: true}),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {
   return gulp.src("build/img/**/*.{png,jpg}")
       .pipe(webp({quality: 90}))
       .pipe(gulp.dest("build/img"));
});

gulp.task("html", function() {
    return gulp.src('app/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('build'));
});

gulp.task("del", function () {
   return del('build');
});

gulp.task('server', function () {
    sync.init({
        server: {
            baseDir: "app"
        },
        notify: false,
        browser: "chrome"
    });
    sync.watch('app', sync.reload)
});

gulp.task('watch', function () {
    gulp.watch("app/scss/*.scss", gulp.task('style'));
});



gulp.task('default', gulp.parallel('watch', 'server'));


gulp.task('build', gulp.series('del','copy','html','images','webp', function (done) {
    done();
}));




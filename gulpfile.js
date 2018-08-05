let gulp = require('gulp'),
    scss = require('gulp-sass'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify-es').default,
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    svgstore = require('gulp-svgstore'),
    svgmin = require('gulp-svgmin'),
    path = require('path')
;

gulp.task('sprite', ['clean-svg'], function () {
    return gulp
        .src('app/svg/*.svg')
        .pipe(svgmin(function (file) {
            let prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore())
        .pipe(rename({basename: "sprite"}))
        .pipe(gulp.dest('app/img'));


});

gulp.task('scss', function () {
    return gulp.src('app/scss/style.scss')
        .pipe(plumber())
        .pipe(scss())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(gulp.dest('app/css'))
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "app"
        },
        notify: false,
        browser: "chrome"
    });
});

gulp.task('scripts', function () {
    return gulp.src( 'app/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});


gulp.task('watch', ['browser-sync', 'scripts', 'scss'], function () {
    gulp.watch('app/scss/**/*.scss', ['scss']);
    gulp.watch('app/css/style.css', browserSync.reload);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('clean', function () {
    return del.sync('dist');
});

gulp.task('clean-svg', function () {
    return del.sync('app/img/sprite.svg');
});

gulp.task('img', function () {
    return gulp.src('app/img/**/*.+(png|jpg) ')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('compress', function () {
    gulp.src('app/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
});

gulp.task('build', ['clean', 'img', 'scss', 'scripts'], function () {

    let buildCss = gulp.src('app/css/style.min.css')
        .pipe(gulp.dest('dist/css'));

    let buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    let buildJs = gulp.src('app/js/**/*')
        .pipe(gulp.dest('dist/js'));

    let buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));

    let buildSvg = gulp.src('app/img/*.svg')
        .pipe(gulp.dest('dist/img'));

});

gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('default', ['watch']);
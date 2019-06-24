var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    uglify = require('gulp-uglify'),
    rigger = require('gulp-rigger'),
    cleanCSS = require('gulp-clean-css'),
    babel = require('gulp-babel'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    htmlbeautify = require('gulp-html-beautify'),
    spritesmith = require('gulp.spritesmith'),
    merge = require('merge-stream'),
    buffer = require('vinyl-buffer'),
    csso = require('gulp-csso'),
    del = require('del'),
    svgSprite = require('gulp-svg-sprite'),
    pug = require('gulp-pug');

gulp.task('html', function() {
    return gulp.src('./src/views/*.pug')
        .pipe(plumber({
            errorHandler: notify.onError()
        }))
        .pipe(pug({pretty:true}))
        .pipe(htmlbeautify())
        .pipe(gulp.dest('./build/'))
        .pipe(browserSync.stream())
        // .pipe(notify({
        //     title: 'HTML compiled',
        //     sound: false
        // }));

});

gulp.task('css', function() {
    return gulp.src('src/sass/style.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['> 0.1%'],
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        // .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream())
        // .pipe(notify({
        //     title: 'CSS compiled',
        //     sound: false
        // }));

});

gulp.task('js', function() {
    return gulp.src('src/js/main.js')
        .pipe(rigger())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        // .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build/js'))
        .pipe(browserSync.stream())
        // .pipe(notify({
        //     title: 'JS compiled',
        //     sound: false
        // }));

});

gulp.task('js-plugins', function() {
    return gulp.src('src/js/plugins/*')
        .pipe(gulp.dest('build/js/plugins'))
        .pipe(browserSync.stream())
});

gulp.task('img', function () {
    return gulp.src('src/images/img/**/*.{png,jpg,gif}') 
        .pipe(imagemin({ 
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true
        }))
        .pipe(gulp.dest('build/img')) 
        .pipe(reload({stream: true}));
});

gulp.task('svg', function () {
    return gulp.src('src/images/svg/*.svg') 
        .pipe(svgSprite({
                mode: {
                    stack: {
                        sprite: "../sprite.svg"  
                    }
                },
            }
        ))
        .pipe(gulp.dest('build/img'));
});

gulp.task('sprite', function () {
    var spriteData = gulp.src('src/img/sprites/**/*.png')
        .pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: '_sprite.scss'
        }));
   
    var imgStream = spriteData.img
      .pipe(buffer())
    //   .pipe(imagemin())
      .pipe(gulp.dest('build/img/'));
   
    var cssStream = spriteData.css
      .pipe(csso())
      .pipe(gulp.dest('src/sass/custom/'));
   
    return merge(imgStream, cssStream);
});

gulp.task('files', function() {
    return gulp.src('src/files/*')
        .pipe(gulp.dest('build/files'))
        .pipe(browserSync.stream())
});

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: './build/'
        }
    });

    gulp.watch('src/sass/**/*.scss', gulp.series('css'));
    gulp.watch('src/js/**/*.js', gulp.series('js'));
    gulp.watch('src/js/plugins/*.js', gulp.series('js-plugins'));
    gulp.watch('src/views/**/*.pug', gulp.series('html'));
    gulp.watch('src/images/img/*.{png,jpg,gif}', gulp.series('img'));
    gulp.watch('src/images/svg/*.svg', gulp.series('svg'));
    gulp.watch('src/files/*', gulp.series('files'));
    // gulp.watch('src/img/sprites/*', gulp.series('sprite'));
});

gulp.task('build', gulp.series(
    'html',
    'img',
    'svg',
    // 'sprite',
    'css',
    'js',
    'js-plugins',
    'files'
));

gulp.task('default', gulp.series('build', 'serve'));

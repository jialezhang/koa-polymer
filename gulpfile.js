// gulp publish 执行替换，但是templates会丢到 jx_static/templates
// gulp vpublish 执行替换，但是templates原地替换
var gulp = require('gulp');
var gutil = require('gulp-util');
var gcsslint = require('gulp-csslint');
var gulpif = require('gulp-if');
var shell = require('gulp-shell');
var webpack = require('webpack');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var inlineCss = require('gulp-inline-css');
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
// 生产时部署插件
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var revReplace = require('gulp-rev-replace');
var minifyHTML = require('gulp-minify-html');
// 顺序执行插件
var path = require('path');
var stylePath = path.resolve(__dirname, './static/css');

var distDir = './jianxun/jx_static/';
var staticDir = './jianxun/static/';
var replacePrefix = '';

var paths = {
  map: './maps',
  // 忽略临时生成的sass文件
  sourceSASS: [path.resolve(staticDir,'./source/**/**/**/*.scss'),'!.\#*.scss','!\#*.scss'],
  pageSASS: [path.resolve(staticDir,'./source/pages/*.scss'),'!.\#*.scss','!\#*.scss'],
  emailSASS: [path.resolve(staticDir,'./source/email/*.scss'),'!.\#*.scss','!\#*.scss'],
  outputSASS: path.resolve(staticDir,'./css/'),
  outputEmail: path.resolve(staticDir,'./css/email'),
  outputCSS: path.resolve(staticDir,'./css/**/*.css'),
  distCSS: path.resolve(distDir, './css'),
  sourceIMG: path.resolve(staticDir,'./img/**/*'),
  distIMG: path.resolve(distDir, './img'),
  outputJS: path.resolve(staticDir,'./js/dist/*.js'),
  distJS: path.resolve(distDir, './js'),
  dist: path.resolve(staticDir,'./dist'),
  manifest: path.resolve(distDir, './manifest/*.json'),
  imgManifest: path.resolve(distDir, './manifest/img-manifest.json'),
  upyun: 'https://jianxun.b0.upaiyun.com/c',
  coffee: [path.resolve(staticDir,'./source/coffee/**/*.coffee'),'!.#\.*.coffee'],
  js: path.resolve(staticDir,'./js/webpack/*.js'),
  jsPort:  'http://192.168.0.129:9000/static/js/dist',
  html: path.resolve(staticDir, '../templates/**/**/*.html'),
  inlineHTML: path.resolve(staticDir, '../templates/email/**/*.html'),
  destInlineHTML: path.resolve(staticDir, '../templates/static/email'),
  /* VHTML: path.resolve(staticDir, '../templates'), */
  distHTML: path.resolve(distDir, '../jx_templates')
};
/* console.log(process.env); */
gulp.task('sass', function () {
  return gulp.src(paths.pageSASS)
             .pipe(sourcemaps.init())
             .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
             .pipe(sass({errLogToConsole: true}))
    // .pipe(sass())
    /* .pipe(minifyCss()) */
             .pipe(sourcemaps.write(paths.map))
             .pipe(gulp.dest(paths.outputSASS));
});
var customReporter = function(file) {
    gutil.log(gutil.colors.cyan(file.csslint.errorCount)+' errors in '+gutil.colors.magenta(file.path));
    
    file.csslint.results.forEach(function(result) {
        gutil.log(result.error.message+' on line '+result.error.line);
    });
};

gulp.task('csslint', function() {
    return gulp.src(paths.outputCSS)
        .pipe(csslint())
        .pipe(csslint.reporter(customReporter));
})

gulp.task('email', function () {
  return gulp.src(paths.emailSASS)
             .pipe(sourcemaps.init())
             .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
             .pipe(sass({errLogToConsole: true}))
    // .pipe(sass())
    /* .pipe(minifyCss()) */
             .pipe(sourcemaps.write(paths.map))
             .pipe(gulp.dest(paths.outputEmail));
});

gulp.task( 'refresh', function(){
  return setTimeout(function(){
    /* livereload.changed(''); */
  }, 50);
});

gulp.task('watch', function() {
  gulp.watch( paths.sourceSASS, gulp.parallel('sass', 'refresh') );
});

gulp.task('watchEmail', function() {
  gulp.watch( paths.sourceSASS, gulp.parallel('email', 'refresh') );
});

gulp.task('watchHTML', function() {
  gulp.watch( paths.html, gulp.parallel(['publishCSS', 'publishJS'], 'testHTML') );
});
gulp.task('webpackTest', shell.task([
  'webpack --config=webpack.config.js'
]));

/* 生产部署 */
gulp.task( 'publishJS', function() {
  return gulp.src(paths.outputJS)
             .pipe(rev())
             .pipe(gulp.dest(paths.distJS))
             .pipe(rev.manifest(
               {
                 path: '../manifest/js-manifest.json'
               }
             ))
             .pipe(gulp.dest(paths.distJS))
});

/* 生产模式 */
gulp.task( 'publishIMG', function() {
  return gulp.src(paths.sourceIMG)
             .pipe(rev())
             .pipe(gulp.dest(paths.distIMG))
             .pipe(rev.manifest(
               {
                 path: '../manifest/img-manifest.json',
                 merge: true
               }
             ))
             .pipe(gulp.dest(paths.distIMG))
});

gulp.task( 'publishCSS', function() {
  return gulp.src([paths.imgManifest, paths.outputCSS])
             .pipe(revCollector({
               replaceReved: true,
               dirReplacements: {
                 '/static/img': paths.upyun + '/jx_static/img'
                 //  '/static/img': replacePrefix + '/jx_static/img'
               }
             }))
             .pipe(rev())
             .pipe(minifyCSS())

             .pipe(gulp.dest(paths.distCSS))
             .pipe(rev.manifest(
               {
                 path: '../manifest/css-manifest.json',
                 merge: true
               }
             ))
    // 如果把minifycss丢在这里话manifest就写不出来了
             .pipe(gulp.dest(paths.distCSS))
});

gulp.task( 'publishHTML', function() {
  return gulp.src([paths.manifest, paths.html])
             .pipe( revCollector({
               replaceReved: true,
               dirReplacements: {
                 '/static/css': paths.upyun + '/jx_static/css',
                 '/static/js/dist': paths.upyun + '/jx_static/js',
                 '/static/img': paths.upyun + '/jx_static/img'
               }
             }))
             .pipe(gulp.dest(paths.distHTML))
});

gulp.task( 'publishVHTML', function() {
  return gulp.src([paths.manifest, paths.html])
             .pipe( revCollector({
               replaceReved: true,
               dirReplacements: {
                 '/static/css': '/jx_static/css',
                 '/static/js/dist': '/jx_static/js',
                 '/static/img': '/jx_static/img'
               }
             }))
             .pipe(gulp.dest(paths.distHTML))
});

var  devReplace  = revCollector({
  replaceReved: true,
  dirReplacements: {
    '/static/css': '/jx_static/css',
    'http://192.168.0.129:9000/static/js/dist': '/jx_static/js',
    '/static/img': '/jx_static/img'
  }
});

var  prodReplace  = revCollector({
  replaceReved: true,
  dirReplacements: {
    '/static/css': paths.upyun + '/jx_static/css',
    'http://192.168.0.129:9000/static/js/dist': paths.upyun + '/jx_static/js',
    '/static/img': paths.upyun + '/jx_static/img'
  }
});

var  detectReplace  = function(options) {
  if(options.env === 'prod') replacePrefix = paths.upyun + '/' + options.type;
  // console.log(replacePrefix);
  return revCollector({
    replaceReved: true,
    dirReplacements: {
      '/static/css': replacePrefix + '/jx_static/css',
      'http://192.168.0.129:9000/static/js/dist':  replacePrefix + '/jx_static/js',
      '/static/img':  replacePrefix + '/jx_static/img'
    }
  });
};

gulp.task( 'publishIf', function() {
  return gulp.src([paths.manifest, paths.html])
             .pipe( gulpif(options.env === 'prod', prodReplace))
             .pipe( gulpif(options.env === 'dev', devReplace))
             .pipe(gulp.dest(paths.distHTML))
});

function detectEnv () {
  return through.obj(function() {
    if (options.env === 'prod') {
      replacePrefix = paths.upyun;
      if(options.type === 'c') {
        console.log('c端');
        replacePrefix = replacePrefix + '/c';
      } else if (options.type === 'b') {
        console.log('b端');
        replacePrefix = replacePrefix + '/b';
      }
    }
  });
}

gulp.task(detectEnv);
gulp.task( 'testHTML', function() {
  return gulp.src([paths.manifest, paths.html])
             .pipe( revCollector({
               replaceReved: true,
               dirReplacements: {
                 '/static/css': '/jx_static/css',
                 'http://192.168.0.129:9000/static/js/dist': '/jx_static/js',
                 '/static/img': '/jx_static/img'
               }
             }))
             .pipe(gulp.dest(paths.distHTML))
});

gulp.task('inlineCss', function() {
  return gulp.src(paths.inlineHTML)
             .pipe(inlineCss({
               applyStyleTags: true,
               applyLinkTags: true,
               removeStyleTags: true,
               removeLinkTags: true
             }))
             .pipe(gulp.dest(paths.destInlineHTML))
             /*.pipe(notify('转换完成'));*/
});
gulp.task('lint', gulp.parallel('csslint'));

gulp.task('dev', gulp.parallel('sass', 'watch') );

gulp.task('default', gulp.parallel('dev'));

gulp.task('email', gulp.parallel('email', 'watchEmail') );

gulp.task('inline', gulp.parallel('inlineCss') );

gulp.task('publish', gulp.series('publishIMG', ['publishCSS', 'publishJS'], 'publishHTML'));

gulp.task('publishV', gulp.series('publishIMG', ['publishCSS', 'publishJS'], 'publishVHTML'));

gulp.task('publishif', gulp.series('publishIMG', ['publishCSS', 'publishJS'], 'publishIf'));

gulp.task('testv', gulp.series('testHTML', 'watchHTML'));
gulp.task('test', gulp.series('testHTML'));

gulp.task('publishEnv', gulp.series('publishIMG', detectEnv, ['publishCSS', 'publishJS'], 'publishIf'));

// gulp publish 添加upyun的前缀

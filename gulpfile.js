var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var jshint = require('gulp-jshint');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var useref = require('gulp-useref');
var gulpif  = require('gulp-if');
var insert = require('gulp-insert');
var cssnano  = require('gulp-cssnano');

var paths = {
  sass: ['./scss/**/*.scss'],
  templateCache: ['./www/templates/**/*.html'],
  ng_annotate: ['./www/js/**/*.js'],
  useref: ['./www/*.html','./www/js/**/*.js'],
  fonts: ['./www/lib/ionic/fonts/*'],
  cssimg: ['./www/lib/pannellumVR/css/img/*']
};

gulp.task('default', ['sass','lint','templatecache', 'ng_annotate', 'useref','fonts','cssimg']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.fonts, ['fonts']);
  gulp.watch(paths.cssimg, ['cssimg'])
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});



  gulp.task('templatecache',['lint'], function (done) {
    gulp.src('./www/templates/**/*.html')
      .pipe(templateCache({standalone:true}))
      .pipe(insert.prepend('\'use strict\';\n'))
      .pipe(gulp.dest('./www/js'))
      .on('end', done);
  });
 
 gulp.task('ng_annotate',['templatecache'], function (done) {
    gulp.src('./www/js/**/*.js')
      .pipe(ngAnnotate({single_quotes: true}))
      .pipe(gulp.dest('./www/dist/dist_js/app'))
      .on('end', done);
  });
  
   gulp.task('useref',['ng_annotate'], function (done) {
     gulp.src('./www/*.html')
      .pipe(useref())
      .pipe(gulpif('*.css', cssnano()))
      .pipe(gulp.dest('./www/dist'))
      .on('end', done);
  });
  
  
  gulp.task('fonts', function() {
    return gulp.src([
                    './www/lib/ionic/fonts/*'])
            .pipe(gulp.dest('./www/dist/lib/ionic/fonts/'));
	});
	
	gulp.task('cssimg', function() {
    return gulp.src([
                    './www/lib/pannellumVR/css/img/*'])
            .pipe(gulp.dest('./www/dist/dist_css/img/'));
	});


gulp.task('lint', function() {
  return gulp.src(['./www/js/**/*.js','./www/lib/pannellumVR/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});
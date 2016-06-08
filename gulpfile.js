var gulp = require('gulp'),
  fs = require('fs'),
  clean = require('gulp-clean'),
  concat = require('gulp-concat'),
  minify = require('gulp-minify'),
  uglify = require('gulp-uglify'),
  nodemon = require('gulp-nodemon'),
  livereload = require('gulp-livereload');

var filePaths = {
  scripts: [
    'bower_components/angular/angular.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'public/scripts/**/*.js'
  ],
  styles: [
    'bower_components/bootstrap/dist/css/bootstrap.css',
    'public/styles/**/*.css'
  ]
};

//validate sources
var validateResources = function(resources) {
  resources.forEach(function(resource) {
    if (!resource.match(/\*/) && !fs.existsSync(resource)) {
      throw resource + " not found!";
    }
  });
}

//clean
gulp.task('clean', function(cb) {
  return gulp.src(['public/lib/css/app.css', 'public/lib/js/app.js'], {
      read: false
    })
    .pipe(clean());
});


//scripts files
gulp.task('scripts', function() {
  validateResources(filePaths.scripts);
  return gulp.src(filePaths.scripts)
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/lib/js'))
});

// run styles in the gulp
gulp.task('styles', function() {
  validateResources(filePaths.styles);
  return gulp.src(filePaths.styles)
    .pipe(concat('app.css'))
    .pipe(minify())
    .pipe(gulp.dest('public/lib/css'))
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(filePaths.scripts, ['scripts']);

  gulp.watch(filePaths.styles, ['styles']);

});

gulp.task('nodemon', function() {
  livereload.listen();
  nodemon({
    script: 'server.js',
    ext: 'js'
  });
});
// The default task (called when you run `gulp` from cli)
gulp.task('default', ['clean', 'scripts', 'styles', 'nodemon', 'watch'], function() {});

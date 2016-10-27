var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  livereload = require('gulp-livereload');

gulp.task('nodemon', function() {
  livereload.listen();
  nodemon({
    script: 'server.js',
    ext: 'js'
  });
});
// The default task (called when you run `gulp` from cli)
gulp.task('default', ['nodemon'], function() {});

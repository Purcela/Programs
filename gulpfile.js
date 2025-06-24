// npm install sass gulp-sass --save-dev

var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));

gulp.task('sass', function(cb) {
  gulp
    .src('scss/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe( gulp.dest('css') );
  cb();
});

gulp.task(
  'watch',
  gulp.series('sass', function(cb) {
    gulp.watch('scss/**/*.scss', gulp.series('sass'));
    cb();
  })
);
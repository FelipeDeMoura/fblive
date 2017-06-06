var gulp, sass, sassFiles, dirs;

gulp = require('gulp');
sass = require('gulp-sass');

dirs = {
  baseDir     : './app',
  sassDir     : './app/css',
  jsDir       : './app/js',
};

sassFiles = [
  './app/css/main.scss',
  './app/css/**/*.scss'
];

gulp.task('sass', function(){
    gulp.src(sassFiles)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(dirs.sassDir))
});

gulp.task('watch', function(){
  gulp.watch(sassFiles, ['sass']);
});

gulp.task('default', ['sass']);

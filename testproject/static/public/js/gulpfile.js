var gulp = require('gulp');
var concat = require('gulp-concat');

var src1 = 'src/Start/';
var arr1 = [src1+'start.part.js',
            src1+'cookiehelper.part.js',
            src1+'usermodel.part.js',
            src1+'controller.part.js',
            src1+'routes.part.js',
            src1+'end.part.js'];
gulp.task('default', function(){
    gulp.src(arr1)
	.pipe(concat('start.js'))
	.pipe(gulp.dest('project/'));
});

gulp.task('watch', function(){
    gulp.watch(arr1, ['default'])
});
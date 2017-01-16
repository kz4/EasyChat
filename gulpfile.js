var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var open = require('gulp-open');

// gulp.task('open', function () {
//     return gulp.src('public/index.html')
//         .pipe(open({uri: 'http://localhost:3000/#!/'}));
// });

gulp.task('server', function () {
    nodemon({
        script: 'server/server.js',
        watch: ["server/server.js"],
        ext: 'js'
    }).on('restart', function () {
        gulp.src('server/server.js')
            .pipe(notify('Running the start tasks and stuff'));
    });
});

gulp.task('default', ['server']);
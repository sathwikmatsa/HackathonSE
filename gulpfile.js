'use strict';

let gulp = require('gulp');
let browserSync = require('browser-sync');
let nodemon = require('gulp-nodemon');

gulp.task('browser-sync', function() {
	browserSync.init(null, {
		proxy: "http://localhost:5000",
        files: ["public/**/*.*"],
        port: 7000,
	});
});
gulp.task('nodemon', function (done) {

    const STARTUP_TIMEOUT = 5000;

    const server = nodemon({
        script: 'app.js',
        ext: 'js mustache css',
        watch: ['views', 'public', '*.*'],
        stdout: false // without this line the stdout event won't fire
    });

    let starting = false;
    let restarting = false;

    const onReady = () => {
        starting = false;
        done();
    };

    const onRestart = () => {
        restarting = false;
        browserSync.reload();
    }

    server.on('start', () => {
        starting = true;
        setTimeout(onReady, STARTUP_TIMEOUT);
    });

    server.on('restart', () => {
        restarting = true;
    });

    server.on('stdout', (stdout) => {
        process.stdout.write(stdout); // pass the stdout through
        if (starting) {
            onReady();
        }
        if (restarting){
            onRestart();
        }
    });

    return server;
});

gulp.task('default', gulp.series('nodemon', 'browser-sync'), function () {});

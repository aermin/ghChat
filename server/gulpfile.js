const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

// nodemon 修改服务端代码自动重启
gulp.task('start', () => {
  nodemon({
    script: 'index.js',
    ext: 'js html',
    env: { NODE_ENV: 'development' }
    // env: { NODE_ENV: 'production' }
  });
});

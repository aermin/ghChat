let gulp = require('gulp')
let nodemon = require('gulp-nodemon')

// nodemon 修改服务端代码自动重启
gulp.task('start', function () {
    nodemon({
      script: 'index.js'
    , ext: 'js html'
    , env: { 'NODE_ENV': 'development' }
    })
  })
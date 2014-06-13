module.exports = function(grunt) {
  // 项目配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      css: {
        files: "*.less",
        tasks: ['less']
      },
      js: {
        files: [
          'assets/js/*.js',
          'Gruntfile.js'
        ],
        tasks: ['jshint']
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['Gruntfile.js', '2048.js']
    },
    less: {
      options: {
        compress: true
      }
    }
  });
  // 加载Grunt插件
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  // 注册grunt默认任务
  grunt.registerTask('default', ['watch']);
};

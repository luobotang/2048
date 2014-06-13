module.exports = function(grunt) {
  // 项目配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      css: {
        files: ["less/*.less"],
        tasks: ['less']
      },
      js: {
        files: [
          'js/src/*.js',
          'Gruntfile.js'
        ],
        tasks: ['jshint']
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['Gruntfile.js', 'js/src/2048_game.js', 'js/src/2048_numbers.js']
    },
    less: {
      development: {
        options: {
          compress: true
        },
        files: {
          "css/2048.css": "less/2048.less"
        }
      }
    },
    concat: {
      dist: {
        src: ['js/src/2048_game.js', 'js/src/2048_numbers.js'],
        dest: 'js/dist/2048.js'
      }
    },
    uglify: {
      options: {
        compress: true,
        banner: "/* 2048 by luobotang\n   tangkangxing@sina.com\n*/\n"
      },
      compress: {
        files: {
          "js/dist/2048.min.js": "js/dist/2048.js"
        }
      }
    }
  });
  // 加载Grunt插件
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // 注册grunt默认任务
  grunt.registerTask('default', ['watch']);
};

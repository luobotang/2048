module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      css: {
        files: ["less/*.less"],
        tasks: ['less']
      },
      js: {
        files: ['lib/*.js'],
        tasks: ['browserify']
      }
    },
    less: {
      build: {
        src: 'less/2048.less',
        dest: '2048.css'
      }
    },
    browserify: {
      options: {
        alias: { jquery: './lib/jquery.js' }
      },
      build: {
        src: 'lib/app.js',
        dest: "2048.js"
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-less')
  grunt.loadNpmTasks('grunt-browserify')

  grunt.registerTask('default', ['less', 'browserify'])
}

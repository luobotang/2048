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
        tasks: ['uglify']
      }
    },
    less: {
      build: {
        src: 'less/2048.less',
        dest: '2048.css'
      }
    },
    uglify: {
      build: {
        src: ['lib/game.js', 'lib/numbers.js'],
        dest: "2048.min.js"
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-less')
  grunt.loadNpmTasks('grunt-contrib-uglify')

  grunt.registerTask('default', ['less', 'uglify'])
}

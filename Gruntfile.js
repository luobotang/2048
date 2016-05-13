module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      build: {
        files: ["src/*.*"],
        tasks: ['build']
      }
    },
    less: {
      build: {
        src: 'src/app.less',
        dest: 'app/app.css'
      }
    },
    browserify: {
      build: {
        src: 'src/app.js',
        dest: "app/app.js"
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-less')
  grunt.loadNpmTasks('grunt-browserify')

  grunt.registerTask('build', ['less', 'browserify'])
  grunt.registerTask('default', ['build'])
}

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.registerTask('build:server', ['copy:server']);
	grunt.registerTask('build:client', ['copy:html']);

	grunt.registerTask('build', ['clean:build', 'build:client', 'build:server']);
	grunt.registerTask('test', ['build', 'mochaTest']);

	grunt.registerTask('default', ['build', 'test']);

	grunt.initConfig({
		copy: {
			html: {
				files: [
					{expand: true, cwd: 'src/client', src: ['html/**'], dest: 'build/client/'}
				]
			},
			server: {
				files: [
					{expand: true, cwd: 'src/server', src: ['**'], dest: 'build/server/'}
				]
			}
		},
		mochaTest: {
			server: {
				options: {
					reporter: 'spec'
				},
				src: ['tests/server/**/*']
			}
		},
		watch: {
			server: {
				files: ['src/server/**'],
				tasks: ['build:server']
			},
			html: {
				files: ['src/client/html/**'],
				tasks: ['build:client']
			}
		},
		clean: {
			build: ['build/']
		}
	});
};

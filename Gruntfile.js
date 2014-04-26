module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.registerTask('build:server', ['copy:server']);
	grunt.registerTask('build:client', ['copy:html']);

	grunt.registerTask('build', ['clean:build', 'build:client', 'copy:bower', 'build:server']);
	grunt.registerTask('test', ['build', 'mochaTest:unitServer', 'mochaTest:integration']);
	grunt.registerTask('unitTest', ['build', 'mochaTest:unitServer']);
	grunt.registerTask('integrationTest', ['build', 'mochaTest:integration']);

	grunt.registerTask('default', ['build', 'unitTest']);

	grunt.initConfig({
		copy: {
			html: {
				files: [
					{expand: true, cwd: 'src/client', src: ['html/**'], dest: 'build/client/'}
				]
			},
			bower: {
				files: [
					{expand: true, cwd: 'bower_components', src: ['**'], dest: 'build/client/html/lib/'}
				]
			},
			server: {
				files: [
					{expand: true, cwd: 'src/server', src: ['**'], dest: 'build/server/'}
				]
			}
		},
		mochaTest: {
			unitServer: {
				options: {
					reporter: 'spec'
				},
				src: ['tests/unit/server/**/*']
			},
			integration: {
				options: {
					reporter: 'spec'
				},
				src: ['tests/integration/**/*']
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

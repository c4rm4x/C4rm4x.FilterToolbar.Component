module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-angular-templates');

	grunt.initConfig({

		jasmine: {
			pivotal: {
	            src: 'scripts/app/**/*.js',
	            options: {
	                specs: 'scripts/tests/**/*.js',
	                vendor: [
	                    'bower_components/angular/angular.js',
	                    'bower_components/angular-route/angular-route.js',
	                    'bower_components/angular-mocks/angular-mocks.js'
	                ]
	            }
	        }
        },

		watch: {
			scripts: {
				files: ['scripts/**/*.js'],
				tasks: ['jasmine']
			}
		},

		concat: {
			js: {
				src: 'scripts/app/**/*.js',
				dest: 'src/angular-filter-toolbar.js'
			}
		},

		uglify: {
			options: {
				compress: true,
				mangleProperties: false				
			},
			my_target: {
				files: {
					'src/angular-filter-toolbar.min.js': ['src/angular-filter-toolbar.js']
				}
			}			
		},

		copy: {
			main: {
				files: [
				{
					expand: true, 
					src: 'scripts/app/examples/*',
					dest: 'src/examples/',
					flatten: true
				}]
			}
		},

		ngtemplates: {
		    'md-filter-toolbar-templates': {
		      src: 'scripts/app/templates/*.html',
		      dest: 'scripts/app/filterToolbarTemplates.run.js',
		      options: {
		      	htmlmin:  { collapseWhitespace: true, collapseBooleanAttributes: true },
		      	url: function(url) { return url.replace('scripts/app/', ''); }
		      }
		    }
  		}
	});

	grunt.registerTask('default', ['watch']);
	grunt.registerTask('test', ['jasmine']);
	grunt.registerTask('templates', ['ngtemplates']);
	grunt.registerTask('min', ['ngtemplates', 'concat', 'uglify']);
	grunt.registerTask('deploy', ['ngtemplates', 'concat', 'uglify', 'copy']);
};
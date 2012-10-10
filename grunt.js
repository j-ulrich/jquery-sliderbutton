/*global module:false require:true*/
module.exports = function(grunt) {
	"use strict";
	
	var fs = require('fs');
	
	var jshintrcs = {
		tests: JSON.parse(fs.readFileSync('tests/.jshintrc'))
	};

	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',
		meta: {
			'ui_banner': '/*! <%= pkg.title || pkg.name %> - jQuery UI Version - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? " * " + pkg.homepage + "\n" : "" %>' +
				' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.contributors[0].name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n'+
				' */',
			'mobile_banner': '/*! <%= pkg.title || pkg.name %> - jQuery Mobile Version - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? " * " + pkg.homepage + "\n" : "" %>' +
				' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.contributors[0].name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n'+
				' */'
		},
		lint: {
			src: 'src/*.js',
			grunt: 'grunt.js',
			tests: ['tests/mobile-tests.js', 'tests/ui-tests.js']
		},
		qunit: {
			files: ['tests/mobile.html', 'tests/ui.html']
		},
		concat: {
			"ui-css": {
				src: 'src/jquery.ui.sliderbutton.css',
				dest: 'dist/jquery.ui.sliderbutton.<%= pkg.version %>.css'
			},
			"mobile-css": {
				src: 'src/jquery.mobile.sliderbutton.css',
				dest: 'dist/jquery.mobile.sliderbutton.<%= pkg.version %>.css'
			}
		},
		min: {
			"ui": {
				src: ['<banner:meta.ui_banner>', 'src/jquery.ui.sliderbutton.js'],
				dest: 'dist/jquery.ui.sliderbutton.<%= pkg.version %>.min.js'
			},
			"mobile": {
				src: ['<banner:meta.mobile_banner>', 'src/jquery.mobile.sliderbutton.js'],
				dest: 'dist/jquery.mobile.sliderbutton.<%= pkg.version %>.min.js'
			}

		},
		watch: {
			files: ['<config:lint.src>', '<config:lint.tests>'],
			tasks: 'lint qunit'
		},
		jshint: {
			options: {
				camelcase: true,
				plusplus: true,
				forin: true,
				noarg: true,
				noempty: true,
				eqeqeq: true,
				bitwise: true,
				strict: true,
				undef: true,
				unused: true,
				curly: true,
				browser: true,
				devel: true,
				white: false,
				onevar: false,
				smarttabs: true
			},
			globals: {
				jQuery: true,
				$: true
			},
			tests: {options: jshintrcs.tests, globals: jshintrcs.tests.globals}
//			tests: {jshintrc: 'tests/.jshintrc'}
		},
		uglify: {}
	});

	// Default task.
	grunt.registerTask('default', 'lint qunit concat min');

};

const StaticSiteGenerator = require('../..')
const {join} = require('path')

module.exports = StaticSiteGenerator({
	'content': {
		excludes: [/ignore(?:\/.*)?/],
		index: true,
		middlewares: ['menu'],
		middlewaresDirectories: [
			join(__dirname, 'middlewares'),
		],
	},
	'style': {
		sourcesDir: join(__dirname, 'style'),
		prefix: 'css',
	},
	'script:foo': {
		sourcesDir: join(__dirname, 'applets', 'foo'),
		name: 'foo',
		prefix: 'scripts',
	},
	'script:bar': {
		sourcesDir: join(__dirname, 'applets', 'bar'),
		name: 'bar',
		prefix: 'scripts',
	},
}, {
	'outputDirectory': process.env.SITE_OUTPUT_BASE_DIR || 'build',
	'serve': {
		livereload: true,
		fallback: join('404', 'index.html'),
	},
	'sourcemaps': process.env.SITE_ENV === 'development',
})

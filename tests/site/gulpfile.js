const StaticSiteGenerator = require('../..')
const {join} = require('path')

module.exports = StaticSiteGenerator({
	'content': {
		index: true,
		middlewares: ['menu'],
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
	'serve': {
		livereload: true,
		fallback: join('404', 'index.html'),
	},
})

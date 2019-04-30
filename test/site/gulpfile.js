const CreateGulpTasks = require('../../lib/gulp')
const {join} = require('path')

module.exports = CreateGulpTasks({
	'content': {
		index: true,
		middlewares: ['blender-menu'],
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
})

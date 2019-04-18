const Blender = require('./lib/blender')
const Loader = require('./lib/loader')
const Logger = require('./lib/log')
const {Transformer} = require('./lib/stream')

const {join} = require('path')
const {defaultTo} = require('ramda')

module.exports = function ({
	baseDir = process.cwd(),
	contentsBaseDir = null,
	index = false,
	indexBaseDir = null,
	layoutBaseDir = null,
	logLevel = Logger.warn,
	middlewares = [],
	middlewaresDirectories = [],
} = {}) {
	const state = {
		files: {},
		templates: {},
		middlewares,
		middlewaresDirectories: ['', join(__dirname, 'lib', 'middlewares'), ...middlewaresDirectories],
		contentsBaseDir: defaultTo(join(baseDir, 'contents'), contentsBaseDir),
		layoutBaseDir: defaultTo(join(baseDir, 'layout'), layoutBaseDir),
		log: Logger('Blender'),
		index,
	}
	return {
		use(middleware) {
			state.middlewares.push(middleware)
			return this
		},
		sources() {
			return [
				join(state.contentsBaseDir, '**', '*.md'),
				join(state.layoutBaseDir, '**', '*.pug'),
			]
		},
		stream() {
			const stream = Transformer({
				handle: Loader(state),
				finish: Blender(state),
			})
			stream.on('error', err => {
				state.log.error(err.toString())
				state.log.error(err)
			})
			return stream
		},
	}
}

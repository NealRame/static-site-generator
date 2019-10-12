const Blender = require('./content-generator')
const Loader = require('./loader')

const {Logger, stream: {Transformer}} = require('../utils')

const {defaultTo} = require('ramda')
const {join} = require('path')

module.exports = function ({
	baseDir = process.cwd(),
	contentsBaseDir = null,
	index = false,
	layoutBaseDir = null,
	log = null,
	middlewares = [],
	middlewaresDirectories = [],
	outputDir = 'build',
	prefix = '',
} = {}) {
	const state = {
		contentsBaseDir,
		layoutBaseDir,
		log: defaultTo(Logger({prefix: 'Blender'}), log),
		outputDir: join(outputDir, prefix),
		middlewares,
		middlewaresDirectories: [
			'',
			join(__dirname, 'middlewares'),
			...middlewaresDirectories,
		],
		index,
		files: {},
		partials: {},
		templates: {},
	}
	return Transformer({
		handle: Loader(state),
		finish: Blender(state),
	})
}

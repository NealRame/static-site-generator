const {Logger, stream: {Transformer}} = require('../../utils')

const Generator = require('./generator')
const Loader = require('./loader')

const del = require('del')
const gulp = require('gulp')

const {join} = require('path')
const {defaultTo} = require('ramda')

module.exports = function content({
	baseDir = process.cwd(),
	contentsBaseDir = null,
	excludes = [],
	index = false,
	layoutBaseDir = null,
	markdown = {},
	middlewares = [],
	middlewaresDirectories = [],
	outputDirectory = 'build',
	prefix = '',
} = {}) {
	const state = {
		excludes,
		markdown,
		middlewares,
		middlewaresDirectories: [
			'',
			...middlewaresDirectories,
		],
		contentsBaseDir: defaultTo(join(baseDir, 'contents'), contentsBaseDir),
		layoutBaseDir: defaultTo(join(baseDir, 'layout'), layoutBaseDir),
		outputDirectory: join(outputDirectory, prefix),
		log: Logger({prefix: 'Blender'}),
		index,
		copy: [],
		files: {},
		partials: {},
		templates: {},
	}
	const sources = [
		join(state.contentsBaseDir, '**', '*'),
		join(state.layoutBaseDir, '**', '*.pug'),
	]
	return {
		build(cb) {
			return gulp.src(sources)
				.pipe(Transformer({
					handle: Loader(state),
					finish: Generator(state),
				}))
				.on('error', cb)
				.pipe(gulp.dest(state.outputDirectory))
		},
		clean(cb) {
			return del(join(state.outputDirectory, '**/*.html'))
		},
		sources,
	}
}

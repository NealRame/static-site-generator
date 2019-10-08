const Blender = require('../content-generator')
const {Logger} = require('../utils')

const del = require('del')
const gulp = require('gulp')

const {join} = require('path')
const {defaultTo} = require('ramda')

module.exports = function content({
	baseDir = process.cwd(),
	contentsBaseDir = null,
	index = false,
	layoutBaseDir = null,
	middlewares = [],
	middlewaresDirectories = [],
	outputDir = 'build',
	prefix = '',
} = {}) {
	const state = {
		middlewares,
		middlewaresDirectories,
		contentsBaseDir: defaultTo(join(baseDir, 'contents'), contentsBaseDir),
		layoutBaseDir: defaultTo(join(baseDir, 'layout'), layoutBaseDir),
		log: Logger({prefix: 'Blender'}),
		index,
	}
	const sources = [
		join(state.contentsBaseDir, '**', '*.md'),
		join(state.layoutBaseDir, '**', '*.pug'),
	]
	return {
		build(cb) {
			return gulp.src(sources)
				.pipe(Blender(state))
				.on('error', cb)
				.pipe(gulp.dest(join(outputDir, prefix)))
		},
		clean(cb) {
			return del(join(outputDir, '**/*.html'))
		},
		sources,
	}
}

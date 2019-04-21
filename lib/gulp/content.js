const Blender = require('../blender')
const {Logger} = require('../utils')

const del = require('del')
const gulp = require('gulp')
const livereload = require('gulp-livereload')

const {join} = require('path')
const {defaultTo} = require('ramda')

module.exports = function content({
	baseDir = process.cwd(),
	contentsBaseDir = null,
	index = false,
	indexBaseDir = null,
	layoutBaseDir = null,
	middlewares = [],
	middlewaresDirectories = [],
	outputDir = 'build',
} = {}) {
	const state = {
		files: {},
		templates: {},
		middlewares,
		middlewaresDirectories: [
			'',
			join(__dirname, '..', 'blender', 'middlewares'),
			...middlewaresDirectories,
		],
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
				.pipe(gulp.dest(outputDir))
				.pipe(livereload())
		},
		clean(cb) {
			return del(join(outputDir, '**/*.html'))
		},
		watch: sources,
	}
}

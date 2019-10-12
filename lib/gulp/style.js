const del = require('del')
const gulp = require('gulp')
const sass = require('gulp-sass')

const {join} = require('path')

module.exports = function ({
	sourcesDir = process.cwd(),
	sourcemaps = true,
	outputDir = 'build',
	prefix = 'css',
} = {}) {
	const sources = join(sourcesDir, '**', '*.scss')
	const styleOutputDir = join(outputDir, prefix)
	return {
		build(cb) {
			return gulp.src(sources, {sourcemaps})
				.pipe(sass())
				.on('error', cb)
				.pipe(gulp.dest(styleOutputDir, {sourcemaps: '.'}))
		},
		clean(cb) {
			return del(styleOutputDir)
		},
		sources,
	}
}

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
	const sources = join('style', '**', '*.scss')
	return {
		build(cb) {
			return gulp.src(sources, {sourcemaps})
				.pipe(sass())
				.on('error', cb)
				.pipe(gulp.dest(join(outputDir, prefix), {sourcemaps: '.'}))
		},
		clean(cb) {
			return del(outputDir)
		},
		sources,
	}
}

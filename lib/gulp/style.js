const del = require('del')
const gulp = require('gulp')
const sass = require('gulp-sass')
const livereload = require('gulp-livereload')

const {join} = require('path')

module.exports = function ({
	sourcesDir = process.cwd(),
	outputDir = join('build', 'css'),
} = {}) {
	const sources = join('style', '**', '*.scss')
	return {
		build(cb) {
			return gulp.src(sources)
				.pipe(sass())
				.on('error', cb)
				.pipe(gulp.dest(outputDir))
				.pipe(livereload())
		},
		clean(cb) {
			return del(outputDir)
		},
		watch: [sources],
	}
}

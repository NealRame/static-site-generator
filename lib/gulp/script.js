const buffer = require('vinyl-buffer')
const source = require('vinyl-source-stream')

const del = require('del')
const gulp = require('gulp')

const rollup = require('rollup-stream')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')

const {isNil} = require('ramda')
const {join} = require('path')

module.exports = function applet({
	sourcesDir = process.cwd(),
	entry,
	name,
	outputDir = 'build',
	prefix = '',
	sourcemaps = true,
} = {}) {
	const appletOutputDir = join(outputDir, prefix)
	return {
		build() {
			return rollup({
				input: isNil(entry) ? join(sourcesDir, 'index.js') : entry,
				format: 'cjs',
				plugins: [
					resolve(),
					babel(),
				],
				sourcemap: sourcemaps,
			})
				.pipe(source(`${name}.js`))
				.pipe(buffer())
				.pipe(gulp.dest(appletOutputDir))
		},
		clean(cb) {
			return del(join(appletOutputDir, `${name}.js`))
		},
		sources: join(sourcesDir, '**', '*.js'),
	}
}

const del = require('del')

const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const {terser} = require('rollup-plugin-terser')

const {isNil} = require('ramda')
const {join} = require('path')

module.exports = function applet({
	sourcesDir = process.cwd(),
	entry,
	name,
	outputDirectory = 'build',
	prefix = '',
	sourcemaps = true,
} = {}) {
	const appletOutputDir = join(outputDirectory, prefix)
	return {
		async build() {
			const bundle = await rollup.rollup({
				input: isNil(entry) ? join(sourcesDir, 'index.js') : entry,
				plugins: [
					resolve(),
					babel(),
					terser(),
				],
			})
			return bundle.write({
				file: join(appletOutputDir, `${name}.js`),
				format: 'iife',
				name: name,
				sourcemap: sourcemaps,
			})
		},
		clean(cb) {
			return del(join(appletOutputDir, `${name}.js`))
		},
		sources: join(sourcesDir, '**', '*.js'),
	}
}

const del = require('del')

const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')

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
		build() {
			return rollup.rollup({
				input: isNil(entry) ? join(sourcesDir, 'index.js') : entry,
				plugins: [
					resolve(),
					babel(),
				],
			}).then(bundle => bundle.write({
				file: join(appletOutputDir, `${name}.js`),
				format: 'cjs',
				name: name,
				sourcemap: true,
			}))
		},
		clean(cb) {
			return del(join(appletOutputDir, `${name}.js`))
		},
		sources: join(sourcesDir, '**', '*.js'),
	}
}

const {join} = require('path')

module.exports = function State({
	middlewares = [],
	middlewaresDirectories = [join('..', '..', '..', '..', 'lib', 'middlewares')],
} = {}) {
	return {
		files: {},
		templates: {},
		middlewares,
		middlewaresDirectories,
		log: {
			debug() {
				return this
			},
			info() {
				return this
			},
			warn() {
				return this
			},
			error() {
				return this
			},
			get level() {
				return 'disabled'
			},
		},
	}
}

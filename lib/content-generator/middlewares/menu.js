const {compose, filter, map, prop, where} = require('ramda')
const {truthy} = require('../../utils/functional')

module.exports = function(config) {
	return (files, state) => {
		const menu = Object.assign({}, ...map(
			([slug, file]) => ({[file.data.title]: slug}),
			filter(compose(where({nav: truthy}), prop('data'), prop(1)), files)
		))

		for (const [, file] of files) {
			file.data.menu = menu
		}
	}
}

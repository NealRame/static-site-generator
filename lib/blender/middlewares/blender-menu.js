const {compose, filter, map, prop, where} = require('ramda')
const {truthy} = require('../utils')

module.exports = function() {
	return files => {
		const menu = Object.assign({}, ...map(
			([slug, file]) => ({[file.data.title]: slug}),
			filter(compose(where({menu: truthy}), prop('data'), prop(1)), files)
		))
		for (const [, file] of files) {
			file.data.menu = menu
		}
	}
}

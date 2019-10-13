const {compose, filter, map, pathOr, prop, sort, where} = require('ramda')
const {truthy} = require('../../utils/functional')

function entryPriority(file) {
	return pathOr(Infinity, [1, 'data', 'nav', 'priority'], file)
}

function compareFile(file1, file2) {
	return entryPriority(file1) - entryPriority(file2)
}

module.exports = function(config) {
	return (files, state) => {
		const filtered = filter(compose(
			where({nav: truthy}),
			prop('data'),
			prop(1),
		), files)
		const sorted = sort(compareFile, filtered)
		const menu = Object.assign({}, ...map(
			([slug, file]) => ({[file.data.title]: slug}),
			sorted,
		))

		for (const [, file] of files) {
			file.data.menu = menu
		}
	}
}

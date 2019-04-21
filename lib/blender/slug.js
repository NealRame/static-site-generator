const {join, normalize, parse} = require('path')
const {compose, replace, test} = require('ramda')

exports.pathToSlug = function pathToSlug(path) {
	const {dir, name} = parse(path)
	const isIndexHTML = test(/index$/i)
	return compose(normalize, replace(/\\/g, '/'))(join(
		'/', dir, isIndexHTML(name) ? '' : name
	))
}

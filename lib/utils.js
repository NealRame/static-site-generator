const {join, normalize, parse} = require('path')
const {compose, replace, test} = require('ramda')

function pathToSlug(path) {
	const {dir, name} = parse(path)
	const isIndexHTML = test(/index$/i)
	return compose(normalize, replace(/\\/g, '/'))(join(
		'/', dir, isIndexHTML(name) ? '' : name
	))
}

function truthy(value) {
	return !!value
}

module.exports = {
	pathToSlug,
	truthy,
}

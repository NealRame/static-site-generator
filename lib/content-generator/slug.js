const {normalize, parse} = require('path')
const {always, compose, cond, drop, identity, replace, startsWith, T, test} = require('ramda')

const slugName = cond([
	[test(/index$/i), always('')],
	[startsWith('_'), drop(1)],
	[T, identity],
])

const slugPath = function(path) {
	const {dir, name} = parse(path)
	return test(/index$/i, name)
		? `/${dir}`
		: `/${dir}/${slugName(name)}`
}

exports.pathToSlug = function pathToSlug(path) {
	return compose(normalize, replace(/\\/g, '/'), slugPath)(path)
}

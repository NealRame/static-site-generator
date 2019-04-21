const {cond, isNil, T} = require('ramda')

function createErrorFirstCallback(resolve, reject) {
	return cond([
		[isNil, dropFirstArg(resolve)],
		[T, reject],
	])
}

function dropFirstArg(fn) {
	return (head, ...tail) => fn(...tail)
}

function noop() {
}

function truthy(value) {
	return !!value
}

module.exports = {
	createErrorFirstCallback,
	dropFirstArg,
	noop,
	truthy,
}

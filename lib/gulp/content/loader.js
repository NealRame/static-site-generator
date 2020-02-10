const {anyPass, complement, cond, equals, is, test, T} = require('ramda')
const {parse} = require('path')

const ContentHandler = require('./content-handler')
const LayoutHandler = require('./layout-handler')

function _Acceptor(state) {
	const excludePredicates = state.excludes.map(pattern => {
		if (is(String, pattern)) {
			return equals(pattern)
		}
		if (is(RegExp, pattern)) {
			return test(pattern)
		}
		throw new TypeError('exclude patterns must be RegExp or String!')
	})
	const accept = complement(anyPass(excludePredicates))

	return file => accept(file.relative)
}

module.exports = function _Handler(state) {
	const accept = _Acceptor(state)
	const handle = cond([
		ContentHandler(state),
		LayoutHandler(state),
		[
			T,
			({file}) => {
				state.copy.push(file)
			},
		],
	])

	return (file, encoding) => {
		const {ext, name} = parse(file.path)
		if (accept(file)) {
			return handle({file, encoding, name, ext})
		}
	}
}

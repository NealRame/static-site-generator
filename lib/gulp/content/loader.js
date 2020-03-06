const {cond} = require('ramda')
const {parse} = require('path')
const {statSync} = require('fs')

const ContentHandler = require('./content-handler')
const LayoutHandler = require('./layout-handler')

module.exports = function _Handler(state) {
	const handle = cond([
		ContentHandler(state),
		LayoutHandler(state),
		[
			({file: {path}}) => statSync(path).isFile(),
			({file}) => {
				state.copy.push(file)
			},
		],
	])

	return (file, encoding) => {
		const {ext, name} = parse(file.path)
		return handle({file, encoding, name, ext})
	}
}

const {cond} = require('ramda')
const {parse} = require('path')

const ContentHandler = require('./content-handler')
const LayoutHandler = require('./layout-handler')

module.exports = function _Handler(state) {
	const handle = cond([ContentHandler(state), LayoutHandler(state)])
	return (file, encoding) => {
		const {ext, name} = parse(file.path)
		return handle({file, encoding, name, ext})
	}
}

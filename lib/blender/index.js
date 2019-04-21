const Blender = require('./blender')
const Loader = require('./loader')

const {Transformer} = require('../utils/stream')

module.exports = function (state) {
	return Transformer({
		handle: Loader(state),
		finish: Blender(state),
	})
}

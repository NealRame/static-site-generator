const {callbackify} = require('./async')
const {noop} = require('./functional')

const {Transform} = require('stream')

exports.Transformer = function Transformer({handle, finish = noop}) {
	const transform = callbackify(handle)
	const flush = callbackify(function() {
		return finish.call(this, this)
	})
	return new Transform({
		objectMode: true,
		transform,
		flush,
	})
}

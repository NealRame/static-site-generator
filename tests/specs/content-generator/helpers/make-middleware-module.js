const fs = require('fs')
const {always} = require('ramda')
const {randomBytes} = require('crypto')
const {join} = require('path')
const {tmpdir} = require('os')

const {promisify} = require('../../../../lib/utils/async')

const middleware = `module.exports = () => files => Promise.resolve()`
const mkdtemp = promisify(fs.mkdtemp)
const write = promisify(fs.writeFile)

function writeModule(name, pretend) {
	return pretend
		? dir => Promise.resolve({dir, name})
		: dir => {
			const filename = join(dir, name + '.js')
			return write(filename, middleware).then(always({dir, name}))
		}
}

module.exports = function makeMiddlewareModule({pretend = false} = {}) {
	return mkdtemp(tmpdir()).then(writeModule(randomBytes(8).toString('hex'), pretend))
}

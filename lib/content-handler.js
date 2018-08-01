const parseMatter = require('gray-matter')
const Remarkable = require('remarkable')
const {test: match, where} = require('ramda')
const {pathToSlug} = require('./utils')

function _ContentHandler(state) {
	const md = new Remarkable()
	return ({file, ext, encoding}) => {
		const {data, content: markdown} = parseMatter(file.contents)
		const contents = Buffer.from(md.render(markdown))
		const slug = pathToSlug(file.relative)
		state.log.info(`Add content ${file.path}`)
		state.files[slug] = Object.assign(file, {contents, data})
	}
}

module.exports = function(state) {
	return [
		where({ext: match(/\.md$/i)}),
		_ContentHandler(state),
	]
}

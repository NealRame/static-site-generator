const parseMatter = require('gray-matter')
const marked = require('marked')

const {test: match, where} = require('ramda')
const {pathToSlug} = require('./slug')

function _ContentHandler(state) {
	marked.setOptions(state.markdown)
	return ({file, ext, encoding}) => {
		const {data, content: markdown} = parseMatter(file.contents)
		const contents = Buffer.from(marked(markdown))
		const slug = pathToSlug(file.relative)

		if (file.stem.startsWith('_')) {
			state.log.info(`Add partial slug=${slug} file=${file.path}`)
			state.partials[slug] = contents
		} else {
			state.log.info(`Add content slug=${slug} file=${file.path}`)
			state.files[slug] = Object.assign(file, {contents, data, markdown})
		}
	}
}

module.exports = function(state) {
	return [
		where({ext: match(/\.md$/i)}),
		_ContentHandler(state),
	]
}

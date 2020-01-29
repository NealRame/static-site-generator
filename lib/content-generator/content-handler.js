const parseMatter = require('gray-matter')
const marked = require('marked')

const {always, defaultTo, has, ifElse, test: match, where, whereEq} = require('ramda')

const {pathToSlug} = require('./slug')

function MarkdownRenderer(options) {
	const getField = ifElse(
		whereEq({type: 'heading'}),
		({depth}) => `h${depth}`,
		always('text')
	)
	const reducer = (doc, token) => {
		const field = getField(token)
		return Object.assign(doc, {
			[field]: [defaultTo(doc[field], ''), token.text].join(' '),
		})
	}
	marked.setOptions(options)
	return md => {
		const lexer = new marked.Lexer(options)
		const tokens = lexer.lex(md)
		const doc = tokens.filter(has('text')).reduce(reducer, {})
		return {
			doc,
			contents: Buffer.from(marked.parser(tokens)),
		}
	}
}

function _ContentHandler(state) {
	return ({file, ext, encoding}) => {
		const render = MarkdownRenderer(state.markdown)
		const {data, content: markdown} = parseMatter(file.contents)
		const {doc, contents} = render(markdown)
		const slug = pathToSlug(file.relative)

		if (file.stem.startsWith('_')) {
			state.log.info(`Add partial slug=${slug} file=${file.path}`)
			state.partials[slug] = contents
		} else {
			state.log.info(`Add content slug=${slug} file=${file.path}`)
			state.files[slug] = Object.assign(file, {contents, doc, data})
		}
	}
}

module.exports = function(state) {
	return [
		where({ext: match(/\.md$/i)}),
		_ContentHandler(state),
	]
}

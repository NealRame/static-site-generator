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
		const render = MarkdownRenderer()
		const {data, content: markdown} = parseMatter(file.contents)
		const {doc, contents} = render(markdown)
		const slug = pathToSlug(file.relative)
		state.log.info(`Add content ${file.path}`)
		state.files[slug] = Object.assign(file, {contents, doc, data})
	}
}

module.exports = function(state) {
	return [
		where({ext: match(/\.md$/i)}),
		_ContentHandler(state),
	]
}
const {dirname, join, parse} = require('path')
const {always, isNil, map} = require('ramda')

const pug = require('pug')
const Vinyl = require('vinyl')

const {waterfall: asyncWaterfall, each: asyncEach} = require('./async')
const {MiddlewareFactory} = require('./middleware')

const defaultTemplate = pug.compile(`doctype html
html(lang='en' dir='ltr')
	head
		meta(charset='utf-8')
		title= title
	body
		!= matter
`)

function _findTemplate(state, slug) {
	const entry = state.templates[slug]
	if (!isNil(entry)) {
		return entry
	} else if (slug !== '/') {
		return _findTemplate(state, dirname(slug))
	} else {
		return {
			filename: 'defaultTemplate',
			template: defaultTemplate,
		}
	}
}

function _middlewares(state) {
	return files => asyncWaterfall([
		always(files),
		...map(MiddlewareFactory(state), state.middlewares),
	])
}

function _blend(state, slug, file) {
	const {source, template} = _findTemplate(state, slug)
	const {name, dir} = parse(file.path)
	const outputPath = join(...(name === 'index'
		? [`${name}.html`]
		: [name, 'index.html']
	))

	state.log.info(`Blend ${file.relative} with ${source} to ${outputPath}`)

	return {
		path: join(dir, outputPath),
		contents: Buffer.from(template({
			...file.data,
			matter: file.contents,
		})),
	}
}

function _htmlize(state, stream) {
	return asyncEach(([slug, file]) => {
		const {contents, path} = _blend(state, slug, file)
		stream.push(new Vinyl({
			cwd: file.cwd,
			base: file.base,
			path,
			contents,
		}))
	})
}

module.exports = function _Blender(state) {
	return stream => {
		return asyncWaterfall([
			always(Object.entries(state.files)),
			_middlewares(state),
			_htmlize(state, stream),
		])
	}
}

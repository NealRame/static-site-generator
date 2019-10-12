const {dirname, join, parse} = require('path')
const {always, identity, isNil, map, times} = require('ramda')

const lunr = require('lunr')
const pug = require('pug')
const Vinyl = require('vinyl')

const {MiddlewareFactory} = require('./middleware')
const {async} = require('../utils')

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
	return files => async.waterfall([
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
			partials: state.partials,
			matter: file.contents,
		})),
	}
}

function _htmlize(state) {
	return async.map(([slug, file]) => {
		const {contents, path} = _blend(state, slug, file)
		return [slug, new Vinyl({
			cwd: file.cwd,
			base: file.base,
			path,
			contents,
			doc: file.doc,
		})]
	})
}

function _index(state) {
	if (state.index) {
		return files => {
			const index = lunr(function() {
				this.ref('slug')
				this.field('text')

				times(headingLevel => {
					this.field(`h${headingLevel + 1}`, {
						boost: 8 - headingLevel,
					})
				}, 6)

				files.forEach(([slug, file]) => {
					state.log.info(`Indexing ${slug}`)
					this.add(Object.assign({slug}, file.doc))
				})
			})

			files.push(['', new Vinyl({
				cwd: process.cwd(),
				base: process.cwd(),
				path: join(process.cwd(), 'lunr.json'),
				contents: Buffer.from(JSON.stringify(index.toJSON()), 'utf8'),
			})])

			return files
		}
	}
	return identity
}

module.exports = function _Blender(state) {
	return stream => async.waterfall([
		always(Object.entries(state.files)),
		_middlewares(state),
		_htmlize(state),
		_index(state),
		async.each(([, file]) => stream.push(file)),
	])
}

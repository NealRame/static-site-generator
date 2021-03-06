const {dirname, join, parse, relative} = require('path')
const {always, defaultTo, isNil, map, pick, startsWith} = require('ramda')

const pug = require('pug')
const Vinyl = require('vinyl')

const {MiddlewareFactory} = require('./middleware')
const {async} = require('../../utils')

const defaultTemplate = pug.compile(`doctype html
html(lang='en' dir='ltr')
	head
		meta(charset='utf-8')
		title= title
	body
		!= matter
`)

function _middlewares(state) {
	const middlewares = map(MiddlewareFactory(state), state.middlewares)
	return ({files, partials, templates}) => {
		return async.waterfall([
			always({files, partials, templates}),
			...middlewares,
		])
	}
}

function _templateResolver(state, templates) {
	return slug => {
		do {
			const entry = templates[slug]
			if (!isNil(entry)) {
				state.log.info(`Template for ${slug} is ${entry.source}`)
				return entry.template
			}
			slug = slug === '/' ? '' : dirname(slug)
		} while (slug !== '')

		state.log.info(`No template found for ${slug}`)
		return defaultTemplate
	}
}

function _partialsResolver(state, partials) {
	return slug => pick(
		Object.keys(partials).filter(startsWith(slug)),
		partials,
	)
}

function _makeOutputPath(file) {
	const {name, dir} = parse(file.path)
	return join(
		dir,
		...(name === 'index' ? [`${name}.html`] : [name, 'index.html']),
	)
}

function _fileRenderer(state, partials, templates) {
	const resolvePartials = _partialsResolver(state, partials)
	const resolveTemplate = _templateResolver(state, templates)

	return ([slug, file]) => {
		const outputPath = _makeOutputPath(file)
		const template = resolveTemplate(defaultTo(slug, file.data.layout))
		const partials = resolvePartials(slug)

		state.log.info(`Render ${slug} to ${relative(state.contentsBaseDir, outputPath)}`)

		const contents = Buffer.from(template({
			...file.data,
			matter: file.contents,
			partials,
			slug,
		}))

		return [slug, new Vinyl({
			base: file.base,
			cwd: file.cwd,
			contents,
			doc: file.doc,
			path: outputPath,
		})]
	}
}

function _htmlize(state) {
	return ({files, partials, templates}) => {
		return async.map(
			_fileRenderer(state, partials, templates),
			Object.entries(files),
		)
	}
}

module.exports = function _Generator(state) {
	const {files, partials, templates, copy} = state
	return stream => {
		for (const file of copy) {
			stream.push(file)
		}
		return async.waterfall([
			always({files, partials, templates}),
			_middlewares(state),
			_htmlize(state),
			async.each(([, file]) => stream.push(file)),
		])
	}
}

const pug = require('pug')
const {test: match, where} = require('ramda')
const {relative} = require('path')

const {pathToSlug} = require('./slug')

const Logger = require('../../utils/logger')

function _LayoutHandler(state) {
	return ({file, ext, name, encoding}) => {
		const contents = file.contents.toString(encoding)
		const slug = pathToSlug(file.relative)
		if (!name.startsWith('_')) {
			const basedir = state.layoutBaseDir

			state.log.info(`Add layout ${file.path}`)
			state.templates[slug] = {
				source: relative(state.layoutBaseDir, file.path),
				template: pug.compile(contents, {
					basedir,
					debug: state.log.level === Logger.debug,
					filename: file.path,
				}),
			}
		}
	}
}

module.exports = function(state) {
	return [
		where({ext: match(/\.pug$/i)}),
		_LayoutHandler(state),
	]
}

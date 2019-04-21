const Content = require('../../lib/gulp/content')
const Style = require('../../lib/gulp/style')
const Serve = require('../../lib/gulp/serve')

const { parallel, series, watch } = require('gulp')
const { join } = require('path')

// Serve tasks

const serveTask = Serve(join(__dirname, 'build'))

function serve() {
	return serveTask()
}

// Content tasks

const contentTasks = Content({
	index: true,
	middlewares: ['blender-menu'],
})

function contentBuild(cb) {
	return contentTasks.build(cb)
}
contentBuild.displayName = 'content:build'

function contentClean(cb) {
	return contentTasks.clean(cb)
}
contentClean.displayName = 'content:clean'

const content = series(contentClean, contentBuild)

function contentWatch() {
	watch(contentTasks.watch, content)
}
contentWatch.displayName = 'content:watch'

// Style tasks

const styleTasks = Style({
	sourcesDir: join(__dirname, 'style'),
})

function styleBuild(cb) {
	return styleTasks.build(cb)
}
styleBuild.displayName = 'style:build'

function styleClean(cb) {
	return styleTasks.clean(cb)
}
styleClean.displayName = 'style:clean'

const style = series(styleClean, styleBuild)

function styleWatch() {
	watch(styleTasks.watch, style)
}
styleWatch.displayName = 'style:watch'

// Export tasks

exports.content = content
exports.style = style
exports.clean = parallel(contentClean, styleClean)
exports.default = parallel(content, style)

exports.watch = series(parallel(content, style), parallel(contentWatch, styleWatch))
exports.serve = series(parallel(content, style), parallel(contentWatch, styleWatch, serve))

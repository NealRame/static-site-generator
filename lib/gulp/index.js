const gulp = require('gulp')
const gulpif = require('gulp-if')
const livereload = require('gulp-livereload')

const {all, both, either, ifElse, is, map, nth, pluck, pipe, uniq, where} = require('ramda')

const Serve = require('../../lib/gulp/serve')

// ([...dirpath]) => ([schemeName, schemeConfig]) => [schemePath, scheme].
// Return a scheme loader given a list of search path.
// The returned scheme loader will take a scheme name and a scheme config to
// load and initialize a scheme.
function SchemeLoader(paths) {
	return pipe(
		([name, config]) => [
			require.resolve(name, {paths}),
			config,
		],
		([path, config]) => [
			path,
			require(path)(config),
		]
	)
}

// ([schemePath, scheme]) => scheme
// if scheme is valid return it, otherwise throw a TypeError exception.
const checkScheme = ifElse(
	pipe(
		nth(1),
		where({
			build: is(Function),
			clean: is(Function),
			sources: either(
				both(is(Array), all(is(String))),
				is(String)
			),
		}),
	),
	nth(1),
	([path]) => {
		throw new TypeError(`${path} is not valid`)
	}
)

function SchemeBuilder({serve, paths, outputDir}) {
	const loadScheme = pipe(
		SchemeLoader(paths),
		checkScheme
	)
	return ([name, config]) => {
		const scheme = loadScheme([name, Object.assign({}, config, {outputDir})])

		const clean = scheme.clean
		const build = cb => {
			try {
				return scheme.build(cb).pipe(gulpif(serve, livereload()))
			} catch (err) {
				cb(err)
			}
		}
		const watch = cb => {
			try {
				return gulp.watch(scheme.sources, gulp.series(clean, build))
			} catch (err) {
				cb(err)
			}
		}

		build.displayName = `${name}:build`
		clean.displayName = `${name}:clean`
		watch.displayName = `${name}:watch`

		return {[name]: {
			build: gulp.series(clean, build),
			clean,
			watch,
		}}
	}
}

function CreateGulpTasks(descriptor, {
	outputDir = 'build',
	paths = [],
	serve = true,
} = {}) {
	const buildTask = SchemeBuilder({
		paths: uniq([__dirname, ...paths]),
		serve,
		outputDir,
	})
	const namedTasks = Object.assign({}, ...map(buildTask, Object.entries(descriptor)))

	const build = gulp.parallel(pluck('build', Object.values(namedTasks)))
	const clean = gulp.parallel(pluck('clean', Object.values(namedTasks)))
	const watch = gulp.series(
		gulp.parallel(pluck('build', Object.values(namedTasks))),
		gulp.parallel(pluck('watch', Object.values(namedTasks)))
	)

	const gulpTasks = {
		build,
		clean,
		watch,
		default: build,
	}

	if (serve) {
		const serveTask = Serve({
			baseDir: outputDir,
		})
		serveTask.displayName = 'serve:webserver'
		return Object.assign({
			serve: gulp.parallel(watch, serveTask),
		}, gulpTasks)
	}

	return gulpTasks
}

module.exports = CreateGulpTasks

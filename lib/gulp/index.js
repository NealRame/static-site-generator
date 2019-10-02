const gulp = require('gulp')
const gulpif = require('gulp-if')
const livereload = require('gulp-livereload')

const {all, both, either, head, ifElse, is, map, nth, pluck, pipe, uniq, where} = require('ramda')

const Serve = require('../../lib/gulp/serve')

// ([...dirpath]) => ([name, schemeConfig]) => [schemeName, scheme]
// Return a scheme loader given a list of search path.
// The returned scheme loader will take a scheme name and a scheme config to
// load and initialize a scheme.
function SchemeLoader(paths) {
	return pipe(
		// schemeName:taskName => schemeName
		([name, config]) => [
			head(name.split(':')),
			config,
		],
		// resolve schemeName to a filepath
		([schemeName, config]) => [
			schemeName,
			require.resolve(`./${schemeName}`, {paths}),
			config,
		],
		// load scheme
		([schemeName, path, config]) => [
			schemeName,
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

// wrap the given task within a try catch block
function wrapTask(task) {
	return cb => {
		try {
			return task(cb)
		} catch (err) {
			cb(err)
		}
	}
}

function SchemeBuilder({serve, paths, outputDir}) {
	const loadScheme = pipe(
		SchemeLoader(paths),
		checkScheme
	)

	return ([name, config]) => {
		const scheme = loadScheme([name, {...config, outputDir}])

		const clean = scheme.clean
		const build = wrapTask(cb => {
			const res = scheme.build(cb)
			if (is(Function, res.pipe)) {
				return res.pipe(gulpif(serve, livereload()))
			}
			return res.then(() => {
				if (serve) {
					livereload()
				}
				cb()
			}, cb)
		})
		const watch = wrapTask(cb => gulp.watch(scheme.sources, gulp.series(clean, build)))

		build.displayName = `${name}:build`
		clean.displayName = `${name}:clean`
		watch.displayName = `${name}:watch`

		return {
			build: gulp.series(clean, build),
			clean,
			watch,
		}
	}
}

function CreateGulpTasks(descriptor, {
	outputDir = 'build',
	paths = [],
	serve = true,
} = {}) {
	const buildScheme = SchemeBuilder({
		paths: uniq([__dirname, ...paths]),
		serve,
		outputDir,
	})
	const schemes = map(buildScheme, Object.entries(descriptor))

	const build = gulp.parallel(pluck('build', schemes))
	const clean = gulp.parallel(pluck('clean', schemes))
	const watch = gulp.series(
		gulp.parallel(pluck('build', schemes)),
		gulp.parallel(pluck('watch', schemes))
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

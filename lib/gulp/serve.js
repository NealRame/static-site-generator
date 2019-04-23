const { async: {promisify} } = require('../utils')

const { always } = require('ramda')
const { join } = require('path')

const gulp = require('gulp')
const livereload = require('gulp-livereload')
const webserver = require('gulp-webserver')

const fs = require('fs')
const url = require('url')

const stat = promisify(fs.stat)
const access = promisify(fs.access)

function checkReadAccess(pathname) {
	return access(pathname, fs.constants.R_OK).then(always(pathname))
}

module.exports = function ({
	baseDir,
}) {
	function page(prefix) {
		const p = join(baseDir, prefix)
		return stat(p)
			.then((stats) => {
				if (stats.isDirectory()) {
					return page(join(prefix, 'index.html'))
				}
				return p
			})
			.then(checkReadAccess)
	}

	return cb => {
		try {
			if (livereload) {
				livereload.listen()
			}
			return gulp.src(baseDir)
				.pipe(webserver({
					middleware(req, res, next) {
						page(url.parse(req.url).pathname)
							.then(() => next())
							.catch(() => {
								res.statusCode = 404
								res.statusMessage = 'Not found'

								const page404 = join(baseDir, '404', 'index.html')
								if (fs.existsSync(page404)) {
									fs.createReadStream(join(baseDir, '404', 'index.html')).pipe(res)
								} else {
									res.end('Not found')
								}
							})
					},
				}))
		} catch (err) {
			cb(err)
		}
	}
}

const connect = require('gulp-connect')
const {isNil} = require('ramda')
const path = require('path')

module.exports = function ({
	root,
	livereload = true,
	fallback = null,
}) {
	const fallbackPath = () => isNil(fallback) ? {} : {
		fallback: path.join(root, fallback),
	}
	return cb => {
		try {
			connect.server({
				root,
				livereload,
				...fallbackPath(),
			})
		} catch (err) {
			cb(err)
		}
	}
}

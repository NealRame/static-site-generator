const gulp = require('gulp')
const Blender = require('../../index.js')

gulp.task('default', () => {
	const blender = Blender({
		index: true,
		middlewares: ['blender-menu'],
	})
	return gulp.src(blender.sources())
		.pipe(blender.stream())
		.pipe(gulp.dest('build'))
})

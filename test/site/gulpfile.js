const gulp = require('gulp')
const Blender = require('../../index.js')

gulp.task('default', () => {
	const blender = Blender({
		middlewares: ['blender-menu'],
	})
	gulp.src(blender.sources())
		.pipe(blender.stream())
		.pipe(gulp.dest('build'))
})

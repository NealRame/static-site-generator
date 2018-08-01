const chalk = require('chalk')
const fancyLog = require('fancy-log')
const {always, cond, lte, test, T, where} = require('ramda')

const LOG_LEVEL_ERROR = 0
const LOG_LEVEL_WARNING = 1
const LOG_LEVEL_INFO = LOG_LEVEL_WARNING + 1
const LOG_LEVEL_DEBUG = LOG_LEVEL_INFO + 1

const logLevel = cond([
	[test(/debug/i), always(LOG_LEVEL_DEBUG)],
	[test(/info/i), always(LOG_LEVEL_INFO)],
	[test(/warning/i), always(LOG_LEVEL_WARNING)],
	[T, always(LOG_LEVEL_ERROR)],
])

const error = cond([
	[where({level: lte(LOG_LEVEL_ERROR)}), ({prefix}) => function(...msgs) {
		fancyLog.error(chalk.red(`${prefix}:`), ...msgs)
		return this
	}],
	[T, always(function() {
		return this
	})],
])

const warn = cond([
	[where({level: lte(LOG_LEVEL_WARNING)}), ({prefix}) => function(...msgs) {
		fancyLog.warn(chalk.yellow(`${prefix}:`), ...msgs)
		return this
	}],
	[T, always(function() {
		return this
	})],
])

const info = cond([
	[where({level: lte(LOG_LEVEL_INFO)}), ({prefix}) => function(...msgs) {
		fancyLog.info(chalk.green(`${prefix}:`), ...msgs)
		return this
	}],
	[T, always(function() {
		return this
	})],
])

const debug = cond([
	[where({level: lte(LOG_LEVEL_DEBUG)}), ({prefix}) => function(...msgs) {
		fancyLog.warn(chalk.cyan(`${prefix}:`), ...msgs)
		return this
	}],
	[T, always(function() {
		return this
	})],
])

function Logger({
	prefix = 'log',
}) {
	const level = logLevel(process.env.BLENDER_LOG_LEVEL)
	return {
		error: error({level, prefix}),
		warn: warn({level, prefix}),
		info: info({level, prefix}),
		debug: debug({level, prefix}),
		get level() {
			return level
		},
	}
}

module.exports = Object.defineProperties(Logger, {
	'disabled': {
		value: -1,
	},
	'error': {
		value: LOG_LEVEL_ERROR,
	},
	'warning': {
		value: LOG_LEVEL_WARNING,
	},
	'info': {
		value: LOG_LEVEL_INFO,
	},
	'debug': {
		value: LOG_LEVEL_DEBUG,
	},
})

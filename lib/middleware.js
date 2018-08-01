const {join} = require('path')
const {always, cond, either, identity, is, isNil, pipe, reduce, reduced, T, tryCatch, where} = require('ramda')

const {tap: asyncTap} = require('./async')

const isFunction = is(Function)
const isObject = is(Object)
const isString = is(String)

function _RegisterError(item) {
	throw new TypeError(`Cannot register middleware with ${item}`)
}

function _LoadError({name}) {
	throw new Error(`Cannot load middleware '${name}'`)
}

function _MiddlewareBuilder(state) {
	return cond([
		[
			where({name: isString, builder: isFunction, config: isObject}),
			({name, builder, config}) => {
				const process = builder(config)
				return asyncTap(files => {
					state.log.info(`Tap middleware: ${name}`)
					return process(files, state)
				})
			},
		], [
			where({name: isString}),
			_LoadError,
		], [
			T,
			_RegisterError,
		],
	])
}

function _MiddlewareLoader(state) {
	return ({name, config}) => {
		return {
			builder: reduce(
				tryCatch(
					(module, dir) => isNil(module) ? require(join(dir, name)) : reduced(module),
					always(null)
				),
				null,
				state.middlewaresDirectories
			),
			config,
			name,
		}
	}
}

module.exports = {
	_MiddlewareLoader,
	_MiddlewareBuilder,
	MiddlewareFactory(state) {
		return pipe(
			cond([
				[isString, name => ({config: {}, name})],
				[
					where({
						builder: either(isNil, isFunction),
						config: either(isNil, isObject),
						name: isString,
					}),
					({builder, name}) => ({builder, config: {}, name}),
				],
			]),
			cond([
				[
					where({builder: isNil}),
					_MiddlewareLoader(state),
				],
				[T, identity],
			]),
			_MiddlewareBuilder(state),
		)
	},
}

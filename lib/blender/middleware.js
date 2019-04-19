const {cond, either, identity, is, isNil, pipe, T, where} = require('ramda')

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
		const modulePath = require.resolve(name, {
			paths: state.middlewaresDirectories,
		})
		const builder = require(modulePath)
		if (isNil(modulePath)) {
			return null
		} else {
			return {
				builder,
				config,
				name,
			}
		}
	}
}

module.exports = {
	_MiddlewareLoader,
	_MiddlewareBuilder,
	MiddlewareFactory(state) {
		const loadMiddleware = _MiddlewareLoader(state)
		const buildMiddleware = _MiddlewareBuilder(state)
		return pipe(
			cond([
				[
					isString,
					name => ({builder: null, config: {}, name}),
				], [
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
					loadMiddleware,
				],
				[T, identity],
			]),
			buildMiddleware
		)
	},
}

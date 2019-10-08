const {cond, curry, either, identity, is, isNil, pipe, T, where} = require('ramda')

const {tap: asyncTap} = require('../utils/async')

const isFunction = is(Function)
const isObject = is(Object)
const isString = is(String)

function _registerError(item) {
	throw new TypeError(`Cannot register middleware with ${item}`)
}

function _MiddlewareBuilder(state) {
	return ({name, builder, config}) => {
		if (isString(name) && isFunction(builder) && isObject(config)) {
			const process = builder(config)
			return asyncTap(files => {
				state.log.info(`Tap middleware: ${name}`)
				return process(files, state)
			})
		}
		_registerError()
	}
}

function _MiddlewareLoader({middlewaresDirectories: paths}) {
	return ({name, config}) => {
		const modulePath = require.resolve(`./${name}`, {paths})
		if (isNil(modulePath)) {
			throw new Error(`Middleware '${name}' not found!`)
		}
		return {
			builder: require(modulePath),
			config,
			name,
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
				// The first step in the pipe is to normalize the middlewares
				// initialization parameters :
				[
					// only a module name is provided with no config object
					isString,
					name => ({builder: null, config: {}, name}),
				], [
					// an object with at least a name property
					where({
						builder: either(isNil, isFunction),
						config: either(isNil, isObject),
						name: isString,
					}),
					curry(Object.assign)({
						builder: null,
						config: {},
					}),
				], [
					// will fail later when we will try to build the middleware
					T,
					_registerError,
				],
			]),
			cond([
				// Now the middleware descriptor is normalized:
				[
					// load the module if no builder has been provided
					where({builder: isNil}),
					loadMiddleware,
				], [
					// otherwise, forward the descriptor as is
					T,
					identity,
				],
			]),
			buildMiddleware
		)
	},
}

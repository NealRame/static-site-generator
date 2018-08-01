const test = require('ava')
const {identical, isNil, is, where} = require('ramda')

const State = require('../helpers/state')
const makeMiddlewareModule = require('../helpers/make-middleware-module')
const {_MiddlewareLoader} = require('../../../lib/middleware')

test('_MiddlewareLoader should be a function', t => {
	t.true(is(Function, _MiddlewareLoader))
})

test('_MiddlewareLoader should return a function', t => {
	t.true(is(Function, _MiddlewareLoader(State())))
})

test(`Loader should return {builder, config, name} when module 'name' has been found`, async t => {
	return makeMiddlewareModule({pretend: false}).then(({dir, name}) => {
		const state = State({middlewaresDirectories: [dir]})
		const load = _MiddlewareLoader(state)
		const config = {foo: 'bar'}
		const middleware = load({name, config})
		t.true(where({
			builder: is(Function),
			config: identical(config),
			name: identical(name),
		}, middleware))
	})
})

test(`Loader should return {builder: null, config, name} when module 'name' has not been found`, async t => {
	return makeMiddlewareModule({pretend: true}).then(({dir, name}) => {
		const state = State({middlewaresDirectories: [dir]})
		const load = _MiddlewareLoader(state)
		const config = {foo: 'bar'}
		const middleware = load({name, config})
		t.true(where({
			builder: isNil,
			config: identical(config),
			name: identical(name),
		}, middleware))
	})
})

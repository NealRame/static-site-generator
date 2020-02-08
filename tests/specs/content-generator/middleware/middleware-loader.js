const {join} = require('path')
const test = require('ava')
const {identical, is, where} = require('ramda')

const State = require('../helpers/state')
const {_MiddlewareLoader} = require('../../../../lib/gulp/content/middleware')

test('_MiddlewareLoader should be a function', t => {
	t.true(is(Function, _MiddlewareLoader))
})

test('_MiddlewareLoader should return a function', t => {
	t.true(is(Function, _MiddlewareLoader(State())))
})

test('Loader should return {builder, config, name} when module \'name\' has been found', t => {
	const state = State({middlewaresDirectories: [join(__dirname, '..', 'helpers')]})
	const load = _MiddlewareLoader(state)
	const config = {foo: 'bar'}
	const middleware = load({name: 'middleware', config})
	t.true(where({
		builder: is(Function),
		config: identical(config),
		name: identical('middleware'),
	}, middleware))
})

test('Loader should throw when module \'name\' has not been found', t => {
	const state = State({middlewaresDirectories: []})
	const load = _MiddlewareLoader(state)
	const config = {foo: 'bar'}
	t.throws(() => load({name: 'middleware', config}), {instanceOf: Error})
})

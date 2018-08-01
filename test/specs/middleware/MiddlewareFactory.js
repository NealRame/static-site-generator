const test = require('ava')
const {is} = require('ramda')

const State = require('../helpers/state')
const makeMiddlewareModule = require('../helpers/make-middleware-module')
const {noop} = require('../../../lib/functional')
const {MiddlewareFactory} = require('../../../lib/middleware')

test('MiddlewareFactory should be a function', t => {
	t.true(is(Function, MiddlewareFactory))
})

test('MiddlewareFactory(state) should return a function', t => {
	t.true(is(Function, MiddlewareFactory(State())))
})

test('Factory create a middleware with a {name, builder, config} object', t => {
	const factory = MiddlewareFactory(State())
	t.true(is(Function, factory({
		name: 'test',
		builder: () => noop,
	})))
})

test(`Factory create a middleware with a 'name'`, async t => {
	return makeMiddlewareModule().then(({dir, name}) => {
		const factory = MiddlewareFactory(State({middlewaresDirectories: [dir]}))
		t.true(is(Function, factory(name)))
	})
})

test(`Factory create a middleware with a {name} object`, async t => {
	return makeMiddlewareModule().then(({dir, name}) => {
		const factory = MiddlewareFactory(State({middlewaresDirectories: [dir]}))
		t.true(is(Function, factory({name})))
	})
})

test(`Factory create a middleware with a {name, config} object`, async t => {
	return makeMiddlewareModule().then(({dir, name}) => {
		const factory = MiddlewareFactory(State({middlewaresDirectories: [dir]}))
		t.true(is(Function, factory({
			name,
			config: {},
		})))
	})
})

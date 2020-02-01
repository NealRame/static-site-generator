const test = require('ava')
const {is} = require('ramda')
const {spy, stub} = require('sinon')

const State = require('../helpers/state')

const {noop} = require('../../../../lib/utils/functional')
const {_MiddlewareBuilder} = require('../../../../lib/content-generator/middleware')

test('_MiddlewareBuilder should be a function', t => {
	t.true(is(Function, _MiddlewareBuilder))
})

test('_MiddlewareBuilder should return a function', t => {
	const state = State()
	const builder = _MiddlewareBuilder(state)
	t.true(is(Function, builder))
})

test('_MiddlewareBuilder returned function should return a function', t => {
	const state = State()
	const build = _MiddlewareBuilder(state)
	t.true(is(Function, build({
		name: 'test',
		builder: noop,
		config: {},
	})))
})

test('Middleware builder should call back builder with config', t => {
	const state = State()
	const build = _MiddlewareBuilder(state)
	const data = {
		name: 'test',
		builder: stub().returns(noop),
		config: {},
	}

	build(data)
	t.true(data.builder.calledOnceWith(data.config))
})

test('Middleware builder should throw when data is not correct', t => {
	const state = State()
	const build = _MiddlewareBuilder(state)

	t.throws(() => build({}), {instanceOf: Error})
	t.throws(() => build({name: 'test'}), {instanceOf: Error})
	t.throws(() => build({name: 0}), {instanceOf: Error})
	t.throws(() => build({name: 0, builder: 2}), {instanceOf: Error})
	t.throws(() => build({name: 'test', builder: () => noop, config: 2}), {instanceOf: Error})
})

test('Middleware should call back once process with files', async t => {
	const state = State()
	const build = _MiddlewareBuilder(state)
	const process = spy()
	const builder = stub()

	builder.returns(process)

	const middleware = build({
		name: 'test',
		builder,
		config: {},
	})
	const files = []
	const partials = []
	const templates = []

	await middleware({files, partials, templates})

	t.true(process.calledOnceWithExactly(files, partials, templates))
})

test('Middleware should return passed files', async t => {
	const state = State()
	const build = _MiddlewareBuilder(state)
	const process = spy()
	const builder = stub()

	builder.returns(process)

	const middleware = build({
		name: 'test',
		builder,
		config: {},
	})
	const files = []

	t.true(await middleware(files) === files)
})

const test = require('ava')

const {is} = require('ramda')
const {fake} = require('sinon')
const {noop} = require('../../../lib/utils/functional')
const {tap} = require('../../../lib/utils/async')

test('tap should be a function', t => {
	t.true(typeof tap === 'function')
})

test('tap should return a function', t => {
	t.true(typeof tap(noop) === 'function')
})

test('tap function should return a Promise', t => {
	t.true(is(Promise, tap(noop)({})))
})

test('tap(interceptor)(value) interceptor should be called once', async t => {
	const interceptor = fake()
	const fn = tap(interceptor)
	await fn({})
	t.true(interceptor.calledOnce)
})

test('tap(interceptor)(value) interceptor should be called with the passed value', async t => {
	const interceptor = fake()
	const fn = tap(interceptor)
	const value = {}
	await fn(value)
	t.true(interceptor.calledWith(value))
})

test('tap(interceptor)(value) should resolved with value if interceptor resolved (async)', async t => {
	const fn = tap(fake.resolves())
	const value = {}
	const res = await fn(value)
	t.true(res === value)
})

test('tap(interceptor)(value) should resolved with value if interceptor return (sync)', async t => {
	const fn = tap(noop)
	const value = {}
	const res = await fn(value)
	t.true(res === value)
})

test('tap(interceptor)(value) should failed if the interceptor reject (async)', async t => {
	const err = new Error()
	const fn = tap(fake.rejects(err))
	await t.throwsAsync(async () => fn({}), {is: err})
})

test('tap(interceptor)(value) should failed if the interceptor reject (sync)', async t => {
	const err = new Error()
	const fn = tap(fake.throws(err))
	await t.throwsAsync(async () => fn({}), {is: err})
})

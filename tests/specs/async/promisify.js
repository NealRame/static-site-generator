const test = require('ava')

const {promisify} = require('../../../lib/utils/async')
const {spy} = require('sinon')

test('promisify: should be a function', t => {
	t.true(typeof promisify === 'function')
})

test('promisify(fn): should return a function', t => {
	t.true(typeof promisify(() => Promise.resolve(true)) === 'function')
})

test('promisify(fn): fn should be called once', async t => {
	const fn = spy(cb => cb(null))
	await promisify(fn)()
	t.true(fn.calledOnce)
})

test('promisify(fn): resolve', async t => {
	const fn = spy((v, cb) => cb(null, v))
	const v = {}
	const res = await promisify(fn)(v)
	t.true(res === v)
})

test('promisify(fn): reject', async t => {
	const err = new Error()
	const fn = spy(cb => cb(err))
	await t.throwsAsync(promisify(fn), {is: err})
})

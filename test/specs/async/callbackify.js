const test = require('ava')

const {callbackify} = require('../../../lib/async')

test('callbackify: should be a function', t => {
	t.true(typeof callbackify === 'function')
})

test('callbackify(fn): should return a function', t => {
	t.true(typeof callbackify(() => Promise.resolve(true)) === 'function')
})

test.cb('callbackify(fn): resolve', t => {
	const fn = callbackify(() => Promise.resolve(true))
	t.plan(1)
	fn((err) => {
		t.true(err == null)
		t.end()
	})
})

test.cb('callbackify(fn): reject', t => {
	const err = new Error()
	const fn = callbackify(() => Promise.reject(err))
	t.plan(1)
	fn((e) => {
		t.true(e === err)
		t.end()
	})
})

const test = require('ava')

const {nodify} = require('../../../lib/utils/async')

test('map: should be a function', t => {
	t.true(typeof nodify === 'function')
})

test.cb('nodify(promise, cb): cb should be call with cb(null, value) with value the resolved value of promise', t => {
	const value = {}
	const promise = Promise.resolve(value)
	t.plan(1)
	nodify(promise, (err, v) => {
		t.true(err == null && v === value)
		t.end()
	})
})

test.cb('nodify(promise, cb): cb should be call with cb(err) with err the reject value of promise', t => {
	const err = new Error()
	const promise = Promise.reject(err)
	t.plan(1)
	nodify(promise, e => {
		t.true(e === err)
		t.end()
	})
})

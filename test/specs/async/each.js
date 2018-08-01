const test = require('ava')

const {is, times} = require('ramda')
const {fake} = require('sinon')
const {each} = require('../../../lib/async')
const {noop} = require('../../../lib/functional')

test('each: should be a function', t => {
	t.true(typeof each === 'function')
})

test('each(iteratee): should return a function', t => {
	t.true(typeof each(noop) === 'function')
})

test('each(iteratee)(col): should return a Promise', t => {
	t.true(is(Promise, each(noop)([])))
})

test('each(iteratee)(col): iteratee should be called once on each element of the passed collection', async t => {
	const iteratee = fake(noop)
	const fn = each(iteratee)

	iteratee.resetHistory()
	await fn([])
	t.true(iteratee.callCount === 0)

	iteratee.resetHistory()
	await fn([0])
	t.true(iteratee.callCount === 1 && iteratee.calledWithExactly(0))

	iteratee.resetHistory()
	const col = times(noop, 100)
	await fn(col)
	t.true(iteratee.callCount === 100 && col.every(
		(v, index) => iteratee.getCall(index).calledWithExactly(v)
	))
})

test('each(iteratee)(col) should failed if the iteratee reject (async)', async t => {
	const err = new Error()
	const fn = each(fake.rejects(err))
	await t.throwsAsync(async () => fn([0]), {is: err})
})

test('each(iteratee)(col) should failed if the iteratee reject (sync)', async t => {
	const err = new Error()
	const fn = each(fake.throws(err))
	await t.throwsAsync(async () => fn([0]), {is: err})
})

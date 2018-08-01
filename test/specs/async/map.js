const test = require('ava')

const {identity, is, times} = require('ramda')
const {fake, stub} = require('sinon')
const {map} = require('../../../lib/async')

test('map: should be a function', t => {
	t.true(typeof map === 'function')
})

test('map(iteratee): should return a function', t => {
	t.true(typeof map(identity) === 'function')
})

test('map(iteratee)(col): should return a Promise', t => {
	t.true(is(Promise, map(identity)([])))
})

test('map(iteratee)(col): iteratee should be called once on each element of the passed collection', async t => {
	const iteratee = fake(identity)
	const fn = map(iteratee)

	iteratee.resetHistory()
	await fn([])
	t.true(iteratee.callCount === 0)

	iteratee.resetHistory()
	await fn([0])
	t.true(iteratee.callCount === 1 && iteratee.calledWithExactly(0))

	iteratee.resetHistory()
	const col = times(identity, 100)
	await fn(col)
	t.true(iteratee.callCount === 100 && col.every(
		(v, index) => iteratee.getCall(index).calledWithExactly(v)
	))
})

test('map(iteratee)(col): should resolved in an array with the same size as the passed collection (async)', async t => {
	const col = times(identity, 100)
	const res = await map(stub().resolvesArg(0))(col)
	t.true(res.length === col.length)
})

test('map(iteratee)(col): should resolved in an array with the same size as the passed collection (sync)', async t => {
	const col = times(identity, 100)
	const res = await map(identity)(col)
	t.true(res.length === col.length)
})

test('map(iteratee)(col) should failed if the iteratee reject (async)', async t => {
	const err = new Error()
	const fn = map(fake.rejects(err))
	await t.throwsAsync(async () => fn([0]), {is: err})
})

test('map(iteratee)(col) should failed if the iteratee reject (sync)', async t => {
	const err = new Error()
	const fn = map(fake.throws(err))
	await t.throwsAsync(async () => fn([0]), {is: err})
})

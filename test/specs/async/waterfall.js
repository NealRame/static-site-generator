const test = require('ava')
const {all, append, aperture, prepend, times} = require('ramda')
const {spy} = require('sinon')

const {waterfall} = require('../../../lib/utils/async')
const {noop} = require('../../../lib/utils')

test('waterfall should be a function', t => {
	t.true(typeof waterfall === 'function')
})

test('waterfall should call all given async task once', async t => {
	const tasks = times(() => spy(() => Promise.resolve()), 100)
	await waterfall(tasks)
	t.true(all(task => task.calledOnce, tasks))
})

test('waterfall should call all given sync task once', async t => {
	const tasks = times(() => spy(noop), 100)
	await waterfall(tasks)
	t.true(all(task => task.calledOnce, tasks))
})

test('waterfall should call all given sync task once in the same order', async t => {
	const tasks = times(() => spy(noop), 100)
	await waterfall(tasks)
	t.true(all(([t1, t2]) => t1.calledBefore(t2), aperture(2, tasks)))
})

test('waterfall should call all each task with the returned value of the previous task', async t => {
	const tasks = times(n => spy(append(n)), 100)
	await waterfall(prepend(() => [], tasks))
	t.true(all(
		([t1, t2]) => t2.calledWith(t1.returnValues[0]),
		aperture(2, tasks)
	))
})

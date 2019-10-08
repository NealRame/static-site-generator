const test = require('ava')
const sinon = require('sinon')

const functional = require('../../lib/utils/functional')

test('noop', t => {
	t.is(functional.noop(), undefined)
})

test('dropFirstArg', t => {
	const fake = sinon.fake()
	const fn = functional.dropFirstArg(fake)
	const args = [1, 2]
	fn(0, ...args)
	t.truthy(fake.calledWith(...args))
})

test('createErrorFirstCallback', t => {
	const resolve = sinon.fake()
	const reject = sinon.fake()
	const fn = functional.createErrorFirstCallback(resolve, reject)

	const err = new Error()

	fn(err)
	t.truthy(reject.calledWith(err))

	fn(null, 0, 1)
	t.truthy(resolve.calledWith(0, 1))
})

test('truthy', t => {
	t.true(functional.truthy(true))
	t.false(functional.truthy(false))
	t.false(functional.truthy(null))
	t.false(functional.truthy())
})

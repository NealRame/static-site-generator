const test = require('ava')
const utils = require('../../lib/utils')

test('truthy', t => {
	t.true(utils.truthy(true))
	t.false(utils.truthy(false))
	t.false(utils.truthy(null))
	t.false(utils.truthy())
})

test('pathToSlug', t => {
	t.deepEqual(utils.pathToSlug(''), '/')
	t.deepEqual(utils.pathToSlug('index'), '/')
	t.deepEqual(utils.pathToSlug('index.html'), '/')
	t.deepEqual(utils.pathToSlug('foo'), '/foo')
	t.deepEqual(utils.pathToSlug('foo/bar'), '/foo/bar')
	t.deepEqual(utils.pathToSlug('foo/bar.html'), '/foo/bar')
	t.deepEqual(utils.pathToSlug('foo/bar/index'), '/foo/bar')
	t.deepEqual(utils.pathToSlug('foo/bar/index.html'), '/foo/bar')
})

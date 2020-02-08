const test = require('ava')

const slug = require('../../../lib/gulp/content/slug')

test('pathToSlug', t => {
	t.deepEqual(slug.pathToSlug(''), '/')
	t.deepEqual(slug.pathToSlug('index'), '/')
	t.deepEqual(slug.pathToSlug('index.html'), '/')
	t.deepEqual(slug.pathToSlug('foo'), '/foo')
	t.deepEqual(slug.pathToSlug('foo/bar'), '/foo/bar')
	t.deepEqual(slug.pathToSlug('foo/bar.html'), '/foo/bar')
	t.deepEqual(slug.pathToSlug('foo/bar/index'), '/foo/bar')
	t.deepEqual(slug.pathToSlug('foo/bar/index.html'), '/foo/bar')
})

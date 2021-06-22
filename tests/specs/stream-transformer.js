const test = require('ava')
const isStream = require('is-stream')
const {spy} = require('sinon')
const {identity} = require('ramda')

const {Transformer} = require('../../lib/utils/stream')

test('Transformer should be a function', t => {
	t.is(typeof Transformer, 'function')
})

test('Transformer should create a transform stream', t => {
	const transformStream = Transformer({handle: identity})
	t.true(isStream.duplex(transformStream)
		&& (typeof transformStream._transform === 'function'))
})

test('Transformer should create a transform stream in object mode', t => {
	const transform = Transformer({handle: identity})
	t.true(transform._readableState.objectMode)
	t.true(transform._writableState.objectMode)
})

test('handle callback should be called once when data is written', t => {
	const handle = spy(identity)
	const transform = Transformer({handle})
	const data = {test: 'foo'}
	transform.write(data)
	t.true(handle.withArgs(data).calledOnce)
})

test('finish callback should be called once when stream is ended', t => {
	const finish = spy()
	const transform = Transformer({handle: identity, finish})
	transform.end()
	t.true(finish.calledOnce)
})

test('finish callback should be called with the stream as parameter', t => {
	const finish = spy()
	const transform = Transformer({handle: identity, finish})
	transform.end()
	t.true(finish.calledWith(transform))
})

const {always, dropLast, isNil, last, map: _map} = require('ramda')
const {eachSeries: _eachSeries, mapSeries: _mapSeries, waterfall: _waterfall} = require('async')

const {createErrorFirstCallback} = require('./functional')

function nodify(promise, cb) {
	promise
		.then(res => cb(null, res))
		.catch(cb)
}

function callbackify(fn) {
	return function(...args) {
		const cb = last(args)
		try {
			Promise.resolve(fn.apply(this, dropLast(1, args)))
				.then(res => cb(null, res))
				.catch(cb)
		} catch (err) {
			cb(err)
		}
	}
}

function promisify(fn) {
	return (...args) => {
		return new Promise(function(resolve, reject) {
			fn(...args, createErrorFirstCallback(resolve, reject))
		})
	}
}

function tap(fn) {
	return function(value) {
		try {
			return Promise.resolve(fn(value)).then(always(value))
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

function each(iteratee, col) {
	if (isNil(col)) {
		return col => new Promise((resolve, reject) => _eachSeries(
			col,
			callbackify(iteratee),
			createErrorFirstCallback(resolve, reject)
		))
	}
	return each(iteratee)(col)
}

function map(iteratee, col) {
	if (isNil(col)) {
		return col => new Promise((resolve, reject) => _mapSeries(
			col,
			callbackify(iteratee),
			createErrorFirstCallback(resolve, reject),
		))
	}
	return map(iteratee)(col)
}

function waterfall(tasks) {
	return new Promise((resolve, reject) => {
		_waterfall(_map(callbackify, tasks), createErrorFirstCallback(resolve, reject))
	})
}

module.exports = {
	each,
	map,
	nodify,
	callbackify,
	promisify,
	tap,
	waterfall,
}

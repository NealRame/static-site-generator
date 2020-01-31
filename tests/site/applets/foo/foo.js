export const foo = function(n) {
	let a = 0
	let b = 1
	while (n > 0) {
		const c = a
		a = b
		b = c + b
		n = n - 1
	}
	return a
}

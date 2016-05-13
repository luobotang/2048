var assert = require('assert')
var Numbers = require('../src/numbers')

describe('Numbers#mergeCell()', function () {

	it('should merge correct from left to right', function () {
		var numbers = new Numbers()
		var cell
		numbers.currentMove = []

		// row-0: 2 2 0 0 => 4 0 0 0
		numbers.set(0, 0, 2)
		numbers.set(0, 1, 2)
		cell = numbers.mergeCell(0, 1, 0, 0)
		assert(numbers.get(0, 0) === 0)
		assert(numbers.get(0, 1) === 4)
		assert(cell[0] === 0 && cell[1] === 0)

		// row-1: 2 4 0 0 => 2 4 0 0
		numbers.set(1, 0, 2)
		numbers.set(1, 1, 4)
		cell = numbers.mergeCell(1, 1, 1, 0)
		assert(numbers.get(1, 0) === 2)
		assert(numbers.get(1, 1) === 4)
		assert(cell[0] === 1 && cell[1] === 0)

		// row-2: 2 0 0 2 => 4 0 0 0
		numbers.set(2, 0, 2)
		numbers.set(2, 3, 2)
		cell = numbers.mergeCell(2, 0, 2, 3)
		assert(numbers.get(2, 0) === 4)
		assert(numbers.get(2, 3) === 0)
		assert(cell[0] === 2 && cell[1] === 1)

		// row-3: 2 0 0 4 => 2 4 0 0
		numbers.set(3, 0, 2)
		numbers.set(3, 3, 4)
		cell = numbers.mergeCell(3, 0, 3, 3)
		assert(numbers.get(3, 1) === 4)
		assert(cell[0] === 3 && cell[1] === 1)
	})

	it('should merge correct from right to left', function () {
		var numbers = new Numbers()
		var cell
		numbers.currentMove = []

		// row-0: 2 2 0 0 => 4 0 0 0
		numbers.set(0, 0, 2)
		numbers.set(0, 1, 2)
		cell = numbers.mergeCell(0, 0, 0, 1)
		assert(numbers.get(0, 0) === 4)
		assert(numbers.get(0, 1) === 0)
		assert(cell[0] === 0 && cell[1] === 1)

		// row-1: 2 0 0 2 => 4 0 0 0
		numbers.set(1, 0, 2)
		numbers.set(1, 3, 2)
		cell = numbers.mergeCell(1, 0, 1, 3)
		assert(numbers.get(1, 0) === 4)
		assert(cell[0] === 1 && cell[1] === 1)

		// row-2: 2 0 0 4 => 2 4 0 0
		numbers.set(2, 0, 2)
		numbers.set(2, 3, 4)
		cell = numbers.mergeCell(2, 0, 2, 3)
		assert(numbers.get(2, 1) === 4)
		assert(cell[0] === 2 && cell[1] === 1)
	})

	it('should merge correct from up to down', function () {
		var numbers = new Numbers()
		var cell
		numbers.currentMove = []

		numbers.set(0, 0, 2)
		numbers.set(1, 0, 2)
		cell = numbers.mergeCell(1, 0, 0, 0)
		assert(numbers.get(1, 0) === 4)
		assert(cell[0] === 0 && cell[1] === 0)

		// col-1:
		// 2    0
		// 0 => 0
		// 0    0
		// 2    4
		numbers.set(0, 1, 2)
		numbers.set(3, 1, 2)
		cell = numbers.mergeCell(3, 1, 0, 1)
		assert(numbers.get(3, 1) === 4)
		assert(cell[0] === 2 && cell[1] === 1)

		// col-2:
		// 2    0
		// 0 => 0
		// 0    2
		// 4    4
		numbers.set(0, 2, 2)
		numbers.set(3, 2, 4)
		cell = numbers.mergeCell(3, 2, 0, 2)
		assert(numbers.get(2, 2) === 2)
		assert(cell[0] === 2 && cell[1] === 2)
	})

	it('should merge correct from down to up', function () {
		var numbers = new Numbers()
		var cell

		numbers.currentMove = []
		numbers.set(0, 0, 2)
		numbers.set(1, 0, 2)
		cell = numbers.mergeCell(0, 0, 1, 0)
		assert(numbers.get(0, 0) === 4)
		assert(cell[0] === 1 && cell[1] === 0)

		// col-1:
		// 2    4
		// 0 => 0
		// 0    0
		// 2    0
		numbers.set(0, 1, 2)
		numbers.set(3, 1, 2)
		cell = numbers.mergeCell(0, 1, 3, 1)
		assert(numbers.get(0, 1) === 4)
		assert(cell[0] === 1 && cell[1] === 1)

		// col-2:
		// 2    2
		// 0 => 4
		// 0    0
		// 4    0
		numbers.set(0, 2, 2)
		numbers.set(3, 2, 4)
		cell = numbers.mergeCell(0, 2, 3, 2)
		assert(numbers.get(1, 2) === 4)
		assert(cell[0] === 1 && cell[1] === 2)
	})
})

describe('Numbers#moveXXX()', function () {

	it('should change correct after move left', function () {
		var numbers = new Numbers()

		numbers.set(0, 0, 2)
		numbers.set(0, 1, 2)
		numbers.moveLeft()

		assert(numbers.get(0, 0) === 4)
	})

	it('should change correct after move right', function () {
		var numbers = new Numbers()

		numbers.set(0, 0, 2)
		numbers.set(0, 1, 2)
		numbers.moveRight()

		assert(numbers.get(0, 3) === 4)
	})

	it('should change correct after move up', function () {
		var numbers = new Numbers()

		numbers.set(0, 0, 2)
		numbers.set(1, 0, 2)
		numbers.moveUp()

		assert(numbers.get(0, 0) === 4)
	})

	it('should change correct after move down', function () {
		var numbers = new Numbers()

		numbers.set(0, 0, 2)
		numbers.set(1, 0, 2)
		numbers.moveDown()

		assert(numbers.get(3, 0) === 4)
	})
})
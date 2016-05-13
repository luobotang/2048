(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $ = require('jquery')
var Game = require('./game')

$(function () {
	var game = new Game()
})
},{"./game":2,"jquery":4}],2:[function(require,module,exports){
var $ = require('jquery')
var Numbers = require('./numbers')
var Keys = require('keys')
var MessageBox = require('./message-box')

var MOVE_ANIMATION_TIME = 500 // ms

function Game(el) {
	this.$el = $(el || '.game-2048')
	this.msgBox = new MessageBox()

	this.$el.on('click', '.new-round', $.proxy(function () {
		this.newRound()
	}, this))

	$(document).on('keydown', $.proxy(this.onKeydown, this))
}

$.extend(Game.prototype, {

	newRound: function () {
		this.numbers = new Numbers();
		this.msgBox.hide();

		this.renderNumbers();
		this.addRandomNumber();
		this.addRandomNumber();

		this.running = true;
	},

	isGameOver: function () {
		// 检查无法继续合并的情况
		if (!this.numbers.canMerge()) {
			this.running = false;
			this.msgBox.show("Game Over!");
		}

		this.numbers.forEach($.proxy(function (n) {
			if (n === 2048) {
				this.running = false;
				this.msgBox.show("Success! You got 2048!");
			}
		}, this))

		return !this.running
	},

	onKeydown: function (e) {
		var key = e.which
		if (!this.running || key < Keys.Left || key > Keys.Down) {
			return;
		}

		e.preventDefault();

		if (this.actionTimer) {
			return
		}

		var move

		switch (key) {
			case Keys.Left:  move = this.numbers.moveLeft();  break;
			case Keys.Up:    move = this.numbers.moveUp();    break;
			case Keys.Right: move = this.numbers.moveRight(); break;
			case Keys.Down:  move = this.numbers.moveDown();  break;
		}

		// 没有产生任何变化时不做处理
		if (move && move.length > 0) {
			this.showMove(move)

			// 等待动画完成
			this.actionTimer = setTimeout($.proxy(function () {
				this.actionTimer = null
				if (!this.isGameOver()) {
					this.addRandomNumber()
					this.isGameOver()
				}
			}, this), MOVE_ANIMATION_TIME);
		}
	},

	renderNumbers: function () {
		this.numbers.forEach($.proxy(function (num, row, col) {
			this.showNumber(row, col, num)
		}, this));
	},

	/*
	 * @param {Step[]} move - 由一系列的步骤组成的单次移动过程
	 */
	showMove: function (move) {
		for (var i = 0, len = move.length; i < len; i++) {
			this.showMoveStep(move[i]);
		}
	},

	showMoveStep: function (step) {
		var from = step.from
		var to = step.to
		var $cellFrom = this.getCell(from[0], from[1])
		var $cellFromClone = $cellFrom.clone().attr('id', '').css('z-index', '1').appendTo(this.$el)
		var $cellTo = this.getCell(to[0], to[1])

		$cellFrom.text('').attr('num', 'no')

		setTimeout(function () {
			$cellFromClone.attr('data-row', to[0]).attr('data-col', to[1])
		})

		setTimeout(function () {
			var result = step.result
			$cellTo.text(result).attr('num', result > 2048 ? 'super' : result)
			$cellFromClone.remove()
		})
	},

	showNumber: function (row, col, num) {
		this.getCell(row, col)
			.text(num === 0 ? "" : num)
			.attr('num', num === 0 ? "no" : num > 2048 ? "super" : num)
	},

	addRandomNumber: function () {
		var pos = this.getCellPosition(this.getRandomFreeCell())
		var num = this.getRandomNumber()
		this.numbers.set(pos.row, pos.col, num)
		this.showNumber(pos.row, pos.col, num)
	},

	getRandomFreeCell: function () {
		// 空闲位置 num 属性为 no
		var cells = this.$el.find('[num="no"]')
		var count = cells.length
		var rand = Math.floor(Math.random() * count)
		return cells.eq(rand)
	},

	getCellPosition: function ($cell) {
		return {
			row: parseInt($cell.attr("data-row"), 10),
			col: parseInt($cell.attr("data-col"), 10)
		};
	},

	// 随机数为 2 或 4
	getRandomNumber: function () {
		return Math.random() > 0.5 ? 2 : 4;
	},

	getCell: function (row, col) {
		return this.$el.find('.cell-' + row + '-' + col)
	}
})

module.exports = Game
},{"./message-box":3,"./numbers":6,"jquery":4,"keys":5}],3:[function(require,module,exports){
var $ = require('jquery')

function MessageBox(el) {
	this.$el = $(el || '.message-box')
	var self = this
	this.$el.on('click', function () {
		self.hide()
	})
}

$.extend(MessageBox.prototype, {

	show: function (message) {
		this.$el.text(message).show()
	},

	hide: function () {
		this.$el.hide()
	}

})

module.exports = MessageBox
},{"jquery":4}],4:[function(require,module,exports){
module.exports = window.jQuery
},{}],5:[function(require,module,exports){
module.exports =  {
	Left: 37,
	Up: 38,
	Right: 39,
	Down: 40
}
},{}],6:[function(require,module,exports){
var ROW_COUNT = 4
var COL_COUNT = 4

function Numbers() {
	this.numbers = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]]
	// 历次移动的过程记录
	// TODO 利用记录的移动过程数据实现“撤销”、“重做”
	this.moves = []
	this.rowCount = ROW_COUNT
	this.colCount = COL_COUNT
}

Numbers.prototype = {

	forEach: function (callback) {
		if (typeof callback !== 'function') return
		this.numbers.forEach(function (row, rowIndex) {
			row.forEach(function (number, colIndex) {
				callback(number, rowIndex, colIndex)
			})
		})
	},

	get: function (row, col) {
		var row = this.numbers[row]
		return row ? row[col] : null
	},
	set: function (row, col, n) {
		if (row >= 0 && row < this.rowCount &&
			col >= 0 && row < this.colCount) {
			this.numbers[row][col] = n
		}
	},

	moveLeft: function () {
		return this.mergeRows('asc');
	},
	moveUp: function () {
		return this.mergeCols('asc');
	},
	moveRight: function () {
		return this.mergeRows('desc');
	},
	moveDown: function () {
		return this.mergeCols('desc');
	},

	mergeRows: function (order) {
		var move = this.currentMove = []

		for (var i = 0, len = this.rowCount; i < len; i++) {
			this.mergeRow(i, order);
		}

		if (move.length > 0) { this.moves.push(move) }
		this.currentMove = null
		return move
	},
	mergeCols: function (order) {
		var move = this.currentMove = []

		for (var i = 0, len = this.colCount; i < len; i++) {
			this.mergeCol(i, order);
		}

		if (move.length > 0) { this.moves.push(move) }
		this.currentMove = null
		return move
	},

	/*
	 * 任意 cell 值为 0，或与相邻 cell 值相等即可以合并
	 */
	canMerge: function () {
		var numbers = this.numbers
		var num
		var rowCount = this.rowCount
		var colCount = this.colCount
		for (var row = 0, len = rowCount; row < len; row++) {
			for (var col = 0; col < colCount; col++) {
				num = numbers[row][col]
				if (num === 0) {
					return true
				}
				if (row > 0) {
					if (num === numbers[row - 1][col]) {
						return true
					}
				}
				if (col > 0) {
					if (num === numbers[row][col - 1]) {
						return true
					}
				}
			}
		}
		return false
	},

	/*
	 * @param {'asc'|'desc'} order - 'asc' 从小往大; 'desc' 从大往小
	 */
	mergeRow: function (row, order) {
		var colX = this.colCount
		var col1
		var col2
		var cell

		if (order === 'asc') {
			col1 = 0;
			col2 = col1 + 1;

			while (col2 < colX) {
				cell = this.mergeCell(row, col1, row, col2);
				col1 = cell[1];
				col2 = col2 + 1;
			}
		} else {
			col1 = colX - 1;
			col2 = col1 - 1;

			while (col2 >= 0) {
				cell = this.mergeCell(row, col1, row, col2);
				col1 = cell[1];
				col2 = col2 - 1;
			}
		}
	},
	mergeCol: function (col, order) {
		var rowX = this.rowCount
		var row1
		var row2
		var cell

		if (order === 'asc') {
			row1 = 0;
			row2 = row1 + 1;

			while (row2 < rowX) {
				cell = this.mergeCell(row1, col, row2, col);
				row1 = cell[0];
				row2 = row2 + 1;
			}
		} else {
			row1 = rowX - 1;
			row2 = row1 - 1;

			while (row2 >= 0) {
				cell = this.mergeCell(row1, col, row2, col);
				row1 = cell[0];
				row2 = row2 - 1;
			}
		}
	},

	/*
	 * cell_2 => cell_1
	 * 将 cell_2(row2, col2) 的值合并到 cell_1(row1, col1)
	 * 返回在经过操作后值为 0 可以用作后续 cell 合并目标的 cell 坐标
	 * @return {[{number} row, {number} col] | null}
	 */
	mergeCell: function (row1, col1, row2, col2) {
		var num1 = this.numbers[row1][col1]
		var num2 = this.numbers[row2][col2]

		if (num1 == 0) {
			if (num2 === 0) {
				return [row1, col1]
			} else {
				// move
				this.moveCell({
					from: [row2, col2, num2],
					to: [row1, col1, 0],
					result: num2
				})
				return [row1, col1]
			}
		} else {
			if (num2 === 0) {
				return [row1, col1]
			} else {
				if (num1 === num2) {
					// merge
					this.moveCell({
						from: [row2, col2, num2],
						to: [row1, col1, num1],
						result: num1 + num2
					})
					// 检测是否相邻，不相邻时返回中间的空 cell
					var distance = row2 - row1 + col2 - col1
					if (distance > 1) {
						if (row1 === row2) {
							return [row1, col1 + 1]
						} else {
							return [row1 + 1, col1]
						}
					} else if (distance < -1) {
						if (row1 === row2) {
							return [row1, col1 - 1]
						} else {
							return [row1 - 1, col1]
						}
					} else {
						return [row2, col2]
					}
				} else {
					// 检测两个 cell 是否紧邻，不相邻时移动 cell2
					var distance = row2 - row1 + col2 - col1
					if (distance > 1) {
						// move
						if (row1 === row2) {
							// same row
							this.moveCell({
								from: [row2, col2, num2],
								to: [row1, col1 + 1, 0],
								result: num2
							})
							return [row1, col1 + 1]
						} else {
							// same col
							this.moveCell({
								from: [row2, col2, num2],
								to: [row1 + 1, col1, 0],
								result: num2
							})
							return [row1 + 1, col1]
						}
					} else if (distance < -1) {
						// move
						if (row1 === row2) {
							this.moveCell({
								from: [row2, col2, num2],
								to: [row1, col1 - 1, 0],
								result: num2
							})
							return [row1, col1 - 1]
						} else {
							this.moveCell({
								from: [row2, col2, num2],
								to: [row1 - 1, col1, 0],
								result: num2
							})
							return [row1 - 1, col1]
						}
					} else {
						return [row2, col2]
					}
				}
			}
		}
	},

	/*
	 * @param {Step} step - {from: [row2, col2, num2], to: [row1, col1, num1]}
	 */
	moveCell: function (step) {
		var from = step.from
		var to = step.to
		this.currentMove.push(step)
		this.numbers[ from[0] ][ from[1] ] = 0
		this.numbers[ to[0] ][ to[1] ] = step.result
	}
}

module.exports = Numbers
},{}]},{},[1]);

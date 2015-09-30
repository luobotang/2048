require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Numbers() {
	this.numbers = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]]
	this.rowCount = 4
	this.colCount = 4
}

Numbers.prototype = {
	// callback(number, rowIndex, colIndex)
	forEach: function (callback) {
		if (typeof callback !== 'function') return
		this.numbers.forEach(function (row, rowIndex) {
			row.forEach(function (number, colIndex) {
				callback(number, rowIndex, colIndex)
			})
		})
	},
	forEachRow: function (callback) {
		if (typeof callback !== 'function') return
		this.numbers.forEach(function (row, rowIndex) {
			callback(row, rowIndex)
		})
	},
	// callback(col : array, colIndex : int)
	forEachCol: function (callback) {
		if (typeof callback !== 'function') return

		for (var colIndex = 0; colIndex < this.colCount; colIndex++) {
			var col = []
			for (var rowIndex = 0; rowIndex < this.rowCount; rowIndex++) {
				col.push(this.numbers[rowIndex][colIndex])
			}
			callback(col, colIndex)
		}
	},
	get: function (rowIndex, colIndex) {
		var row = this.numbers[rowIndex]
		return row ? row[colIndex] : null
	},
	/*
	 * 设置指定位置的数值，返回设置数值的相关信息
	 * @param {number} row
	 * @param {number} col
	 * @param {number} n
	 * @returns {object} {row {number}, col {number}, n {number}}
	 */
	set: function (row, col, n) {
		if (row >= 0 && row < this.rowCount &&
			col >= 0 && row < this.colCount) {
			this.numbers[row][col] = n
		}
		return {
			row: row,
			col: col,
			num: n
		}
	},
	hasZero: function () {
		try {
			this.forEach(function (n) {
				if (n === 0) throw new Error("found");
			})
		} catch (ex) {
			return true;
		}
		return false;
	},
	moveLeft: function () {
		var thisObj = this;
		this.forEachRow(function (row, rowIndex) {
			thisObj.mergeRow(row, rowIndex);
		});
		console.log("Move Left");
	},
	moveUp: function () {
		var thisObj = this;
		this.forEachCol(function (col, colIndex) {
			thisObj.mergeCol(col, colIndex);
		});
		console.log("Move Up");
	},
	moveRight: function () {
		var thisObj = this;
		this.forEachRow(function (row, rowIndex) {
			thisObj.mergeRow(row, rowIndex, false);
		});
		console.log("Move Right");
	},
	moveDown: function () {
		var thisObj = this;
		this.forEachCol(function (col, colIndex) {
			thisObj.mergeCol(col, colIndex, false);
		});
		console.log("Move Down");
	},
	canMerge: function () {
		var thisObj = this;
		try {
			this.forEachRow(function (row, rowIndex) {
				if (thisObj.canMergeArray(row)) throw new Error("can merge row: " + rowIndex);
			});
			this.forEachCol(function (col, colIndex) {
				if (thisObj.canMergeArray(col)) throw new Error("can merge col: " + colIndex);
			});
		} catch (ex) {
			return true;
		}
		return false;
	},
	canMergeArray: function (array) {
		var len = array.length,
			curr = 0,
			next = curr + 1;
		while (next < len) {
			var currNum = array[curr],
				nextNum = array[next];
			if (currNum === 0 || nextNum === 0) return true;
			if (currNum === nextNum) return true;
			curr = next;
			next = curr + 1;
		}
		return false;
	},
	mergeRow: function (row, rowIndex, ltr) {
		this.mergeArray(row, rowIndex, true, ltr);
	},
	mergeCol: function (col, colIndex, ltr) {
		this.mergeArray(col, colIndex, false, ltr);
	},

	// 根据 2048 规则，合并行或列的现有数字
	mergeArray: function (array, rowOrColIndex, isRow, ltr) {
		console.log("merge array: ", array.join(), " index: ", rowOrColIndex)

		ltr = ltr == null ? true : ltr

		var len = array.length
		var curr = ltr ? 0 : len - 1
		var next = ltr ? curr + 1 : curr - 1

		// !BUG 仔细检查代码逻辑，确保没有无限循环问题
		while (ltr ? next < len : next >= 0) {
			var currRowIndex = isRow ? rowOrColIndex : curr
			var currColIndex = isRow ? curr : rowOrColIndex
			var nextRowIndex = isRow ? rowOrColIndex : next
			var nextColIndex = isRow ? next : rowOrColIndex
			var currNum = this.numbers[currRowIndex][currColIndex]
			var nextNum = this.numbers[nextRowIndex][nextColIndex]

			if (nextNum === 0) {
				next = ltr ? next + 1 : next - 1
				continue
			}

			if (currNum === 0) {
				this.numbers[currRowIndex][currColIndex] = nextNum
				this.numbers[nextRowIndex][nextColIndex] = 0
				next = ltr ? curr + 1 : curr - 1
				continue
			} else if (nextNum === currNum) {
				this.numbers[currRowIndex][currColIndex] = currNum + currNum
				this.numbers[nextRowIndex][nextColIndex] = 0
			}

			curr = ltr ? curr + 1 : curr - 1
			next = ltr ? curr + 1 : curr - 1
		}
	}
}

module.exports = Numbers
},{}],2:[function(require,module,exports){
var $ = require('jquery')
var Game = require('./game')

$(function () {
	Game.init('#board')
	$('#btn-new-round').on('click', function () {
		Game.newRound()
	})
	$('#message').on('click', function () {
		this.hide()
	})
})
},{"./game":3,"jquery":"jquery"}],3:[function(require,module,exports){
var $ = require('jquery')
var Numbers = require('./Numbers')

var numbers
var running = false
var $el

function init(el) {
	$el = $('#board')
	$(document).on("keydown", onKeydown)
}

function newRound() {
	numbers = new Numbers()
	$("#message").hide()

	// 更新界面，生成两个随机数
	// todo: 将添加随机数的方法移到 Numbers 中，不再依赖界面显示情况，
	//       否则需要每次都更新界面。
	updateUI()
	showNumber(addRandomNumber())
	showNumber(addRandomNumber())

	running = true
}

// 检查并处理无法继续游戏的情况，若无法继续则结束当前一局游戏
function checkGameOver() {
	// 检查无法继续合并的情况
	if (!numbers.canMerge()) {
		GameOver();
	}
	// todo: 检查是否有 2048
}

function GameOver() {
	$("#message").text("Game Over!").show()
	running = false
	throw new Error('game over')
}

function onKeydown(e) {
	var key = e.which
	if (!running || key < 37 || key > 40) return

	e.preventDefault()
	switch (key) {
		case 37: numbers.moveLeft();  break; // left
		case 38: numbers.moveUp();    break; // up
		case 39: numbers.moveRight(); break; // right
		case 40: numbers.moveDown();  break; // down
	}
	try {
		updateUI()
		showNumber(addRandomNumber())
		checkGameOver()
	} catch (e) {
		// game over
	}
}

function updateUI() {
	numbers.forEach(function (num, rowIndex, colIndex) {
		var html = num === 0 ? "" : num,
			attr = (num === 0 ? "no" : num > 2048 ? "super" : num);
		$("#cell-" + rowIndex + "-" + colIndex)
			.html(html)
			.attr('num', attr);
	});
}

/*
 * @param {object} numberInfo - {row, col, n}
 */
function showNumber(numberInfo) {
	var num = numberInfo.num
	$('#cell-' + numberInfo.row + '-' + numberInfo.col).text(num).attr('num', num)
}

// 在随机的空闲位置添加 2 或 4
function addRandomNumber() {
	var pos = getCellPosition(getRandomFreeCell())
	var num = getRandom2or4()
	console.log("Add random number at [" + pos.row + ', ' + pos.col + ']: ' + num)
	return numbers.set(pos.row, pos.col, num)
}

function getRandomFreeCell() {
	// 空闲位置 num 属性为 no
	var cells = $el.find('[num="no"]')
	var count = cells.length
	if (count === 0) return GameOver()
	var rand = Math.floor(Math.random() * count)
	return cells[rand]
}

function getCellPosition(cell) {
	var $cell = $(cell)
	return {
		row: parseInt($cell.attr("data-row"), 10),
		col: parseInt($cell.attr("data-col"), 10),
	}
}

function getRandom2or4() {
	return Math.random() < 0.5 ? 2 : 4
}

module.exports = {
	init: init,
	newRound: newRound
}


},{"./Numbers":1,"jquery":"jquery"}],"jquery":[function(require,module,exports){
if (!window.jQuery) {
	throw new Error('no jQuery')
}
module.exports = window.jQuery
},{}]},{},[2]);

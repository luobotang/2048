var Game = (function ($) {

	// 内置数据对象
	var numbers, listening = false;

	function newRound() {
		// 新的数组
		numbers = new Numbers();
		// 更新界面，生成两个随机数
		// todo: 将添加随机数的方法移到 Numbers 中，不再依赖界面显示情况，
		//       否则需要每次都更新界面。
		renderUI();
		addRandomNumber();
		renderUI();
		addRandomNumber();
		renderUI();
		// 监听键盘事件
		if (!listening) {
			$('body').on("keydown", onKeydown);
			listening = true;
		}
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
		// todo
		$("#message").html("Game Over!").show();
		$(document).unbind("keydown", onKeydown);
		listening = false;
	}

	function onKeydown(e) {
		e.preventDefault();
		switch (e.keyCode) {
			case 37: // left
				numbers.moveLeft();
				afterMove();
				break;
			case 38: // up
				numbers.moveUp();
				afterMove();
				break;
			case 39: // right
				numbers.moveRight();
				afterMove();
				break;
			case 40: // down
				numbers.moveDown();
				afterMove();
				break;
			default:
				break;
		}
	}

	function afterMove() {
		renderUI();
		addRandomNumber();
		renderUI();
		checkGameOver();
	}

	function renderUI() {
		numbers.forEach(function (num, rowIndex, colIndex) {
			var html = num === 0 ? "" : num,
				className = "cell num-" + (num === 0 ? "no" : num > 2048 ? "super" : num);
			$("#cell-" + rowIndex + "-" + colIndex)
				.html(html)
				.removeClass()
				.addClass(className);
		});
	}

	// 在随机的空闲位置添加 2 或 4
	function addRandomNumber() {
		console.log("Add random number");
		var pos = getCellPosition(getRandomFreeCell());
		numbers.set(pos.row, pos.col, getRandom2or4());
	}

	function getRandomFreeCell() {
		// 空闲位置为 ".num-no"
		var cells = $("#board .num-no").toArray(),
			count = cells.length,
			randIndex = Math.floor(Math.random() * count);
		if (count === 0) {
			GameOver();
		}
		return cells[randIndex];
	}

	function getCellPosition(cell) {
		var $cell = $(cell);
		return {
			row: parseInt($cell.data("row"), 10),
			col: parseInt($cell.data("col"), 10),
		};
	}

	function getRandom2or4() {
		return Math.random() < 0.5 ? 2 : 4;
	}

	return {
		newRound: newRound
	};

})(jQuery);

// 2048 游戏中的数据对象
var Numbers = function () {
	this.numbers = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]];
	this.rowCount = 4;
	this.colCount = 4;
};

Numbers.prototype = {
	// callback(number, rowIndex, colIndex)
	forEach: function (callback) {
		if (!callback || !callback.call) return;
		this.numbers.forEach(function (row, rowIndex) {
			row.forEach(function (number, colIndex) {
				callback(number, rowIndex, colIndex);
			});
		});
	},
	forEachRow: function (callback) {
		if (!$.isFunction(callback)) return;
		this.numbers.forEach(function (row, rowIndex) {
			callback(row, rowIndex);
		});
	},
	// callback(col : array, colIndex : int)
	forEachCol: function (callback) {
		if (!$.isFunction(callback)) return;

		for (var colIndex = 0; colIndex < this.colCount; colIndex++) {
			var col = [];
			for (var rowIndex = 0; rowIndex < this.rowCount; rowIndex++) {
				col.push(this.numbers[rowIndex][colIndex]);
			}
			callback(col, colIndex);
		}
	},
	get: function (rowIndex, colIndex) {
		var row = this.numbers[rowIndex];
		return row ? row[colIndex] : null;
	},
	set: function (rowIndex, colIndex, number) {
		var row = this.numbers[rowIndex];
		if (row && typeof row[rowIndex] == 'number')
			row[colIndex] = number;
	},
	hasZero: function () {
		try {
			this.forEach(function (n) {
				if (n === 0) throw new Error("found");
			});
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
		console.log("merge array: ", array.join(), " index: ", rowOrColIndex);
		ltr = ltr == null ? true : ltr;
		var len = array.length,
			curr = ltr ? 0 : len - 1,
			next = ltr ? curr + 1 : curr - 1;

		// !BUG 仔细检查代码逻辑，确保没有无限循环问题
		while (ltr ? next < len : next >= 0) {
			var currRowIndex = isRow ? rowOrColIndex : curr,
				currColIndex = isRow ? curr : rowOrColIndex,
				nextRowIndex = isRow ? rowOrColIndex : next,
				nextColIndex = isRow ? next : rowOrColIndex,
				currNum = this.numbers[currRowIndex][currColIndex],
				nextNum = this.numbers[nextRowIndex][nextColIndex];
			if (nextNum === 0) {
				next = ltr ? next + 1 : next - 1;
				continue;
			} else {
				if (currNum === 0) {
					this.numbers[currRowIndex][currColIndex] = nextNum;
					this.numbers[nextRowIndex][nextColIndex] = 0;
					next = ltr ? curr + 1 : curr - 1;
					continue;
				} else if (nextNum === currNum) {
					this.numbers[currRowIndex][currColIndex] = currNum + currNum;
					this.numbers[nextRowIndex][nextColIndex] = 0;
				}
				curr = ltr ? curr + 1 : curr - 1;
				next = ltr ? curr + 1 : curr - 1;
				continue;
			}
		}
	}
};

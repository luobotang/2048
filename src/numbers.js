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
		for (var i = 0, len = this.rowCount; i < len; i++) {
			this.mergeRow(i, 'asc');
		}
	},
	moveUp: function () {
		for (var i = 0, len = this.colCount; i < len; i++) {
			this.mergeCol(i, 'asc');
		}
	},
	moveRight: function () {
		for (var i = 0, len = this.rowCount; i < len; i++) {
			this.mergeRow(i, 'desc');
		}
	},
	moveDown: function () {
		for (var i = 0, len = this.colCount; i < len; i++) {
			this.mergeCol(i, 'desc');
		}
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

	// TODO 简化逻辑，避免使用 forEachRow 方法
	canMergeRow: function (row) {
		var col1 = 0
		var col2 = col1 + 1
		
	},

	// TODO
	canMergeCol: function (col) {
		
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
				col1 = cell ? cell[1] : col2;
				col2 = col2 + 1;
			}
		} else {
			col1 = colX - 1;
			col2 = col1 - 1;

			while (col2 >= 0) {
				cell = this.mergeCell(row, col1, row, col2);
				col1 = cell ? cell[1] : col2;
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
				row1 = cell ? cell[0] : row2;
				row2 = row2 + 1;
			}
		} else {
			row1 = rowX - 1;
			row2 = row1 - 1;

			while (row2 >= 0) {
				cell = this.mergeCell(row1, col, row2, col);
				row1 = cell ? cell[0] : row2;
				row2 = row2 - 1;
			}
		}
	},

	/*
	 * cell_2 => cell_1
	 * 将 cell2(row2, col2) 的值合并到 cell1(row1, col1)
	 * 返回在经过操作后值为 0 可以用作后续 cell 合并目标的 cell 坐标
	 * @return {[{number} row, {number} col] | null}
	 */
	mergeCell: function (row1, col1, row2, col2) {
		var num1 = this.numbers[row1][col1]
		var num2 = this.numbers[row2][col2]
		// TODO BUG
		// 考虑两个要合并的 cell 间有空 cell 的情况！
		if (num1 == 0) {
			if (num2 === 0) {
				return [row1, col1]
			} else {
				// move
				this.numbers[row1][col1] = num2
				this.numbers[row2][col2] = 0
				return [row1, col1]
			}
		} else {
			if (num2 === 0) {
				return [row1, col1]
			} else {
				if (num1 === num2) {
					// merge
					this.numbers[row1][col1] = num1 + num2
					this.numbers[row2][col2] = 0
					return [row2, col2]
				} else {
					return [row2, col2]
				}
			}
		}
	}
}

module.exports = Numbers
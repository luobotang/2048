// 2048 游戏中的数据对象
var Numbers = function () {
	this.numbers = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]];
}

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
		if (!callback || !callback.call) return;
		this.numbers.forEach(function (row, rowIndex) {
			callback(row, rowIndex);
		});
	},
	// callback(col : array, colIndex : int)
	forEachCol: function (callback) {
		if (!callback || !callback.call) return;
		for (var colIndex = 0; colIndex < 4; colIndex++) {
			callback([0,0,0,0].map(function (zero, rowIndex) {
				return numbers[rowIndex][colIndex];
			}), colIndex);
		}
	},
	get: function (rowIndex, colIndex) {
		var row = this.numbers[rowIndex];
		return row ? row[colIndex] : null;
	},
	set: function (rowIndex, colIndex, number) {
		var row = this.numbers[rowIndex];
		row && typeof row[rowIndex] == 'number' && (row[colIndex] = number);
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
	canMove: function () {
		return this.canMoveLeft() ||
			this.canMoveUp() ||
			this.canMoveRight() ||
			this.canMoveDown();
	},
	canMoveLeft: function () {
		// todo
		return true;
	},
	canMoveUp: function () {
		// todo
		return true;
	},
	canMoveRight: function () {
		// todo
		return true;
	},
	canMoveDown: function () {
		// todo
		return true;
	},
	moveLeft: function () {
		// todo
		console.log("Move Left");
	},
	moveUp: function () {
		// todo
		console.log("Move Up");
	},
	moveRight: function () {
		// todo
		console.log("Move Right");
	},
	moveDown: function () {
		// todo
		console.log("Move Down");
	}
};

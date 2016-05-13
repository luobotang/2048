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
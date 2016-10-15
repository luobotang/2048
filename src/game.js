var $ = require('jquery')
var Keys = require('keys')
var Numbers = require('./numbers')
var MessageBox = require('./message-box')

var MOVE_ANIMATION_TIME = 200 // ms

function Game(el) {
	this.$el = $(el || '.game-2048-board')
	this.$board = this.$el
	this.msgBox = new MessageBox()

	this.initEvents()
}

$.extend(Game.prototype, {

	/* events */

	on: function () {
		this.$el.on.apply(this.$el, arguments)
	},
	off: function () {
		this.$el.off.apply(this.$el, arguments)
	},
	trigger: function () {
		this.$el.trigger.apply(this.$el, arguments)
	},

	initEvents: function () {
		$(document).on('keydown', $.proxy(this.onKeydown, this))
	},

	newRound: function () {
		this.numbers = new Numbers();
		this.moves = []

		this.msgBox.hide();

		this.renderNumbers();
		this.addRandomNumber();
		this.addRandomNumber();

		this.running = true;

		this.trigger('newRound')
	},

	// TODO bug 不能正确检测游戏结束情况
	isGameOver: function () {
		// 检查无法继续合并的情况
		if (!this.numbers.canMerge()) {
			this.running = false;
			this.msgBox.show("Game Over!");
			this.trigger('gameOver')
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
			case Keys.Left:
				move = this.numbers.moveLeft()
				break
			case Keys.Up:
				move = this.numbers.moveUp()
				break
			case Keys.Right:
				move = this.numbers.moveRight()
				break
			case Keys.Down:
				move = this.numbers.moveDown()
				break
		}

		// 没有产生任何变化时不做处理
		if (move && move.length > 0) {
			this.moves.push(move)
			this.showMove(move)

			// 等待动画完成
			this.actionTimer = setTimeout($.proxy(function () {
				this.actionTimer = null
				if (!this.isGameOver()) {
					this.trigger({
						type: 'move',
						moves: this.moves
					})
					this.addRandomNumber()
					this.isGameOver()
				}
			}, this), MOVE_ANIMATION_TIME);
		}
	},

	renderNumbers: function () {
		this.numbers.forEach($.proxy(function (num, row, col) {
			this.showNumber(row, col, num)
		}, this))
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
		var game = this
		var from = step.from
		var to = step.to
		var $cellFrom = this.getCell(from[0], from[1])
		var $cellFromClone = $cellFrom.clone().css('z-index', '1')
		var $cellTo = this.getCell(to[0], to[1])

		game.updateCell($cellFrom, 0)

		this.$board.append($cellFromClone)
		$cellFromClone.attr('data-row', to[0]).attr('data-col', to[1])

		setTimeout(function () {
			var result = step.result
			game.updateCell($cellTo, result)
			$cellFromClone.remove()
		}, MOVE_ANIMATION_TIME)
	},

	showNumber: function (row, col, num) {
		this.updateCell(this.getCell(row, col), num)
	},

	updateCell: function ($cell, num) {
		$cell.attr('num',
				num === 0 ?
					"no" :
					num > 2048 ? "super" : num
			)
			.find('i')
			.text(num === 0 ? "" : num)
	},

	addRandomNumber: function () {
		var pos = this.getCellPosition(this.getRandomFreeCell())
		var num = this.getRandomNumber()
		this.numbers.set(pos.row, pos.col, num)
		this.showNumber(pos.row, pos.col, num)
	},

	getRandomFreeCell: function () {
		// 空闲位置 num 属性为 no
		var cells = this.$board.find('[num="no"]')
		var count = cells.length
		var rand = Math.floor(Math.random() * count)
		return cells.eq(rand)
	},

	getCellPosition: function ($cell) {
		return {
			row: parseInt($cell.attr("data-row"), 10),
			col: parseInt($cell.attr("data-col"), 10)
		}
	},

	// 随机数为 2 或 4
	getRandomNumber: function () {
		return Math.random() > 0.5 ? 2 : 4
	},

	getCell: function (row, col) {
		return this.$board.find('.cell-' + row + '-' + col)
	}
})

module.exports = Game
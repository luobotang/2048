var $ = require('jquery')
var Numbers = require('./numbers')
var Keys = require('keys')

var numbers
var running = false
var $el

function init(el) {
	$el = $(el || '#board')
	$(document).on("keydown", onKeydown)
}

function newRound() {
	numbers = new Numbers()
	$("#message").hide()

	// 更新界面，生成两个随机数
	// TODO: 将添加随机数的方法移到 Numbers 中，不再依赖界面显示情况，
	//       否则需要每次都更新界面。
	updateUI()
	addRandomNumber()
	addRandomNumber()

	running = true;
}

// 检查并处理无法继续游戏的情况，若无法继续则结束当前一局游戏
function isGameOver() {
	// 检查无法继续合并的情况
	if (!numbers.canMerge()) {
		running = false;
		$("#message").text("Game Over!").show();
	}
	numbers.forEach(function (n) {
		if (n === 2048) {
			running = false;
			$("#message").text("Success! You got 2048!").show();
		}
	})
	return !running
}

function onKeydown(e) {
	var key = e.which
	if (!running || key < Keys.Left || key > Keys.Down) {
		return;
	}

	e.preventDefault();

	switch (key) {
		case Keys.Left:  numbers.moveLeft();  break;
		case Keys.Up:    numbers.moveUp();    break;
		case Keys.Right: numbers.moveRight(); break;
		case Keys.Down:  numbers.moveDown();  break;
	}

	updateUI()
	if (!isGameOver()) {
		addRandomNumber()
		isGameOver()
	}
}

function updateUI() {
	numbers.forEach(function (num, row, col) {
		showNumber(row, col, num)
	});
}

function showNumber(row, col, num) {
	$('#cell-' + row + '-' + col)
		.text(num === 0 ? "" : num)
		.attr('num', num === 0 ? "no" : num > 2048 ? "super" : num)
}

function addRandomNumber() {
	var pos = getCellPosition(getRandomFreeCell())
	var num = getRandomNumber()
	console.log("Add random number at [" + pos.row + ', ' + pos.col + ']: ' + num)
	numbers.set(pos.row, pos.col, num)
	showNumber(pos.row, pos.col, num)
}

function getRandomFreeCell() {
	// 空闲位置 num 属性为 no
	var cells = $el.find('[num="no"]')
	var count = cells.length
	var rand = Math.floor(Math.random() * count)
	return cells[rand]
}

function getCellPosition(cell) {
	var $cell = $(cell)
	return {
		row: parseInt($cell.attr("data-row"), 10),
		col: parseInt($cell.attr("data-col"), 10)
	};
}

// 随机数为 2 或 4
function getRandomNumber() {
	return Math.random() > 0.5 ? 2 : 4;
}

module.exports = {
	init: init,
	newRound: newRound
};
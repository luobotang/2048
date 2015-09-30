var Game = (function ($) {

	if (!$) throw new Error('require jQuery')

	var numbers
	var listening = false
	var $el = $('#board')

	function newRound() {
		numbers = new Numbers()
		$("#message").hide()

		// 更新界面，生成两个随机数
		// todo: 将添加随机数的方法移到 Numbers 中，不再依赖界面显示情况，
		//       否则需要每次都更新界面。
		updateUI()
		showNumber(addRandomNumber())
		showNumber(addRandomNumber())

		if (!listening) {
			$(document).on("keydown", onKeydown)
			listening = true
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
		$("#message").html("Game Over!").show()
		$(document).off("keydown", onKeydown)
		listening = false
		throw new Error('game over')
	}

	function onKeydown(e) {
		var key = e.which
		if (key < 37 || key > 40) return

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

	return {
		newRound: newRound
	}

})(window.jQuery);

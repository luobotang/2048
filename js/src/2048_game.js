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
			$(document).on("keydown", onKeydown);
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
			var html = num == 0 ? "" : num,
				className = "cell num-" + (num == 0 ? "no" : num > 2048 ? "super" : num);
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

	//////////////////////////////////////////////////////
	
	function getRandomNumberIn4() {
		return Math.floor(Math.random() * 4);
	}

	function getRandom2or4() {
		return Math.random() < 0.5 ? 2 : 4;
	}

	//////////////////////////////////////////////////////

	return {
		newRound: newRound
	};

})(jQuery);

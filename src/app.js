var $ = require('jquery')
var Game = require('./game')

$(function () {
	var game = new Game()
	var $moves = $('.game-moves')

	$('body').on('click', '.new-round', function () {
		game.newRound()
	})

	game.on('move', function (e) {
		$moves.text(e.moves.length)
	})

	game.on('newRound gameOver', function () {
		$moves.empty()
	})

	game.newRound()
})

if (location.protocol.indexOf('http') > -1 && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js', {scope: './'})
}
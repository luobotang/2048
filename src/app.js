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
var $ = require('jquery')

function MessageBox(el) {
	this.$el = $(el || '.message-box')
	var self = this
	this.$el.on('click', function () {
		self.hide()
	})
}

$.extend(MessageBox.prototype, {

	show: function (message) {
		this.$el.text(message).show()
	},

	hide: function () {
		this.$el.hide()
	}

})

module.exports = MessageBox
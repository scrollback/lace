var registerPlugin = require("./jquery.lace.js");

registerPlugin("progressbar", null, {

	/**
	 * Show a progress indicator.
	 * @constructor
	 */
	init: function() {
		var $progressbar = $(this.element);

		$progressbar = $(this.element).addClass("progressbar loading").appendTo("body");

		$.event.trigger("progressbarInited", [ $progressbar ]);
	},

	/**
	 * Set progress by percentage
	 * @constructor
	 * @param {Number} amount
	 */
	set: function(amount) {
		var $progressbar = $(this.element);

		amount = parseInt(amount);

		if (isNaN(amount)) {
			return;
		}

		$progressbar = ($progressbar.hasClass(".progressbar") && $progressbar.length) ? $progressbar : $(".progressbar");
		$progressbar.removeClass("loading").css({ "width": amount + "%" });

		$.event.trigger("progressbarSet", [ $progressbar, amount ]);
	},

	/**
	 * Dismiss progress indicator.
	 * @constructor
	 */
	dismiss: function() {
		var self = this,
			$progressbar = $(this.element);

		$progressbar = ($progressbar.hasClass(".progressbar") && $progressbar.length) ? $progressbar : $(".progressbar");

		self.set(100);

		setTimeout(function() {
			$progressbar.remove();
		}, 500);

		$.event.trigger("progressbarDismissed", [ $progressbar ]);
	}
});

var registerPlugin = require("./jquery.lace.js");

registerPlugin("progressbar", {
	parent: "body"
}, {

	/**
	 * Show a progress indicator.
	 * @constructor
	 */
	init: function() {
		var self = this,
			settings = self.settings,
			$progressbar = $(self.element);

		$progressbar.removeClass("loading").addClass("progressbar").width(0).appendTo(settings.parent);

		$progressbar.data("progressbarInterval", setInterval(function() {
			var width = parseInt(($progressbar.width() / $progressbar.parent().width()) * 100) || 0;

			width += (100 - Math.round(width).toFixed(2)) * Math.random() * 0.5;

			$progressbar.width(width + "%");
		}, 1000));

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

		clearInterval($progressbar.data("progressbarInterval"));

		$progressbar.removeClass("loading").width(amount + "%");

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

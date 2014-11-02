var registerPlugin = require("./jquery.lace.js");

registerPlugin("progressbar", {
	parent: "body"
}, {

	/**
	 * Show a progress indicator.
	 * @constructor
	 */
	init: function() {
		var settings = this.settings,
			$progressbar = $(this.element);

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
	dismiss: function(element) {
		var $element = element ? $(element) : this.element ? $(this.element).closest(".progressbar") : $(".progressbar");

		if (!$element.length) {
			return;
		}

		this.set(100);

		setTimeout(function() {
			$element.remove();
		}, 500);

		$.event.trigger("progressbarDismissed", [ $element ]);
	}
});

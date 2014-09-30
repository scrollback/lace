var registerPlugin = require("./jquery.lace.js");

registerPlugin("progressbar", null, {

	/**
	 * Show a progress indicator.
	 * @constructor
	 */
	init: function() {
		var $progressbar = $(".progressbar");

		if ($progressbar.length) {
			$progressbar.remove();
		}

		$progressbar = $(this.element).empty().addClass("progressbar loading");
		$progressbar.appendTo("body");

		$.event.trigger("progressbarInited", [ $progressbar ]);
	},

	/**
	 * Set progress by percentage
	 * @constructor
	 * @param {Number} amount
	 */
	set: function(amount) {
		var $progressbar;

		amount = parseInt(amount);

		if (isNaN(amount)) {
			return;
		}

		$progressbar = $(".progressbar");
		$progressbar.removeClass("loading").css({ "width": amount + "%" });

		$.event.trigger("progressbarSet", [ $progressbar, amount ]);
	},

	/**
	 * Dismiss progress indicator.
	 * @constructor
	 */
	dismiss: function() {
		var $progressbar = $(".progressbar");

		setTimeout(function() {
			$progressbar.remove();
		}, 500);

		$.event.trigger("progressbarDismissed", [ $progressbar ]);
	}
});

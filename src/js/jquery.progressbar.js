//var registerPlugin = require("./jquery.lace.js");

registerPlugin("progressbar", null, {

	/**
	 * Show a progress indicator.
	 * @constructor
	 */
	init: function() {
		var $progress = $(".progressbar");

		if ($progress.length) {
			$progress.remove();
		}

		$progress = $(this.element).empty().addClass("progressbar loading");
		$progress.appendTo("body");
	},

	/**
	 * Set progress by percentage
	 * @constructor
	 * @param {Number} amount
	 */
	set: function(amount) {
		amount = parseInt(amount);

		if (isNaN(amount)) {
			return;
		}

		var $progress = $(".progressbar");

		$progress.removeClass("loading").css({ "width": amount + "%" });
	},

	/**
	 * Dismiss progress indicator.
	 * @constructor
	 */
	dismiss: function() {
		var $progress = $(".progressbar");

		setTimeout(function() {
			$progress.remove();
		}, 500);
	}
});

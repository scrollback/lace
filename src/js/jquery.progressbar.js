var registerPlugin = require("./jquery.lace.js");

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

		$.event.trigger("progressbarInited", [ $progress ]);
	},

	/**
	 * Set progress by percentage
	 * @constructor
	 * @param {Number} amount
	 */
	set: function(amount) {
		var $progress;

		amount = parseInt(amount);

		if (isNaN(amount)) {
			return;
		}

		$progress = $(".progressbar");
		$progress.removeClass("loading").css({ "width": amount + "%" });

		$.event.trigger("progressbarSet", [ $progress, amount ]);
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

		$.event.trigger("progressbarDismissed", [ $progress ]);
	}
});

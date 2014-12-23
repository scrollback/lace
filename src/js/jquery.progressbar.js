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

		// The "loading" class animates the progressbar with CSS3 animations
		// Since we're initializing with JS, don't use the same CSS3 animation
		$progressbar.removeClass("loading").addClass("progressbar").width(0).appendTo(settings.parent);

		// Randomize the progress value
		$progressbar.data("progressbarInterval", setInterval(function() {
			var width = parseInt(($progressbar.width() / $progressbar.parent().width()) * 100) || 0;

			width += (100 - Math.round(width).toFixed(2)) * Math.random() * 0.5;

			$progressbar.width(width + "%");
		}, 1000));

		// Progressbar is now initialized
		$.event.trigger("progressbarInited", [ $progressbar ]);
	},

	/**
	 * Set progress by percentage
	 * @constructor
	 * @param {Number} amount
	 */
	set: function(element, amount) {
		var $element = (element && amount) ? $(element) : this.element ? $(this.element).closest(".progressbar") : $(".progressbar");

		// Element doesn't exist
		if (!$element.length) {
			return;
		}

		// The first argument is not element, but a value to set
		if (!amount && (typeof element === "number" || /^[0-9]+%$/.test(element))) {
			amount = element;
		}

		// Parse the value as an integer
		amount = parseInt(amount);

		// The value is not a number
		if (isNaN(amount)) {
			return;
		}

		// Clear the interval which sets randomized progress
		clearInterval($element.data("progressbarInterval"));

		// Remove CSS3 animation by removing "loading" class and set the progress
		$element.removeClass("loading").width(amount + "%");

		// Progressbar value is now set
		$.event.trigger("progressbarSet", [ $element, amount ]);
	},

	/**
	 * Dismiss progress indicator.
	 * @constructor
	 */
	dismiss: function(element) {
		var $element = element ? $(element) : this.element ? $(this.element).closest(".progressbar") : $(".progressbar");

		// Element doesn't exist
		if (!$element.length) {
			return;
		}

		// Set the progress to "100%"
		this.set(100);

		// Remove the element from DOM
		setTimeout(function() {
			$element.remove();

			// Progressbar is now dismissed
			$.event.trigger("progressbarDismissed", [ $element ]);
		}, 500);
	}
});

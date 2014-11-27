var registerPlugin = require("./jquery.lace.js");

registerPlugin("modal", {
	dismiss: true,
	backdrop: true,
	parent: "body"
}, {

	/**
	 * Show a modal dialog.
	 * @constructor
	 */
	init: function() {
		var self = this,
			settings = self.settings,
			$modal = $(self.element).addClass("modal"),
			$backdrop = (settings.backdrop) ? $("<div>").addClass("backdrop") : null;

		// There can be only one modal, so dismiss others
		self.dismiss(true);

		// Add event listener to buttons which can dismiss the modal
		$modal.find(".modal-remove").on("click", self.dismiss);

		// Add the modal to the DOM
		// We are attaching it early so we can get width and height
		// Which is needed for calculating position for centering
		$modal.appendTo(settings.parent);

		// Center the modal in the window
		$modal.css({
			"margin-top": $modal.outerHeight() / -2,
			"margin-left": $modal.outerWidth() / -2
		});

		// Add a dark semi-transparent backdrop if specified
		if ($backdrop) {
			if (settings.dismiss) {
				$backdrop.on("click", self.dismiss);
			}

			$backdrop.appendTo(settings.parent);
		}

		// Add event listener to dismiss the modal
		$(document).on("keydown.modal", function(e) {
			if (e.keyCode === 27 && settings.dismiss) {
				self.dismiss();
			}
		});

		// Modal is now initialized
		$.event.trigger("modalInited", [ $(self.element) ]);
	},

	/**
	 * Dismiss modal dialog.
	 * @constructor
	 */
	dismiss: function(replacing) {
		var $element = $(".modal, .backdrop");

		// Element doesn't exist
		if (!$element.length) {
			return;
		}

		// Remove the element from DOM
		if ($.fn.velocity) {
			$element.not(".modal").velocity("fadeOut", 150);
			$element.not(".backdrop").velocity({
				opacity: 0,
				scale: (replacing === true) ? "120%" : "70%"
			}, 150, function() {
				$element.remove();
			});
		} else {
			$element.remove();
		}

		// Remove event listeners
		$(document).off("keydown.modal");

		// Modal is now dismissed
		if (replacing === true) {
			$.event.trigger("previousModalDismissed", [ $element ]);
		} else {
			$.event.trigger("modalDismissed", [ $element ]);
		}
	}
});

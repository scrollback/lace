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
		self.dismiss(true, function() {
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
				if (e.which === 27 && settings.dismiss) {
					self.dismiss();
				}
			});

			// Modal is now initialized
			$.event.trigger("modalInited", [ $(self.element) ]);
		});
	},

	/**
	 * Dismiss modal dialog.
	 * @constructor
	 */
	dismiss: function(replacing, callback) {
		var $modal = $(".modal"),
			$backdrop = $(".backdrop"),
			triggerEvents = function(callback) {
				var type = (replacing === true) ? "previousModalDismissed" : "modalDismissed";

				// Modal is now dismissed
				$.event.trigger(type, [ $modal ]);

				// Remove event listeners
				$(document).off("keydown.modal");

				return callback();
			};

		callback = (typeof callback === "function") ? callback : function() {};

		// Element doesn't exist
		if (!($modal.length || $backdrop.length)) {
			return callback();
		}

		// Remove the element from DOM
		if ($.fn.velocity) {
			if ($backdrop.length) {
				$backdrop.velocity("fadeOut", 150, function() {
					$backdrop.remove();
				});
			}

			$modal.velocity({
				opacity: 0,
				scale: (replacing === true) ? "120%" : "70%"
			}, 150, function() {
				$modal.remove();

				triggerEvents(callback);
			});
		} else {
			$backdrop.remove();
			$modal.remove();

			triggerEvents(callback);
		}
	}
});

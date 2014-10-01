var registerPlugin = require("./jquery.lace.js");

registerPlugin("modal", {
	dismiss: true,
	backdrop: true
}, {

	/**
	 * Show a modal dialog.
	 * @constructor
	 */
	init: function() {
		var self = this,
			settings = self.settings,
			$modal = $(self.element).wrapAll("<div>").addClass("modal"),
			$backdrop = (settings.backdrop) ? $("<div>").addClass("backdrop") : null;

		self.dismiss();

		$modal.find(".modal-remove").on("click", self.dismiss);

		$modal.appendTo("body");

		$modal.css({
			"margin-top": $modal.outerHeight() / -2,
			"margin-left": $modal.outerWidth() / -2
		});

		if ($backdrop) {
			if (settings.dismiss) {
				$backdrop.on("click", self.dismiss);
			}

			$backdrop.appendTo("body");
		}

		$(document).off("keydown.modal");
		$(document).on("keydown.modal", function(e) {
			if (e.keyCode === 27 && settings.dismiss) {
				self.dismiss();
			}
		});

		$.event.trigger("modalInited", [ $(self.element) ]);
	},

	/**
	 * Dismiss modal dialog.
	 * @constructor
	 */
	dismiss: function() {
		var $element = $(".modal, .backdrop");

		if ($.fn.velocity) {
			$element.velocity("fadeOut", 150, function() {
				$(this).remove();
			});
		} else {
			$element.remove();
		}

		$.event.trigger("modalDismissed", [ $element ]);
	}
});

//var registerPlugin = require("./jquery.lace.js");

registerPlugin("modal", {
	dismiss: true,
	backdrop: true
}, {

	/**
	 * Show a modal dialog.
	 * @constructor
	 */
	init: function() {
		var _this = this,
			settings = _this.settings,
			$modal = $(_this.element).wrapAll("<div>").addClass("modal"),
			$backdrop = (settings.backdrop) ? $("<div>").addClass("backdrop") : null;

		_this.dismiss();

		$modal.find(".modal-remove").on("click", _this.dismiss);

		$modal.appendTo("body");

		$modal.css({
			"margin-top": $modal.outerHeight() / -2,
			"margin-left": $modal.outerWidth() / -2
		});

		if ($backdrop) {
			$backdrop.appendTo("body");
		}

		$(document).off("keydown.modal");
		$(document).on("keydown.modal", function(e) {
			if (e.keyCode === 27 && settings.dismiss) {
				_this.dismiss();
			}
		});
	},

	/**
	 * Dismiss modal dialog.
	 * @constructor
	 */
	dismiss: function() {
		$(".modal").remove();
		$(".backdrop").remove();
	}
});

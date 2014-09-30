//var registerPlugin = require("./jquery.lace.js");

registerPlugin("alertbar", {
	type: "info"
}, {
	/**
	 * Show an alert message.
	 * @constructor
	 */
	init: function() {
		var self = this,
			settings = self.settings,
			$container = $(".alert-container"),
			$wrapper = $("<div>").addClass("alert-bar " + settings.type),
			$elem = $(self.element).addClass("alert-content"),
			$alert = settings.id ? $("#" + settings.id) : $();

		$elem = $wrapper.append(
			$elem,
			$("<span>").addClass("alert-remove")
		).attr("id", settings.id || ("alert-bar-" + new Date().getTime()));

		if (!$container.length) {
			$container = $("<div>").addClass("alert-container");
			$container.appendTo("body");
		}

		if ($alert.length && $alert.hasClass("alert-bar")) {
			$alert.replaceWith($elem);
		} else {
			$alert = $elem;

			$alert.find(".alert-remove").on("click", function() {
				self.dismiss(settings.id);
			});

			$alert.appendTo($container);
		}

		if (settings.timeout && typeof settings.timeout === "number") {
			setTimeout(function() {
				self.dismiss(settings.id);
			}, settings.timeout);
		}
	},

	/**
	 * Dismiss alert message(s).
	 * @constructor
	 * @param {String} [id]
	 */
	dismiss: function(id) {
		var $element = id ? $("#" + id) : $(".alert-bar"),
			$container = $(".alert-container");

		if ($.fn.velocity) {
			$element.velocity("fadeOut", 150, function() {
				$element.remove();
			})
		} else {
			$element.remove();
		}

		if (!$container.children().length) {
			$container.remove();
		}
	}
});

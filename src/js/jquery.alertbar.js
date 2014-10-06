var registerPlugin = require("./jquery.lace.js");

registerPlugin("alertbar", {
	type: "info",
	parent: "body"
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
			$container.appendTo(settings.parent);
		}

		if ($alert.length && $alert.hasClass("alert-bar")) {
			$alert.replaceWith($elem);
		} else {
			$alert = $elem;

			$alert.find(".alert-remove").on("click", function() {
				self.dismiss();
			});

			$alert.appendTo($container);
		}

		if (settings.timeout && typeof settings.timeout === "number") {
			setTimeout(function() {
				self.dismiss();
			}, settings.timeout);
		}

		$.event.trigger("alertbarInited", [ $(self.element) ]);
	},

	/**
	 * Dismiss alert message(s).
	 * @constructor
	 * @param {String} [element]
	 */
	dismiss: function(element) {
		var $element = element ? $(element) : this.element ? $(this.element).closest(".alert-bar") : $(".alert-bar"),
			$container = $(".alert-container");

		if ($.fn.velocity) {
			$element.velocity({
				opacity: 0
			}, 150).velocity({
				height: 0,
				paddingTop: 0,
				paddingBottom: 0,
				marginTop: 0,
				marginBottom: 0
			}, 150, function() {
				$(this).remove();
			});
		} else {
			$element.remove();
		}

		if (!$container.children().length) {
			$container.remove();
		}

		$.event.trigger("alertbarDismissed", [ $element ]);
	}
});

//var registerPlugin = require("./jquery.lace.js");

registerPlugin("popover", {
	theme: "light"
}, {

	/**
	 * Show a popover.
	 * @constructor
	 */
	init: function() {
		var self = this,
			settings = self.settings,
			$popover = $(self.element).wrapAll("<div>").addClass("popover-body theme-" + settings.theme),
			$layer = $("<div>").addClass("popover-layer"),
			$origin = $(self.settings.origin),
			spacetop, spacebottom, spaceleft, spaceright;

		if (!$origin.length) {
			return;
		}

		self.dismiss();

		spacetop = $origin.offset().top - $(document).scrollTop() + $origin.height();
		spacebottom = $(window).height() - spacetop;
		spaceleft = $origin.offset().left - $(document).scrollLeft() + ( $origin.width() / 2 );
		spaceright = $(window).width() - spaceleft;

		$layer.on("click", self.popover.hide).appendTo("body");

		$popover.appendTo("body");

		if ($popover.outerWidth() >= spaceleft) {
			$popover.addClass("arrow-left");
			spaceleft = $origin.width() / 2;
		} else if ($popover.outerWidth() >= spaceright) {
			$popover.addClass("arrow-right");
			spaceleft = $(window).width() - ( $origin.width() / 2 ) - $popover.outerWidth();
		} else {
			spaceleft = spaceleft - ( $popover.outerWidth() / 2 );
		}

		if ($origin.height() >= $(window).height()) {
			$popover.addClass("popover-bottom");
			spacetop = $(window).height() / 2;
		} else if ($popover.outerHeight() >= spacebottom) {
			$popover.addClass("popover-top");
			spacetop = spacetop - $origin.height() - $popover.outerHeight();
		} else {
			$popover.addClass("popover-bottom");
		}

		$popover.css({
			"top": spacetop,
			"left": spaceleft
		});

		$.event.trigger("popoverInited", [ $(self.element) ]);
	},

	/**
	 * Hide popover.
	 * @constructor
	 */
	dismiss: function() {
		var $element = $(".popover-body, .popover-layer");

		if ($.fn.velocity) {
			$element.velocity("fadeOut", 150, function() {
				$(this).remove();
			});
		} else {
			$element.remove();
		}

		$.event.trigger("popoverDismissed", [ $element ]);
	}
});

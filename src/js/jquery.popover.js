var registerPlugin = require("./jquery.lace.js");

registerPlugin("popover", {
	parent: "body"
}, {

	/**
	 * Show a popover.
	 * @constructor
	 */
	init: function() {
		var self = this,
			settings = self.settings,
			$popover = $(self.element).addClass("popover-body"),
			$layer = $("<div>").addClass("popover-layer"),
			$origin = $(self.settings.origin),
			winheight, winwidth,
			originoffset, originheight, originwidth,
			popoverheight, popoverwidth,
			spacetop, spacebottom, spaceleft, spaceright;

		if (!$origin.length) {
			return;
		}

		self.dismiss();

		winheight = $(window).height();
		winwidth = $(window).width();

		originoffset = $origin.offset();
		originheight = $origin.height();
		originwidth = $origin.width();

		spacetop = originoffset.top - $(document).scrollTop() + originheight;
		spacebottom = winheight - spacetop;
		spaceleft = originoffset.left - $(document).scrollLeft() + ( originwidth / 2 );
		spaceright = winwidth - spaceleft;

		$layer.on("click", self.dismiss).appendTo(settings.parent);

		$popover.appendTo(settings.parent);

		popoverwidth = $popover.outerWidth();
		popoverheight = $popover.outerHeight();

		if (spaceleft <= (popoverwidth / 2)) {
			$popover.addClass("arrow-left");
			spaceleft = originwidth / 2;
			spaceleft = originwidth / 2;
		} else if (spaceright <= (popoverwidth / 2)) {
			$popover.addClass("arrow-right");
			spaceleft = winwidth - ( originwidth / 2 ) - popoverwidth;
		} else {
			spaceleft = spaceleft - ( popoverwidth / 2 );
		}

		if (originheight >= winheight) {
			$popover.addClass("popover-bottom");
			spacetop = winheight / 2;
		} else if (popoverheight >= spacebottom) {
			$popover.addClass("popover-top");
			spacetop = spacetop - originheight - popoverheight;
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
	 * Dismiss popover.
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

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
			$origin = $(self.settings.origin),
			$popover = $(self.element).addClass("popover-body"),
			winheight, winwidth,
			originoffset, originheight, originwidth,
			popoverheight, popoverwidth,
			spacetop, spacebottom, spaceleft, spaceright,
			id = new Date().getTime();

		if (!$origin.length) {
			return;
		}

		if ($origin.data("popover")) {
			return;
		}

		$popover.data("id", id);
		$popover.data("origin", $origin);
		$origin.data("popover", $popover);

		winheight = $(window).height();
		winwidth = $(window).width();

		originoffset = $origin.offset();
		originheight = $origin.outerHeight();
		originwidth = $origin.outerWidth();

		spacetop = originoffset.top - $(document).scrollTop() + originheight;
		spacebottom = winheight - spacetop;
		spaceleft = originoffset.left - $(document).scrollLeft() + ( originwidth / 2 );
		spaceright = winwidth - spaceleft;

		$(document).on("click.popover-" + id, function(e) {
			if (!$(e.target).closest($popover).length) {
				self.dismiss();
			}
		}).on("keydown.popover-" + id, function(e) {
			if (e.keyCode === 27) {
				self.dismiss();
			}
		});

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
	dismiss: function(element) {
		var $element = element ? $(element) : this.element ? $(this.element).closest(".popover-body") : $(".popover-body"),
			$el, id;

		if (!$element.length) {
			return;
		}

		for (var i = 0, l = $element.length; i < l; i++) {
			$el = $element.eq(i);

			id = $el.data("id");

			$(document).off("click.popover-" + id + " keydown.popover-" + id);
			$($el.data("origin")).data("popover", false);
		}

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

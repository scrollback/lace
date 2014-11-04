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

		// If origin doesn't exist, return
		if (!$origin.length) {
			return;
		}

		// A popover is already shown for the current origin
		// Probably the user is trying to close the popover
		if ($origin.data("popover")) {
			return;
		}

		// Add info to popover so that we can properly remove events
		$popover.data("id", id);
		$popover.data("origin", $origin);

		// Add popover info to origin so that we can know when it has a popover
		$origin.data("popover", $popover);

		// Get various height, width and offset values
		winheight = $(window).height();
		winwidth = $(window).width();

		originoffset = $origin.offset();
		originheight = $origin.outerHeight();
		originwidth = $origin.outerWidth();

		spacetop = originoffset.top - $(document).scrollTop() + originheight;
		spacebottom = winheight - spacetop;
		spaceleft = originoffset.left - $(document).scrollLeft() + ( originwidth / 2 );
		spaceright = winwidth - spaceleft;

		// Add event listeners to the document for dismissing the popover
		// Namspace the event listeners so we can safely remove them later
		$(document).on("click.popover-" + id, function(e) {
			// Dismiss when clicked on outside of popover
			if (!$(e.target).closest($popover).length) {
				self.dismiss();
			}
		}).on("keydown.popover-" + id, function(e) {
			// Dismiss when escape (27) is pressed
			if (e.keyCode === 27) {
				self.dismiss();
			}
		});

		// Add the popover to the DOM
		// We are attaching it early so we can get width and height
		// Which is needed for calculating position
		$popover.appendTo(settings.parent);

		popoverwidth = $popover.outerWidth();
		popoverheight = $popover.outerHeight();
		
		if ( originoffset.left < 0 || originoffset.left > winwidth) {
			console.log("outside of screen");
			$popover.addClass('origin-outside');
			$popover.addClass('arrow-y');
			if (originoffset.top < winheight / 2) {
				$popover.addClass("arrow-top");
			} else {
				$popover.addClass("arrow-bottom");
			}
			
			if (originoffset.left < 0) {
				$popover.addClass('popover-right');
				spaceleft = 0;
			} else {
				$popover.addClass('popover-left');
				spaceleft = winwidth - popoverwidth - 10;
			}
		} else if (originoffset.top < 0 || originoffset.top > winheight) {
			console.log("outside of screen");
			$popover.addClass('origin-outside');
			$popover.addClass('arrow-x');
			if (originoffset.left < winwidth / 2) {
				$popover.addClass("arrow-left");
			} else {
				$popover.addClass("arrow-right");
			}
			
			if (originoffset.top < 0) {
				spacetop = 0;
				$popover.addClass('popover-bottom');
			} else {
				spacetop = winheight - popoverheight - 10;
				$popover.addClass('popover-top');
			}
		} else {//origin is inside visible area
			if (spaceleft <= (popoverwidth / 2)) {
				$popover.addClass("arrow-x arrow-left");
				spaceleft = originwidth / 2;
			} else if (spaceright <= (popoverwidth / 2)) {
				$popover.addClass("arrow-x arrow-right");
				spaceleft = winwidth - ( originwidth / 2 ) - popoverwidth;
			} else {
				spaceleft = spaceleft - ( popoverwidth / 2 );
			}

			// Popover should be towards bottom or top?
			// The arrow points to the opposite direction
			if (popoverheight >= spacebottom) {
				$popover.addClass("popover-top");
				spacetop = spacetop - originheight - popoverheight;
			} else {
				$popover.addClass("popover-bottom");
				spacetop = (originheight <= winheight) ? spacetop : (winheight / 2);
			}
		}
		
		// Add the necessary positioning styles
		$popover.css({
			"top": spacetop,
			"left": spaceleft
		});
		
		// Popover is now initialized
		$.event.trigger("popoverInited", [ $(self.element) ]);
	},
	
	/**
	 * Dismiss popover.
	 * @constructor
	 */
	dismiss: function(element) {
		var $element = element ? $(element) : this.element ? $(this.element).closest(".popover-body") : $(".popover-body"),
			$el, id;

		// The element doesn't exist
		if (!$element.length) {
			return;
		}

		// Loop through all elements and cleanup one by one
		for (var i = 0, l = $element.length; i < l; i++) {
			$el = $element.eq(i);

			id = $el.data("id");

			$(document).off("click.popover-" + id + " keydown.popover-" + id);
			$($el.data("origin")).data("popover", false);
		}

		// Remove the element from DOM
		if ($.fn.velocity) {
			$element.velocity("fadeOut", 150, function() {
				$(this).remove();
			});
		} else {
			$element.remove();
		}

		// Popover is now dismissed
		$.event.trigger("popoverDismissed", [ $element ]);
	}
});

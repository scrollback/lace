//var registerPlugin = require("./jquery.lace.js");

registerPlugin("popover", null, {

	/**
	 * Show a popover.
	 * @constructor
	 */
	init: function() {
		var _this = this,
			$popover = $(_this.element).wrapAll("<div>").addClass("popover-body"),
			$layer = $("<div>").addClass("popover-layer"),
			$origin = $(_this.settings.origin),
			spacetop, spacebottom, spaceleft, spaceright;

		if (!$origin.length) {
			return;
		}

		_this.dismiss();

		spacetop = $origin.offset().top - $(document).scrollTop() + $origin.height();
		spacebottom = $(window).height() - spacetop;
		spaceleft = $origin.offset().left - $(document).scrollLeft() + ( $origin.width() / 2 );
		spaceright = $(window).width() - spaceleft;

		$layer.on("click", _this.popover.hide).appendTo("body");
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
	},

	/**
	 * Hide popover.
	 * @constructor
	 */
	dismiss: function() {
		$(".popover-body").remove();
		$(".popover-layer").remove();
	}
});

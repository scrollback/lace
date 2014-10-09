var registerPlugin = require("./jquery.lace.js");

registerPlugin("multientry", null, {
	/**
	 * Initialize multientry.
	 * @constructor
	 */
	init: function() {
		var self = this;

		$(document).off("blur.multientry");
		$(document).on("blur.multientry", ".multientry", function() {
			self.add($(this), $(this).children().last().text());
		});

		$(document).off("keydown.multientryitem");
		$(document).on("keydown.multientryitem", ".multientry .item", function(e) {
			if (e.keyCode === 13 || e.keyCode === 32 || e.keyCode === 188) {
				e.preventDefault();
				self.add($(this).parent(".multientry"), $(this).text());
			} else if (e.keyCode === 8 && $(this).text().match(/^\s*$/)) {
				e.preventDefault();

				$(this).text($(this).prev().find(".item-text").text());
				$(this).prev().remove();

				if ($.fn.setCursorEnd) {
					$(this).setCursorEnd();
				}
			}
		});

		$(document).off("paste.multientryitem");
		$(document).on("paste.multientryitem", ".multientry .item", function(e) {
			e.preventDefault();

			var items = e.originalEvent.clipboardData.getData("Text");

			self.add($(this).parent(".multientry"), items);
		});

		$(document).off("click.multientryremove");
		$(document).on("click.multientryremove", ".multientry .item-remove", function() {
			self.remove($(this).parent().text());
		});

		$(document).off("click.multientry");
		$(document).on("click.multientry", ".multientry", function() {
			$(this).children().last().focus();
		});

		$.event.trigger("multientryInited", [ $(self.element) ]);
	},

	/**
	 * Create the markup required for multientry.
	 * @constructor
	 * @return {Object}
	 */
	create: function() {
		return $("<div>").addClass("multientry").append(
			$("<span>").addClass("item").attr({ "contenteditable": true })
		).multientry();
	},

	/**
	 * Add items to multientry.
	 * @constructor
	 * @param {String} element
	 * @param {String[]} content
	 */
	add: function(element, content) {
		var $element = (element && content) ? $(element) : this.element ? $(this.element) : $(".multientry");

		if (!content && (typeof element === "string" || element instanceof Array)) {
		    content = element;
		}

		if (!content) {
			return;
		}

		if (!(content instanceof Array)) {
			content = content.split(/[\s,]+/);
		}

		// Process the items to remove any spaces or new lines
		content = content.join(" ").replace(/(?:\r\n|\r|\n)/g, " ").split(/[\s,]+/);

		// Only have unique items
		content = content.filter(function(value, index, self) {
			return self.indexOf(value) === index;
		});

		content.forEach(function(text) {
			if (!text.match(/^\s*$/)) {
				$("<span>")
				.addClass("item done")
				.append($("<span>").addClass("item-text").text(text.trim()))
				.append($("<span>").addClass("item-remove"))
				.insertBefore(($element.children().last()).empty());
			}
		});

		$.event.trigger("multientryElementAdded", [ $element, content ]);
	},

	/**
	 * Remove items from multientry.
	 * @constructor
	 * @param {String[]} [content]
	 */
	remove: function(element, content) {
		var $element = (element && content) ? $(element) : this.element ? $(this.element) : $(".multientry");

		if (!content && (typeof element === "string" || element instanceof Array)) {
			content = element;
		}

		if (!content) {
			return;
		}

		if (!(content instanceof Array)) {
			content = content.split(/[\s,]+/);
		}

		content.forEach(function(text) {
			if (!text.match(/^\s*$/) ) {
				$element.find(".item-text").filter(function() {
					return $(this).text().trim() === text.trim();
				}).parent(".item").remove();
			}
		});

		$.event.trigger("multientryElementRemoved", [ $element, content ]);
	},

	/**
	 * Get items from multientry.
	 * @constructor
	 * @param {String} [element]
	 * @return {String[]}
	 */
	items: function(element) {
		var $element = element ? $(element) : this.element ? $(this.element) : $(".multientry"),
			elems = $element.find(".item-text"),
			items = new Array(elems.length);

		for (var i = 0; i < elems.length; i++) {
			items[i] = $(elems[i]).text();
		}

		return items;
	}
});

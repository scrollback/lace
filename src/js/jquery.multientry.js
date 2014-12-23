var registerPlugin = require("./jquery.lace.js");

registerPlugin("multientry", null, {
	/**
	 * Initialize multientry.
	 * @constructor
	 */
	init: function() {
		var self = this;

		// Add event listeners for mutlientry to the document
		$(document).off("blur.multientry").on("blur.multientry", ".multientry", function() {
			// When focus moves out of multientry, add the text to multientry
			self.add(this, $(this).children().last().text());
		}).off("keydown.multientryitem").on("keydown.multientryitem", ".multientry .item", function(e) {
			var range, selection,
				$this = $(this);

			if (e.which === 13 || e.which === 32 || e.which === 188) {
				// Return (13), space (32) or comma (188) pressed
				// Prevent default action and add the text to multientry
				e.preventDefault();

				self.add($this.parent(".multientry"), $this.text());
			} else if (e.which === 8 && $this.text().match(/^\s*$/)) {
				// Backspace (8) pressed and text is non-space character
				// Prevent default action and make previous text editable
				e.preventDefault();

				$this.text($this.prev().find(".item-text").text());
				$this.prev().remove();

				// Move cursor to end of input
				if (document.createRange) {
					range = document.createRange();
					range.selectNodeContents(this[0]);
					range.collapse(false);

					selection = window.getSelection();
					selection.removeAllRanges();
					selection.addRange(range);
				} else if (document.selection) {
					range = document.body.createTextRange();
					range.moveToElementText(this[0]);
					range.collapse(false);
					range.select();
				}
			}
		}).off("paste.multientryitem").on("paste.multientryitem", ".multientry .item", function(e) {
			// Text is pasted into multientry
			// Prevent default action and manually add the clipboard text
			e.preventDefault();

			var items = e.originalEvent.clipboardData.getData("Text");

			self.add($(this).parent(".multientry"), items);
		}).off("click.multientryremove").on("click.multientryremove", ".multientry .item-remove", function() {
			// Remove the multientry item
			self.remove($(this).parent().text());
		}).off("click.multientry").on("click.multientry", ".multientry", function() {
			// Focus the editable part of multientry
			$(this).children().last().focus();
		});

		// Multientry is now initialized
		$.event.trigger("multientryInited", [ $(self.element) ]);
	},

	/**
	 * Create the markup required for multientry.
	 * @constructor
	 * @return {Object}
	 */
	create: function() {
		// Create and initialize as multientry
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

		// The first argument is not element, but content to add
		if (!content && (typeof element === "string" || element instanceof Array)) {
			content = element;
		}

		// Element doesn't exist
		if (!$element.length) {
			return;
		}

		// No content given
		if (!content) {
			return;
		}

		// If content is plain text, then split into an array
		if (!(content instanceof Array)) {
			content = content.split(/[\s,]+/);
		}

		// Process the items to remove any spaces or new lines
		content = content.join(" ").replace(/(?:\r\n|\r|\n)/g, " ").split(/[\s,]+/);

		// Only have unique items
		content = content.filter(function(value, index, self) {
			return self.indexOf(value) === index;
		});

		// Add each word as a new multientry item
		content.forEach(function(text) {
			if (!text.match(/^\s*$/)) {
				$("<span>")
				.addClass("item done")
				.append($("<span>").addClass("item-text").text(text.trim()))
				.append($("<span>").addClass("item-remove"))
				.insertBefore(($element.children().last()).empty());
			}
		});

		// New multientry items are now added
		$.event.trigger("multientryElementAdded", [ $element, content ]);
	},

	/**
	 * Remove items from multientry.
	 * @constructor
	 * @param {String[]} [content]
	 */
	remove: function(element, content) {
		var $element = (element && content) ? $(element) : this.element ? $(this.element) : $(".multientry");

		// The first argument is not element, but content to remove
		if (!content && (typeof element === "string" || element instanceof Array)) {
			content = element;
		}

		// Element doesn't exist
		if (!$element.length) {
			return;
		}

		// No content given
		if (!content) {
			return;
		}

		// If content is plain text, then split into an array
		if (!(content instanceof Array)) {
			content = content.split(/[\s,]+/);
		}

		// Find and remove multientry items containing same word
		content.forEach(function(text) {
			if (!text.match(/^\s*$/) ) {
				$element.find(".item-text").filter(function() {
					return $(this).text().trim() === text.trim();
				}).parent(".item").remove();
			}
		});

		// Multientry items are now removed
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
			items = [];

		// Element doesn't exist
		if (!$element.length) {
			return;
		}

		// Get the items from the multientry
		for (var i = 0; i < elems.length; i++) {
			items.push($(elems[i]).text());
		}

		// Return the items
		return items;
	}
});

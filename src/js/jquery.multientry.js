"use strict";

var registerPlugin = require("./jquery.lace.js");

registerPlugin("multientry", null, {
    /**
     * Initialize multientry.
     */
    init: function() {
        var self = this,
            $element = self.element ? $(self.element) : $(".multientry");

        // Add event listeners for mutlientry
        $element.on("blur.multientry", function() {
            var $entry = $(this).find(".multientry-input");

            // When focus moves out of multientry, add the text to multientry
            self.add($entry.text());

            $entry.empty();
        }).on("click.multientry", function(e) {
            var $close = $(e.target).closest(".multientry-segment-remove");

            if ($close.length) {
                // Remove the multientry item
                self.remove($close.parent().text());
            }

            // Focus the editable part of multientry
            $(this).find(".multientry-input").focus();
        }).on("keydown.multientry", ".multientry-input", function(e) {
            var range, selection,
                $this = $(this);

            if (e.which === 13 || e.which === 32 || e.which === 188) {
                // Return (13), space (32) or comma (188) pressed
                // Prevent default action and add the text to multientry
                e.preventDefault();

                self.add($this.text());

                $this.empty();
            } else if (e.which === 8 && $this.text().match(/^\s*$/)) {
                // Backspace (8) pressed and text is non-space character
                // Prevent default action and make previous text editable
                e.preventDefault();

                $this.text($this.prev().find(".multientry-segment-text").text());
                $this.prev().remove();

                // Move caret to end of input
                if (document.createRange) {
                    range = document.createRange();
                    range.selectNodeContents($(this).get(0));
                    range.collapse(false);

                    selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                } else if (document.selection) {
                    range = document.body.createTextRange();
                    range.moveToElementText($(this).get(0));
                    range.collapse(false);
                    range.select();
                }
            }
        }).on("paste.multientry", ".multientry-input", function(e) {
            // Text is pasted into multientry
            // Prevent default action and manually add the clipboard text
            e.preventDefault();

            var items = e.originalEvent.clipboardData.getData("Text");

            self.add(items);
        });

        // Multientry is now initialized
        $.event.trigger("multientryInited", [ $element ]);
    },

    /**
     * Cleanup multientry.
     */
    destroy: function() {
        var $element = this.element ? $(this.element) : $(".multientry");

        // The element doesn't exist
        if (!$element.length) {
            return;
        }

        // Remove event listeners
        $element.off("blur.multientry click.multientry keydown.multientry paste.multientry");
    },

    /**
     * Create the markup required for multientry.
     * @return {Object}
     */
    create: function() {
        // Create and initialize as multientry
        return $("<div>").addClass("multientry").append(
            $("<span>").attr({
                tabindex: 1,
                contenteditable: true
            }).addClass("multientry-item multientry-input")
        ).multientry();
    },

    /**
     * Add items to multientry.
     * @param {String[]} content
     */
    add: function(content) {
        var $element = this.element ? $(this.element) : $(".multientry"),
            items;

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

        // Get already existing items
        items = this.items();

        // Add each word as a new multientry item
        content.forEach(function(text) {
            text = text.trim();

            // Don't add the item if it's already in the list
            if (!text || (items.indexOf(text) > -1)) {
                return;
            }

            $("<span>")
            .addClass("multientry-item multientry-segment")
            .append($("<span>").addClass("multientry-segment-text").text(text))
            .append($("<span>").addClass("multientry-segment-remove"))
            .insertBefore($element.find(".multientry-input"));
        });

        // New multientry items are now added
        $.event.trigger("multientryElementAdded", [ $element, content ]);
    },

    /**
     * Remove items from multientry.
     * @param {String[]} [content]
     */
    remove: function(content) {
        var $element = this.element ? $(this.element) : $(".multientry");

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
            text = text.trim();

            if (!text) {
                return;
            }

            $element.find(".multientry-segment-text").filter(function() {
                return $(this).text().trim() === text;
            }).parent(".multientry-item").remove();
        });

        // Multientry items are now removed
        $.event.trigger("multientryElementRemoved", [ $element, content ]);
    },

    /**
     * Get items from multientry.
     * @param {Boolean} entered
     * @return {String[]}
     */
    items: function(entered) {
        var $element = this.element ? $(this.element) : $(".multientry"),
            items = [];

        // Element doesn't exist
        if (!$element.length) {
            return;
        }

        // Get the items from the multientry
        $element.find(".multientry-segment-text").each(function() {
            items.push($(this).text());
        });

        // Include entered text also
        if (entered === true) {
            items.push($element.find(".multientry-input").text());
        }

        // Return the items
        return items;
    }
});

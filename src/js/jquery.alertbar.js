"use strict";

var registerPlugin = require("./jquery.lace.js");

registerPlugin("alertbar", {
    type: "info",
    parent: "body"
}, {
    /**
     * Show an alert message.
     */
    init: function() {
        var self = this,
            settings = self.settings,
            $alert = settings.id ? $("#" + settings.id) : $(),
            $container = $(".alertbar-container"),
            $wrapper = $("<div>").addClass("alertbar " + settings.type),
            $elem = $wrapper.append(
                $(self.element).addClass("alertbar-content"),
                $("<span>").addClass("alertbar-remove")
            ).attr("id", settings.id || ("alertbar-" + new Date().getTime()));

        // If a container doesn't exist, create a new one
        if (!$container.length) {
            $container = $("<div>").addClass("alertbar-container");
            $container.appendTo(settings.parent);
        }

        // If an alertbar with same ID exists, remove it
        if ($alert.length && $alert.hasClass("alertbar")) {
            $alert.remove();
        }

        $elem.appendTo($container);

        // Add a close button to dismiss the alertbar
        $elem.on("click.alertbar", ".alertbar-remove", function() {
            self.dismiss();
        });

        // If a timeout is given, hide the alertbar after the given period
        if (settings.timeout && typeof settings.timeout === "number") {
            setTimeout(function() {
                self.dismiss();
            }, settings.timeout);
        }

        // Alertbar is now initialized
        $.event.trigger("alertbarInited", [ $(self.element) ]);
    },

    /**
     * Cleanup alertbar.
     */
    destroy: function() {
        var $element = this.element ? $(this.element) : $(".alertbar").find(".alertbar-content");

        // The element doesn't exist
        if (!$element.length) {
            return;
        }

        $element.removeClass("alertbar-content");
    },

    /**
     * Dismiss alert message(s).
     */
    dismiss: function() {
        var self = this,
            $element = self.element ? $(self.element).closest(".alertbar") : $(".alertbar"),
            $container = $(".alertbar-container"),
            cleanup = function() {
                self.destroy();
                $element.remove().removeClass("out");

                // No alertbars left, safe to remove the container
                if (!$container.children().length) {
                    $container.remove();
                }

                // Alertbar is now dismissed
                $.event.trigger("alertbarDismissed", [ $(self.element) ]);
            };

        // Element doesn't exist
        if (!$element.length) {
            return;
        }

        // Remove the lement from DOM
        $element.addClass("out");

        setTimeout(function() {
            cleanup();
        }, 300);
    }
});

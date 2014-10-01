/**
 * @fileOverview - jQuery plugin boilerplate.
 * @author - Satyajit Sahoo <satya@scrollback.io>
 * @requires - jQuery
 */

function registerPlugin(pluginName, defaults, methods) {

	(function($, window, document, undefined) {

		function Plugin(element, options) {
			this.element = element;

			// Set plugin options
			this.settings = $.extend({}, defaults, options);

			this._defaults = defaults;
			this._name = pluginName;

			// Initialize only if called with an element
			if (element) {
				this.init();
			}
		}

		$.extend(Plugin.prototype, methods);

		$.fn[pluginName] = function(options) {
			var args = arguments,
				returns, instance;

			if (options === undefined || typeof options === "object") {
				return this.each(function() {
					if (!$.data(this, "plugin_" + pluginName)) {
						$.data(this, "plugin_" + pluginName, new Plugin(this, options));
					}
				});
			} else if (typeof options === "string" && options !== "init" && !(/^_/).test(options)) {
				this.each(function() {
					instance = $.data(this, "plugin_" + pluginName);

					if (instance instanceof Plugin && typeof instance[options] === "function") {
						returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
					}

					if (options === "destroy") {
						$.data(this, "plugin_" + pluginName, null);
					}
				});

				return returns !== undefined ? returns : this;
			}
		};

		$[pluginName] = function(element, options) {
			var $element = element ? $(element) : $("<div>"),
				args = arguments;

			// Check if plugin called with a method instead of an element
			if (!options && typeof element === "string" && typeof methods[element] === "function") {
				return methods[element].apply(new Plugin(), Array.prototype.slice.call(args, 1));
			} else {
				return $element[pluginName](options);
			}
		};

	})(jQuery, window, document);
}

if (typeof define === "function" && define.amd) {
	// Define as AMD module
	define(function() {
		return registerPlugin;
	});
} else if (typeof module !== "undefined" && module.exports) {
	// Export to CommonJS
	module.exports = registerPlugin;
} else {
	window.registerPlugin = registerPlugin;
}

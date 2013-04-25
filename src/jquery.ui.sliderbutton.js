/*jslint white: true vars: true browser: true todo: true */
/*jshint camelcase:true, plusplus:true, forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, maxerr:100, white:false, onevar:false */
/*global jQuery:true $:true */

/* jQuery UI Slider Button 2.0.1
 * http://github.com/j-ulrich/jquery-sliderbutton
 *
 * Copyright (c) 2013 Jochen Ulrich <jochenulrich@t-online.de>
 * Licensed under the MIT license (MIT-LICENSE.txt).
 */

/**
 * @file jQuery UI Slider Button
 * @version 2.0.0
 * @copyright 2013 Jochen Ulrich
 * @license MIT (MIT-LICENSE.txt)
 */

(function($) {
	"use strict";
	
	/**
	 * Constructs a UI sliderbutton.
	 * @name sliderbutton
	 * @public
	 * @function
	 * @memberOf jQuery.ju
	 */
	$.widget("ju.sliderbutton",
	
	/**
	 * @lends jQuery.ju.sliderbutton.prototype
	 */
	{
		
		// Options
		/**
		 * Default values of the options.
		 * @since 1.0
		 */
		options: {
			text: "activate",
			direction: "right",
			tolerance: 1,
			releaseToActivate: true,
			opacity: function(value) {
				return 1.0-(value/50.0);
			}
		},
		
		/**
		 * Checks if the slider is in the position for an activation and
		 * if it is, triggers the "activate" event.
		 * @param {Object} event - The event object provided by the event callbacks
		 * of the jQuery UI Slider (e.g. start, stop, etc.). 
		 * @param {Object} ui - The ui object provided by the event callbacks
		 * of the jQuery UI Slider (e.g. start, stop, etc.). Needs to provide
		 * the current value of the slider as the property "value".
		 * @private
		 * @author julrich
		 * @since 2.0.0
		 */
		_checkSliderPosAndActivate: function(event, ui) {
			var self = this;
			if ( (self.activated === false)
					&& ((self.options.direction === "right" && ui.value >= (100-self.options.tolerance))
					||	(self.options.direction === "left" && ui.value <= (0+self.options.tolerance))) ) {
				self._trigger("activate", event, ui);
				self.activated = true;
			}
		},
		
		/**
		 * Constructor for UI sliderbuttons.
		 * @private
		 * @author julrich
		 * @since 1.0
		 */
		_create: function() {
			var self = this;
			
			self.element.empty();
			self.element.addClass("ju-sliderbutton");
			if (self.options.disabled === true) {
				self.element.addClass("ui-state-disabled");
			}
			var text = $('<span></span>').addClass("ju-sliderbutton-text").text(self.options.text);
			var slider = $('<div></div>').addClass("ju-sliderbutton-slider");
			var handle = $('<div></div>').addClass("ui-slider-handle");
			slider.append(handle);
			self.element.append(text);
			self.element.append(slider);
			var startValue = 0;
			if (self.options.direction === "left") {
				self.element.addClass("ju-sliderbutton-left");
				startValue = 100;
			}
			
			$.extend(self, {
				slider: slider,
				handle: handle,
				text: text,
				activated: false // Prevents multiple activations for the same slide
			});

			// Create and configure the jQuery UI slider
			slider.slider({
				animate: true,
				value: startValue,
				disabled: self.options.disabled,
				slide: function(event, ui) {
					var allowed = self._trigger("slide", event, ui);
					if (allowed !== false) {
						self.text.css("opacity",self.options.opacity((self.options.direction === "left"?(100-ui.value):ui.value)));
						if (self.options.releaseToActivate === false) {
							self._checkSliderPosAndActivate(event, ui);
						}
					}
					return allowed;
				},
				stop: function(event, ui) {
					if (self.options.releaseToActivate !== false) {
						self._checkSliderPosAndActivate(event, ui);
					}
					self._trigger("stop", event, ui);
					self._reset("fast");
				},
				start: function(event, ui) {
					return self._trigger("start", event, ui);
				}
			});
			slider.find('.ui-slider-handle').unbind('keydown').unbind('keyup');
		},
		
		/**
		 * Resets the slider, ensuring that the handle moves into/is in idle position.
		 * @param {Numeric|String|Null} [animationDuration] - If given and not <code>null</code>,
		 * the resetting is performed asynchronously using jQuery's <code>.animate()</code> function.
		 * <i>animationDuration</i> then defines the duration of the animation. If not given or
		 * <code>null</code>, the resetting is performed instantly.
		 * @private
		 * @author julrich
		 * @since 1.0
		 */
		_reset: function(animationDuration) {
			var self = this;
			self.activated = false;
			
			var resetValue;
			if (self.options.direction === "right") {
				resetValue = 0;
			}
			else if (self.options.direction === "left") {
				resetValue = 100;
			}
			
			/**
			 * Sets the UI slider value to the resetValue to synchronize it with the handle position
			 * @requires resetValue
			 * @inner
			 * @author julrich
			 * @since 1.0
			 */
			function resetSliderValue() {
				self.slider.slider("value", resetValue);
			}
			
			if ( animationDuration === undefined || animationDuration === null || (typeof animationDuration !== "number" && typeof animationDuration !== "string") ) {
				self.handle.css("left", resetValue+"%");
				resetSliderValue();
				self.text.css("opacity",self.options.opacity(0));
			}
			else {
				self.handle.animate({left: resetValue+"%"}, animationDuration, resetSliderValue);
				self.text.animate({opacity: self.options.opacity(0)}, animationDuration);
			}

		},
		
		/**
		 * Restores the element to it's original state.
		 * @author julrich
		 * @since 1.0
		 */
		destroy: function() {
			var self = this;
			self.slider.slider("destroy");
			self.element.empty();
			self.element.removeClass("ju-sliderbutton ju-sliderbutton-left");
		},
		
		/**
		 * Changes an option.
		 * @param {String} option - name of the option to be set.
		 * @param value - new value for the option.
		 * @private
		 * @author julrich
		 * @since 1.0
		 */
		_setOption: function(option, value) {
			var self = this;
			$.Widget.prototype._setOption.apply( self, arguments );
			
			switch(option) {
			case "text":
				self.text.text(value);
				break;
			case "disabled":
				if (value === true) {
					self.slider.slider("disable").removeClass("ui-state-disabled");
					self.element.addClass("ui-state-disabled");
					self.element.attr("disabled", true);
					self.text.css("opacity","");
				}
				else if (value === false) {
					self.slider.slider("enable");
					self.element.attr("disabled", false);
					self.element.removeClass("ui-state-disabled");
				}
				break;
			case "direction":
				if (value === "right") {
					self.element.removeClass("ju-sliderbutton-left");
				}
				else if (value === "left") {
					self.element.addClass("ju-sliderbutton-left");
				}
				self._reset();
				break;
			default:
				break;
			}
		}

	});
	
}(jQuery));

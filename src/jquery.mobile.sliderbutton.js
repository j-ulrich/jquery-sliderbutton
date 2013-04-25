/*jslint white: true vars: true browser: true todo: true */
/*jshint camelcase:true, plusplus:true, forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, maxerr:100, white:false, onevar:false */
/*global jQuery:true $:true */

/* jQuery Mobile Slider Button 2.0.1
 * http://github.com/j-ulrich/jquery-sliderbutton
 *
 * Copyright (c) 2013 Jochen Ulrich <jochenulrich@t-online.de>
 * Licensed under the MIT license (MIT-LICENSE.txt).
 */

/**
 * @file jQuery Mobile Slider Button
 * @version 2.0.0
 * @copyright 2013 Jochen Ulrich
 * @license MIT (MIT-LICENSE.txt)
 */

(function($) {
	"use strict";

	/**
	 * Constructs a mobile sliderbutton.
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
			disabled: false,
			mini: false,
			direction: "right",
			tolerance: 5,
			releaseToActivate: true,
			opacity: function(value) {
				return 1.0-(value/50.0);
			}
		},
		
		/**
		 * Calculates the current value (i.e. position) of the slider.
		 * @returns {Number} The current value of the slider in the range 0-100
		 * @private
		 * @author julrich
		 * @since 2.0.0.
		 */
		_value: function() {
			var self = this;
			return Math.round(self.handle.position().left / self.handle.parent().width() * 100);
		},
		
		/**
		 * Checks if the slider is in the position for an activation and
		 * if it is, triggers the "activate" event.
		 * @private
		 * @author julrich
		 * @since 2.0.0
		 */
		_checkSliderPosAndActivate: function() {
			var self = this,
				value = self._value();
			if ( (self.activated === false)
					&& ((self.options.direction === "right" && value >= (100-self.options.tolerance))
					||	(self.options.direction === "left" && value <= (0+self.options.tolerance))) ) {
				self._trigger("activate", null, {value: value});
				self.activated = true;
			}
		},

		/**
		 * Constructor for mobile sliderbuttons.
		 * @private
		 * @author julrich
		 * @since 1.0
		 */
		_create: function() {
			var self = this;
			
			self.element.empty();
			self.element.addClass("ju-sliderbutton");
			
			var startValue = 0;
			if (self.options.direction === "left") {
				startValue = 100;
			}
			
			var text = $('<span></span>').addClass("ju-sliderbutton-text").text(self.options.text);
			var slider = $('<input></input>').addClass("ju-sliderbutton-input")
				.attr("min",0).attr("max",100).attr("step",1).attr("value",startValue);
			self.element.append(text);
			self.element.append(slider);
			slider.slider();
			var handle = self.element.find('.ui-slider-handle');
			handle.attr("title","");
			
			$.extend( self, {
				slider: slider,
				handle: handle,
				text: text,
				dragging: false, // Used to determine whether we have to pay attention to global vmouseup events
				tryingToDrag: false,
				lastVal: 0, // Remember last value to prevent triggering "slide" multiple times for the same value
				activated: false // Prevents multiple activations for the same slide
			});

			self._setOption("mini", self.options.mini);
			self._setOption("direction", self.options.direction);
			self._setOption("disabled", self.options.disabled);

			// Disable key control
			handle.add(self.element).unbind("keyup").unbind("keydown");
			
			handle.add(document).bind("vmousemove", function(event) {
				if (self.tryingToDrag && (self.options.disabled || self.element.attr('disabled'))) {
					self._resetSlider();
				}
				if (self.dragging) {
					self.handle.attr("title","");
					var value = self._value();

					// Prevent triggering "slide" again if the value didn't change
					if (value === self.lastVal) {
						return true;
					}
					self.lastVal = value;
					
					var allowed = self._trigger("slide", null, {value: value});
					if (allowed !== false) {
						self.text.css("opacity",self.options.opacity((self.options.direction === "left"?(100-value):value)));
						if (self.options.releaseToActivate === false) {
							self._checkSliderPosAndActivate();
						}
					}
					else {
						self._resetSlider();
					}
					return allowed;
				}
			});
			
			handle.bind("vmousedown", function(event) {
				self.tryingToDrag = true;
				if (!self.dragging && !self.options.disabled && !self.element.attr('disabled')) {
					var allowed = self._trigger("start", null, {value: self._value()});
					if (allowed !== false) {
						self.dragging = true;
						self.activated = false;
					}
					return allowed;
				}
			});
			handle.add(document).bind("vmouseup", function(event) {
				self.tryingToDrag = false;
				if (self.dragging) {
					if (self.options.releaseToActivate !== false) {
						self._checkSliderPosAndActivate();
					}
					self._trigger("stop", null, {value: self._value()});
					self._reset("fast");
					self.dragging = false;
				} else {
					self._resetSlider();
				}
			});
			
			
		},
		
		/**
		 * Forces the slider handle into idle position.
		 * @private
		 * @author julrich
		 * @since 1.0
		 */
		_resetSlider: function() {
			var self = this;
			
			// Prevent that the handle is moved
			if (self.options.direction === "right") {
				self.handle.css("left", "0%");
			}
			else if (self.options.direction === "left") {
				self.handle.css("left", "100%");
			}
			self.activated = false;
			if (self.options.direction === "right") {
				self.slider.val(0);
				self.lastVal = 0;
			}
			else if (self.options.direction === "left") {
				self.slider.val(100);
				self.lastVal = 100;
			}
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

			var resetValue;
			if (self.options.direction === "right") {
				resetValue = 0;
			}
			else if (self.options.direction === "left") {
				resetValue = 100;
			}

			if (animationDuration === undefined || animationDuration === null) {
				self._resetSlider();
				self.text.css("opacity",self.options.opacity(0));
			}
			else {
				self.handle.animate({left: resetValue+"%"}, animationDuration, $.proxy(self._resetSlider, self));
				self.text.animate({opacity: self.options.opacity(0)}, animationDuration);
			}
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
			case "mini":
				self.element.toggleClass("ju-sliderbutton-mini",value);
				self.slider.slider("option", "mini", value).slider("refresh");
				break;
			case "disabled":
				if (value === true) {
					self.element.addClass("ui-disabled ui-state-disabled");
					self.element.attr("disabled", true);
					self.element.attr("aria-disabled", true);
					self.text.css("opacity","");
					self._resetSlider();
				}
				else if (value === false) {
					self.element.removeClass("ui-disabled ui-state-disabled");
					self.element.attr("disabled", false);
					self.element.attr("aria-disabled", false);
				}
				break;
			case "direction":
				if (value === "right") {
					self.element.removeClass("ju-sliderbutton-left");
				}
				else if (value === "left") {
					self.element.addClass("ju-sliderbutton-left");
				}
				self._resetSlider();
				break;
			default:
				break;
			}
		}

	});
	
}(jQuery));

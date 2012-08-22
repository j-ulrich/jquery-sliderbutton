/*
 * jQuery Mobile Slider Button 1.1
 * http://github.com/j-ulrich/jquery-sliderbutton
 *
 * Copyright (c) 2012 Jochen Ulrich <jochenulrich@t-online.de>
 * Licensed under the MIT license (MIT-LICENSE.txt).
 */

(function($) {
	$.widget("mobile.sliderbutton", {
		
		// Options
		options: {
			text: "slide to unlock",
			disabled: false,
			mini: false,
			direction: "right",
			tolerance: 5,
			opacity: function(value) {
				return 1.0-(value/50.0);
			}
		},
		
		_create: function() {
			var self = this;
			
			self.element.empty();
			self.element.addClass("ui-sliderbutton");
			
			var startValue = 0;
			if (self.options.direction === "left") {
				startValue = 100;
			}
			
			var text = $('<span></span>').addClass("ui-sliderbutton-text").text(self.options.text);
			var slider = $('<input></input>').addClass("ui-sliderbutton-input")
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
					var value = Math.round(parseInt(handle.css("left")) / parseInt(handle.parent().css("width")) * 100);

					var allowed = self._trigger("slide", null, {value: value});
					if (allowed !== false) {
						self.text.css("opacity",self.options.opacity((self.options.direction === "left"?(100-value):value)));
						if ( (self.activated === false) && ((self.options.direction === "right" && value >= (100-self.options.tolerance))
								|| (self.options.direction === "left" && value <= (0+self.options.tolerance))) ) {
							self._trigger("activate");
							self.activated = true;
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
					var allowed = self._trigger("start");
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
					var allowed = self._trigger("stop");
					if (allowed !== false) {
						self._reset("fast");
					}
					self.dragging = false;
					return allowed;
				} else {
					self._resetSlider();
				}
			});
			
			
		},
		
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
			}
			else if (self.options.direction === "left") {
				self.slider.val(100);
			}
		},
		
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
				self.handle.css("left", resetValue+"%");
				self._resetSlider();
				self.text.css("opacity",self.options.opacity(0));
			}
			else {
				self.handle.animate({left: resetValue+"%"}, animationDuration, $.proxy(self._resetSlider, self));
				self.text.animate({opacity: self.options.opacity(0)}, animationDuration);
			}
		},
		
		_setOption: function(option, value) {
			var self = this;
			$.Widget.prototype._setOption.apply( self, arguments );
			
			switch(option) {
			case "text":
				self.text.text(value);
				break;
			case "mini":
				self.element.toggleClass("ui-sliderbutton-mini",value);
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
					self.element.removeClass("ui-sliderbutton-left");
				}
				else if (value === "left") {
					self.element.addClass("ui-sliderbutton-left");
				}
				self._resetSlider();
				break;
			default:
				break;
			}
		},

	});
	
}(jQuery));

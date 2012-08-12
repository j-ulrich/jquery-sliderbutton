/*
 * jQuery Mobile Slider Button 1.0
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
				self.element.addClass("ui-sliderbutton-left");
				startValue = 100;
			}
			var text = $('<span></span>').addClass("ui-sliderbutton-text").text(self.options.text);
			var slider = $('<input></input>').addClass("ui-sliderbutton-input")
				.attr("min",0).attr("max",100).attr("step",1).attr("value",startValue);
			self.element.append(text);
			self.element.append(slider);
			slider.slider({
				mini: self.options.mini
			});
			var handle = self.element.find('.ui-slider-handle');
			handle.attr("title","");
			
			$.extend( self, {
				slider: slider,
				handle: handle,
				text: text,
				dragging: false, // Used to determine whether we have to pay attention to global vmouseup events
				activated: false, // Prevents multiple activations for the same slide
				resetting: false // Prevents infinite recursion when resetting
			});

			slider.bind("change", function(event) {
				self.handle.attr("title","");
				var value = slider.val();
				
				if ( (self.options.direction === "right" && value === 0) || (self.options.direction === "left" && value === 100) ) {
					// Resetting is finished
					self.resetting = false;
				}
				if ( self.options.disabled || self.element.attr('disabled') ) {
//					self.disable();
					self._resetSlider();
					return false;
				}

				var allowed = self._trigger("slide", event, {value: value});
				if (allowed !== false) {
					self.text.css("opacity",self.options.opacity((self.options.direction === "left"?(100-value):value)));
					if ( (self.activated === false) && ((self.options.direction === "right" && value >= (100-self.options.tolerance))
							|| (self.options.direction === "left" && value <= (0+self.options.tolerance))) ) {
						self._trigger("activate", event, {value: value});
						self.activated = true;
					}
				}
				else {
					self._resetSlider();
				}
				return allowed;
			});
			
			handle.bind("vmousedown", function(event) {
				self.dragging = true;
				self.resetting = false;
				self.activated = false;
				self._trigger("start", event, self.element);
			});
			handle.add(document).bind("vmouseup", function(event) {
				if (self.dragging) {
					var allowed = self._trigger("stop", event, self.element);
					if (allowed !== false) {
						self._reset("fast");
					}
					self.dragging = false;
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
			if (self.resetting) {
				return; // Prevent infinite recursion
			}
			self.resetting = true;
			self.activated = false;
			if (self.options.direction === "right") {
				self.slider.val(0);
			}
			else if (self.options.direction === "left") {
				self.slider.val(100);
			}
			self.slider.slider("refresh");
		},
		
		_reset: function(animationDuration) {
			var self = this;
			if (animationDuration === undefined || animationDuration === null) {
				if (self.options.direction === "right") {
					self.handle.css("left", 0);
				}
				else if (self.options.direction === "left") {
					self.handle.css("left", "100%");
				}
				self.text.css("opacity",self.options.opacity(0));
			}
			else {
				if (self.options.direction === "right") {
					self.handle.animate({left: 0}, animationDuration, $.proxy(self._resetSlider, self));
				}
				else if (self.options.direction === "left") {
					self.handle.animate({left: "100%"}, animationDuration, $.proxy(self._resetSlider, self));
				}
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
				self.slider.slider({mini: value}).slider("refresh");
				break;
			case "disabled":
				if (value === true) {
					self.element.addClass("ui-disabled");
					self.element.attr("disabled", true);
					self.text.css("opacity","");
				}
				else if (value === false) {
					self.element.removeClass("ui-disabled");
					self.element.attr("disabled", false);
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

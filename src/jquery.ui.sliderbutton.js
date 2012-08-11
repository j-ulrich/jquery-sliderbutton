/*
 * jQuery UI Slider Button 1.0
 * http://github.com/j-ulrich/jquery-sliderbutton
 *
 * Copyright (c) 2012 Jochen Ulrich <jochenulrich@t-online.de>
 * Licensed under the MIT license (MIT-LICENSE.txt).
 */

(function($) {
	$.widget("ui.sliderbutton", {
		
		// Options
		options: {
			text: "slide to unlock",
			direction: "right",
			tolerance: 1,
			opacity: function(value) {
				return 1.0-(value/50.0);
			}
		},
		
		_create: function() {
			var self = this;
			
			self.element.empty();
			self.element.addClass("ui-sliderbutton");
			if (self.options.disabled === true) {
				self.element.addClass("ui-state-disabled");
			}
			var text = $('<span></span>').addClass("ui-sliderbutton-text").text(self.options.text);
			var slider = $('<div></div>').addClass("ui-sliderbutton-slider");
			var handle = $('<div></div>').addClass("ui-slider-handle");
			slider.append(handle);
			self.element.append(text);
			self.element.append(slider);
			var startValue = 0;
			if (self.options.direction === "left") {
				self.element.addClass("ui-sliderbutton-left");
				startValue = 100;
			}
			
			$.extend(self, {
				slider: slider,
				handle: handle,
				text: text,
				activated: false // Prevents multiple activations for the same slide
			});

			
			slider.slider({
				animate: true,
				value: startValue,
				disabled: self.options.disabled,
				slide: function(event, ui) {
					var allowed = self._trigger("slide", event, ui);
					if (allowed !== false) {
						self.text.css("opacity",self.options.opacity((self.options.direction === "left"?(100-ui.value):ui.value)));
						if ( (self.activated === false) && ((self.options.direction === "right" && ui.value >= (100-self.options.tolerance))
								|| (self.options.direction === "left" && ui.value <= (0+self.options.tolerance))) ) {
							self._trigger("activate", event, ui);
							self.activated = true;
						}
					}
					return allowed;
				},
				stop: function(event, ui) {
					var allowed = self._trigger("stop", event, ui);
					if (allowed !== false) {
						self._reset("fast");
					}
				},
				start: function(event, ui) {
					self._trigger("start", event, ui);
				}
			});
		},
		
		_reset: function(animationDuration) {
			var self = this;
			self.activated = false;
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
					self.handle.animate({left: 0}, animationDuration);
				}
				else if (self.options.direction === "left") {
					self.handle.animate({left: "100%"}, animationDuration);
				}
				self.text.animate({opacity: self.options.opacity(0)}, animationDuration);
			}

		},
		
		destroy: function() {
			var self = this;
			self.slider.slider("destroy");
			self.element.empty();
			self.element.removeClass("ui-sliderbutton ui-sliderbutton-left");
		},
		
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
					self.element.removeClass("ui-sliderbutton-left");
				}
				else if (value === "left") {
					self.element.addClass("ui-sliderbutton-left");
				}
				self._reset();
				break;
			default:
				break;
			}
		},

	});
	
}(jQuery));

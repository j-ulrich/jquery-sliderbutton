/*jslint white: true vars: true browser: true todo: true */
/*jshint camelcase:true, plusplus:true, forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, maxerr:100, white:false, onevar:false */
/*global jQuery:true $:true */

/* jQuery Simulate Drag-n-Drop Plugin 1.0
 * http://github.com/j-ulrich/jquery-simulate-ext
 * 
 * Copyright (c) 2012 Jochen Ulrich
 * Licensed under the MIT license (MIT-LICENSE.txt).
 */

/* TODO: Implement startOffset & endOffset options
 * The offsets define the position relative to the center or upper left corner of an element
 * where the drag/drop should start/end.
 * 
 * The structure could be like this:
 * {
 * 	base: "center", // Either "center" or "upperleft"
 * 	x: 0,
 * 	y: 0
 * }
 */

;(function($, undefined) {
	"use strict";
	
	/* Overwrite the $.fn.simulate function
	 * to reduce the jQuery set to the first element
	 */
	$.fn.simulate = function( type, options ) {
		switch (type) {
		case "drag":
		case "drop":
		case "drag-n-drop":
			var ele = this.first();
			new $.simulate( ele[0], type, options);
			return ele;
			break;
		default:
			return this.each(function() {
				new $.simulate( this, type, options );
			});
			break;
		}
	};
	
	// Based on the findCenter function from jquery.simulate.js
	function findCenter( elem ) {
		var offset;
		elem = $( elem );
		if (!elem[0].ownerDocument) {
			offset = {left: 0, top: 0}; 
		}
		else {
			offset = elem.offset();
		}
			
		return {
			x: offset.left + elem.outerWidth() / 2,
			y: offset.top + elem.outerHeight() / 2
		};
	}
	
	function pageToClientPos(x, y, docRel) {
		var jDocument = $(docRel || document);
		
		if (typeof x === "number" && typeof y === "number") {
			return {
				x: x - jDocument.scrollLeft(),
				y: y - jDocument.scrollTop()
			};
		}
		else if (typeof x === "object" && x.pageX && x.pageY) {
			return {
				clientX: x.pageX - jDocument.scrollLeft(),
				clientY: x.pageY - jDocument.scrollTop()
			};
		}
	}
	
	var check = true, isRelative = true;
	/**
	 * This is a browser-independent implementation of document.elementFromPoint().
	 * 
	 * For details, see http://www.zehnet.de/2010/11/19/document-elementfrompoint-a-jquery-solution/
	 */
	function elementAtPosition(x, y, docRel) {
		var doc = docRel || document;
		if(!doc.elementFromPoint) {
			return null;
		}

		var clientX = x, clientY = y;
		if (typeof x === "object" && (x.clientX || x.clientY)) {
			clientX = x.clientX || 0 ;
			clientY = x.clientY || 0;
		}
		
		if(check)
		{
			var sl, ele;
			if ((sl = $(doc).scrollTop()) >0)
			{
				ele = doc.elementFromPoint(0, sl + $(window).height() -1);
				if ( ele != null && ele.tagName.toUpperCase() === 'HTML' ) { ele = null; }
				isRelative = ( ele == null );
			}
			else if((sl = $(doc).scrollLeft()) >0)
			{
				ele = doc.elementFromPoint(sl + $(window).width() -1, 0);
				if ( ele != null && ele.tagName.toUpperCase() === 'HTML' ) { ele = null; }
				isRelative = ( ele == null );
			}
			check = !(sl>0);
		}

		if(!isRelative)
		{
			clientX += $(doc).scrollLeft();
			clientY += $(doc).scrollTop();
		}

		return doc.elementFromPoint(clientX,clientY);
	}
	
	function dragFinished(ele, options) {
		$(ele).trigger({type: "simulate-drag"});
		if ($.isFunction(options.callback)) {
			options.callback.apply(ele);
		}
	}
	
	function interpolatedEvents(ele, start, drag, options) {
		var self = this;
		var interpolOptions = options.interpolation;
		var dragDistance = Math.sqrt(Math.pow(drag.x,2) + Math.pow(drag.y,2)); // sqrt(a^2 + b^2)
		var stepWidth, stepCount, stepVector;
		
		if (interpolOptions.stepWidth) {
			stepWidth = parseInt(interpolOptions.stepWidth, 10);
			stepCount = Math.floor(dragDistance / stepWidth)-1;
			var stepScale = stepWidth / dragDistance;
			stepVector = {x: drag.x*stepScale, y: drag.y*stepScale };
		}
		else {
			stepCount = parseInt(interpolOptions.stepCount, 10);
			stepWidth = dragDistance / (stepCount+1);
			stepVector = {x: drag.x/(stepCount+1), y: drag.y/(stepCount+1)};
		}
		
		var coords = $.extend({},start);
		
		function interpolationStep() {
			coords.x += stepVector.x;
			coords.y += stepVector.y;
			var effectiveCoords = {x: coords.x, y: coords.y};
			if (interpolOptions.shaky && (interpolOptions.shaky === true || !isNaN(parseInt(interpolOptions.shaky,10)) )) {
				var amplitude = (interpolOptions.shaky === true)? 1 : parseInt(interpolOptions.shaky,10);
				effectiveCoords.x += Math.floor(Math.random()*(2*amplitude+1)-amplitude);
				effectiveCoords.y += Math.floor(Math.random()*(2*amplitude+1)-amplitude);
			}
			self.simulateEvent( ele, "mousemove", {pageX: Math.round(effectiveCoords.x), pageY: Math.round(effectiveCoords.y)});	
		}
		
		
		function stepAndSleep() {
			var timeElapsed = now() - lastTime; // Work-around for Firefox "bug": setTimeout can fire before the timeout
			if (timeElapsed >= stepDelay) {
				if (step < stepCount) {
					interpolationStep();
					step += 1;
					setTimeout(stepAndSleep, stepDelay);
				}
				else {
					self.simulateEvent( ele, "mousemove", {pageX: start.x+drag.x, pageY: start.y+drag.y});
					dragFinished(ele, options);
				}
			}
			else {
				setTimeout(stepAndSleep, stepDelay - timeElapsed);
			}

		}

		if ( (!interpolOptions.stepDelay && !interpolOptions.duration) || ((interpolOptions.stepDelay <= 0) && (interpolOptions.duration <= 0)) ) {
			// Trigger as fast as possible
			for (var i=0; i < stepCount; i+=1) {
				interpolationStep();
			}
			self.simulateEvent( ele, "mousemove", {pageX: start.x+drag.x, pageY: start.y+drag.y});
			dragFinished(ele, options);
		}
		else {
			var stepDelay = parseInt(interpolOptions.stepDelay,10) || Math.ceil(parseInt(interpolOptions.duration,10) / (stepCount+1));
			var step = 0;
			var now = Date.now || function() { return new Date().getTime(); },
				lastTime = now();

			setTimeout(stepAndSleep, stepDelay);
		}
		
	}

	$.simulate.activeDrag = function() {
		if (!$.simulate._activeDrag) {
			return undefined;
		}
		return $.extend(true,{},$.simulate._activeDrag);
	};
	
	$.extend( $.simulate.prototype, {
		
	
		simulateDrag: function() {
			var ele = this.target,
				options = $.extend({
					dx: 0,
					dy: 0,
					dragTarget: undefined,
					clickToDrag: false,
					interpolation: {
						stepWidth: 0,
						stepCount: 0,
						stepDelay: 0,
						duration: 0,
						shaky: false
					},
					callback: undefined
				},	this.options);
			
			var start,
				continueDrag = ($.simulate._activeDrag && $.simulate._activeDrag.dragElement === ele);
			
			if (continueDrag) {
				start = $.simulate._activeDrag.dragStart;
			}
			else {
				start = findCenter( ele );
			}
				
			var x = Math.round( start.x ),
				y = Math.round( start.y ),
				coord = { pageX: x, pageY: y },
				dx,
				dy;
				
			if (options.dragTarget) {
				var end = findCenter(options.dragTarget);
				dx = Math.round(end.x - start.x);
				dy = Math.round(end.y - start.y);
			}
			else {
				dx = options.dx || 0;
				dy = options.dy || 0;
			}
				
			if (continueDrag) {
				// We just continue to move the dragged element
				$.simulate._activeDrag.dragDistance.x += dx;
				$.simulate._activeDrag.dragDistance.y += dy;	
				coord = { pageX: x + $.simulate._activeDrag.dragDistance.x , pageY: y + $.simulate._activeDrag.dragDistance.y };
			}
			else {
				if ($.simulate._activeDrag) {
					// Drop before starting a new drag
					$($.simulate._activeDrag.dragElement).simulate( "drop" );
				}
				
				// We start a new drag
				this.simulateEvent( ele, "mousedown", coord );
				if (options.clickToDrag === true) {
					this.simulateEvent( ele, "mouseup", coord );
					this.simulateEvent( ele, "click", coord );
				}
				$(ele).add(ele.ownerDocument).one('mouseup', function() {
					$.simulate._activeDrag = undefined;
				});
				
				$.extend($.simulate, {
					_activeDrag: {
						dragElement: ele,
						dragStart: { x: x, y: y },
						dragDistance: { x: dx, y: dy }
					}
				});
				coord = { pageX: x + dx, pageY: y + dy };
			}

			if (dx !== 0 || dy !== 0) {
				
				if ( options.interpolation && (options.interpolation.stepCount || options.interpolation.stepWidth) ) {
					interpolatedEvents.apply(this, [ele, {x: x, y: y}, {x: dx, y: dy}, options]);
				}
				else {
					this.simulateEvent( ele, "mousemove", coord );
					dragFinished(ele, options);
				}
			}
			else {
				dragFinished(ele, options);
			}
		},
		
		/**
		 * Simulates a drop.
		 * 
		 * The position where the drop occurs is determined in the following way:
		 * 1.) If there is an active drag with a distance dx != 0 and dy != 0, the drop occurs
		 * at the end position of that drag.
		 * 2.) If there is no active drag or the distance of the active drag is 0 (i.e. dx == 0 and
		 * dy == 0), then the drop occurs at the center of the element given to the drop. In this case,
		 * the mouse is moved onto the center of the element before the drop is simulated.
		 * In both cases, an active drag will be ended.
		 */
		simulateDrop: function() {
			var ele = this.target,
				activeDrag = $.simulate._activeDrag,
				options = $.extend({
					clickToDrop: false,
					callback: undefined
				}, this.options),
				moveBeforeDrop = true,
				center = findCenter( ele ),
				x = Math.round( center.x ),
				y = Math.round( center.y ),
				coord = { pageX: x, pageY: y },
				clientCoord = pageToClientPos(coord, ele.ownerDocument),
				eventTarget = elementAtPosition(clientCoord, ele.ownerDocument);
			
			if (activeDrag && (activeDrag.dragElement === ele || !ele.ownerDocument)) {
				// We already moved the mouse during the drag so we just simulate the drop on the end position
				x = activeDrag.dragStart.x + activeDrag.dragDistance.x;
				y = activeDrag.dragStart.y + activeDrag.dragDistance.y;
				coord = { pageX: x, pageY: y };
				clientCoord = pageToClientPos(coord, ele.ownerDocument);
				eventTarget = elementAtPosition(clientCoord, ele.ownerDocument);
				moveBeforeDrop = false;
			}
			
			if (!eventTarget) {
				eventTarget = (activeDrag)? activeDrag.dragElement : ele;
			}

			if (moveBeforeDrop === true) {
				// Else we assume the drop should happen on target, so we move there
				this.simulateEvent( eventTarget, "mousemove", coord );
			}

			if (options.clickToDrop) {
				this.simulateEvent( eventTarget, "mousedown", coord );
			}
			this.simulateEvent( eventTarget, "mouseup", coord );
			if (options.clickToDrop) {
				this.simulateEvent( eventTarget, "click", coord );
			}
			
			$.simulate._activeDrag = undefined;
			$(eventTarget).trigger({type: "simulate-drop"});
			if ($.isFunction(options.callback)) {
				options.callback.apply(eventTarget);
			}
		},
		
		simulateDragNDrop: function() {
			var ele = this.target,
				options = $.extend({
					dragTarget: undefined,
					dropTarget: undefined
				}, this.options),
				// If there is a dragTarget or dx/dy, then we drag there and simulate an independent drop on dropTarget or ele
				dropEle = ((options.dragTarget || options.dx || options.dy)? options.dropTarget : ele) || ele;
/*
				dx = (options.dropTarget)? 0 : (options.dx || 0),
				dy = (options.dropTarget)? 0 : (options.dy || 0),
				dragDistance = { dx: dx, dy: dy };
			
			$.extend(options, dragDistance);
*/			
			$(ele).simulate( "drag", $.extend({},options,{
				// If there is no dragTarget, no dx and no dy, we drag onto the dropTarget directly
				dragTarget: options.dragTarget || ((options.dx || options.dy)?undefined:options.dropTarget),
				callback: function() {
					$(dropEle).simulate( "drop", options );
				}
			}));
			
		}
	});
	
}(jQuery));
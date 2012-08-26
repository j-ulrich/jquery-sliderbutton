/*jslint white: true vars: true browser: true todo: true */
/*jshint camelcase:true, plusplus:true, forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, maxerr:100, white:false, onevar:false */
/*global noty:true jQuery:true $:true sprintf:true Roundizzle:true */

(function ($, undefined) {
	"use strict";

$(document).ready(function() {
	
	test("basic markup expansion", function() {
		var testElement = $('#sliderbuttontest');
		testElement.sliderbutton();
		ok(testElement.hasClass("ui-sliderbutton"), 'Verify the expansion worked at all');
		
		var children = testElement.children();
		strictEqual(children.length, 3, 'Verify the slider, the (hidden) input and the text have been created');
		ok(children.first().hasClass("ui-sliderbutton-text"), 'Verify the text has been created');
		ok(children.last().hasClass("ui-slider"), 'Verify the slider has been created');
		var handles = children.last().children(".ui-slider-handle");
		strictEqual(handles.length, 1, 'Verify the slider contains one handle');
		strictEqual(handles.first().position().left, 0, 'Verify the handle is in idle position');
	});
	
	test("handle sliding", function() {
		var testElement = $('#sliderbuttontest');
		testElement.sliderbutton();
		
		var handle = testElement.find('.ui-slider-handle').first();
		var dx = Math.round(handle.parent().width() / 2);
		handle.simulate("drag", {dx: dx});
		strictEqual(handle.position().left, dx, 'Verify the handle can be dragged');
		
		handle.simulate("drag", {dx: -dx/2});
		strictEqual(handle.position().left, Math.round(dx/2), 'Drag back');
		
		handle.simulate("drag", {dx: dx/2});
		strictEqual(handle.position().left, dx, 'Drag forth');
		
		handle.simulate("drop");
		stop();
		setTimeout(function() {
			strictEqual(handle.position().left, 0, 'Verify the handle slides back automatically (expecting "fast" slide back)');
			start();
		}, 300);
	});
	
	//####### Option Tests #######
	module('option tests');
	test("custom text", function() {
		var testElement = $('#sliderbuttontest');
		testElement.sliderbutton({text: "test text"});
		strictEqual(testElement.text(), "test text", 'Verify the text is set correctly');
	});

	test("direction left", function() {
		var testElement = $('#sliderbuttontest');
		testElement.sliderbutton({direction: "left"});
		ok(testElement.hasClass("ui-sliderbutton-left"), 'Verify the class is set correctly');
		var handle = testElement.find('.ui-slider-handle').first();
		var expectedHandlePos = handle.parent().width();
		strictEqual(handle.position().left, expectedHandlePos, 'Verify the idle position is at the right side');
	});
	
	test("opacity", function() {
		var testElement = $('#sliderbuttontest');
		testElement.sliderbutton({opacity: function() { return 1; }});
		
		var handle = testElement.find('.ui-slider-handle').first();
		var dx = handle.parent().width() / 2;
		handle.simulate("drag", {dx: dx});
		
		equal(testElement.find('.ui-sliderbutton-text').css("opacity"), 1, "Opacity should not change");
		handle.simulate("drop");
	});
	
	test("disabled", function() {
		var testElement = $('#sliderbuttontest');
		testElement.sliderbutton({disabled: true});

		ok(testElement.hasClass("ui-state-disabled"), 'Verify "disabled" class is set');
		
		$('#qunit-fixture').on('sliderbuttonstart', '.ui-sliderbutton', function() {
			ok(false, "Disabled widgets should not trigger start");
		});
		$('#qunit-fixture').on('sliderbuttonstop', '.ui-sliderbutton', function() {
			ok(false, "Disabled widgets should not trigger stop");
		});
		$('#qunit-fixture').on('sliderbuttonslide', '.ui-sliderbutton', function() {
			ok(false, "Disabled widgets should not trigger slide");
		});

		$('#qunit-fixture').on('sliderbuttonactivate', '.ui-sliderbutton', function() {
			ok(false, "Disabled widgets should not trigger activate");
		});

		
		var handle = testElement.find('.ui-slider-handle').first();
		var dx = handle.parent().width() / 2;
		handle.simulate("drag", {dx: dx});
		
		strictEqual(handle.position().left, 0, "The handle of a disabled sliderbutton should not move");
		handle.simulate("drop");
		expect(2); // The drag'n'drop should not trigger anything
	});
	
	test("mini", function() {
		var testElement = $('#sliderbuttontest');
		testElement.sliderbutton({mini: true});

		ok(testElement.hasClass("ui-sliderbutton-mini"), 'Verify mini class is set');
		strictEqual(testElement.css("height"), "28px", 'Verifiy the mini element has the correct height');
		strictEqual(testElement.find(".ui-sliderbutton-text").css("font-size"), "14px", 'Verify the text hast the correct font size');
	});
	
	//####### Event Tests #######
	module('event tests', {
		teardown: function() {
			$('#qunit-fixture').off();
			$('#sliderbuttontest .ui-slider-handle').simulate("drop");
		}
	});

	test("trigger create", function() {
		expect(1);
		
		$('#qunit-fixture').on('sliderbuttoncreate', '.ui-sliderbutton', function() {
			ok(true, "create triggered");
		});
		
		$('#sliderbuttontest').sliderbutton();
	});
		
	test("trigger start and slide", function() {
		var expectedEvents = [ 'start', 'slide' ];
		var expectedEventsIndex = 0;
		expect(3);
		
		var testElement = $('#sliderbuttontest');
		testElement.sliderbutton();
		var handle = testElement.find(".ui-slider-handle").first();
		var dx = handle.parent().width() / 2;

		
		$('#qunit-fixture').on('sliderbuttonstart', '.ui-sliderbutton', function() {
			strictEqual('start', expectedEvents[expectedEventsIndex], "start triggered");
			expectedEventsIndex += 1;
		});

		$('#qunit-fixture').on('sliderbuttonslide', '.ui-sliderbutton', function(event, ui) {
			strictEqual('slide', expectedEvents[expectedEventsIndex], "slide triggered");
			strictEqual(ui.value, 50, "Verify slide event provides correct value");
			expectedEventsIndex += 1;
		});

		handle.simulate("drag", {dx: dx});
	});
	
	test("trigger stop", function() {
		expect(1);
		
		var testElement = $('#sliderbuttontest');
		testElement.sliderbutton();
		var handle = testElement.find(".ui-slider-handle").first();
		var dx = handle.parent().width() / 2;

		
		$('#qunit-fixture').on('sliderbuttonstop', '.ui-sliderbutton', function() {
			ok(true, "stop triggered");
		});

		handle.simulate("drag", {dx: dx});
		handle.simulate("drop");
	});
	
	test("trigger activate", function() {
		var repetitions = 5;
		expect(repetitions);
		
		var testElement = $('#sliderbuttontest');
		testElement.sliderbutton();
		var handle = testElement.find(".ui-slider-handle").first();
		var dx = handle.parent().width();

		
		$('#qunit-fixture').on('sliderbuttonactivate', '.ui-sliderbutton', function() {
			ok(true, "activate triggered");
		});

		var repCount = 0;
		var pause = 300;
		function checkNDrag() {
			if (repCount < repetitions) {
				handle.simulate("drag-n-drop", {dx: dx});
				repCount += 1;
				setTimeout(checkNDrag, pause);
			}
			else {
				start();
			}
		}
		
		stop();
		checkNDrag();
	});
	
	
	test("complex event triggering", function() {
		var expectedEvents = [ ];
		var expectedEventsIndex = 0;
		
		function assertExpectedEvent(event, message) {
			var msg = message || event+" triggered";
			strictEqual(event, expectedEvents[expectedEventsIndex], msg);
			if (event === expectedEvents[expectedEventsIndex]) {
				expectedEventsIndex += 1;
			}
		}
		
		$('#qunit-fixture').on('sliderbuttoncreate', '.ui-sliderbutton', function() {
			assertExpectedEvent("create");
		});

		$('#qunit-fixture').on('sliderbuttonstart', '.ui-sliderbutton', function() {
			assertExpectedEvent("start");
		});

		$('#qunit-fixture').on('sliderbuttonslide', '.ui-sliderbutton', function(event, ui) {
			assertExpectedEvent("slide", "slide triggered (value: "+ui.value+")");
		});

		$('#qunit-fixture').on('sliderbuttonstop', '.ui-sliderbutton', function() {
			assertExpectedEvent("stop");
		});
		
		$('#qunit-fixture').on('sliderbuttonactivate', '.ui-sliderbutton', function() {
			assertExpectedEvent("activate");
		});


		var testElement = $('#sliderbuttontest');
		
		// Trigger create
		expectedEvents.push('create');
		testElement.sliderbutton();
		
		var handle = testElement.find(".ui-slider-handle").first();
		var dx = handle.parent().width() / 2;
		
		// Trigger start and slide
		expectedEvents.push('start', 'slide');
		handle.simulate("drag", {dx: dx});
		
		// Trigger stop -> slider slides back
		expectedEvents.push('stop');
		handle.simulate("drop");
		
		
		// Trigger start, slide, activate and stop
		expectedEvents.push('start', 'slide', 'slide', 'activate', 'stop');

		stop(); // We need to wait until the handle is slided back
		setTimeout(function() {
			handle.simulate("drag", {dx: dx});
			handle.simulate("drag", {dx: dx});
			handle.simulate("drop");
			for (; expectedEventsIndex < expectedEvents.length; expectedEventsIndex += 1) {
				ok(false, "Missing event: "+expectedEvents[expectedEventsIndex]);
			}
			start();
		}, 300);

		expect(expectedEvents.length);
	});

	test("tolerance", function() {
		expect(1);
		var testElement = $('#sliderbuttontest');
		testElement.sliderbutton({tolerance: 70});
		
		$('#qunit-fixture').on('sliderbuttonactivate', '.ui-sliderbutton', function() {
			ok(true, "activate triggered");
		});
		
		var handle = testElement.find('.ui-slider-handle').first();
		var dx = handle.parent().width() / 2;
		handle.simulate("drag-n-drop", {dx: dx});
	});
	
});
	
}(jQuery));
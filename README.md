jQuery UI/Mobile Sliderbutton
=============================

The sliderbutton plugin provides a button which is triggered by sliding a handle to the side. This
is a simple technique to avoid accidentally pressing a button.

The plugin is based on the jQuery UI/Mobile slider widget. Since those widget differ in their
implementation, the plugin comes in two version: one for jQuery UI and one for jQuery Mobile.

Initialization
--------------
The sliderbutton is created from a div element.

Options
-------
* disabled {Boolean}: Disables (`true`) or enables (`false`) the sliderbutton. Default: `false`
* text {String}: The text appearing on the slider lane. Default: `"slide to unlock"`
* tolerance {Numeric}: Defines the distance from the end of the slider lane where the button is triggered
	(activated). Must be in the range [0,100] where 0 means no tolerance (i.e. the slider needs to be
	moved entirely to the end before the button is triggered) and 100 means maximum tolerance (i.e. the
	slider just needs to be moved a slight bit for the button to trigger). Default: `1` for the UI
	version and `5` for the mobile version.
* direction {"right"|"left"}: Defines the direction in which the slider needs to be moved.
	Default: `"right"`
* opacity {Function}: Can be used to customize how the opacity of the text is changed. The function
	is handed one parameter, the current value in the range [0,100] where 0 means the slider is at
	the start (idle position) and 100 means the slider it at the end. The function then has to return
	a value for the opacity of the text. The default is `function(value) { return 1.0-(value/(100.0/2.0)); }`
	which means a linear fade out where the text gets invisible in the middle of the lane.
* mini {Boolean}: Mobile version only. Creates a mini version of the sliderbutton. Default: `false`

Events
------
* slide {sliderbuttonslide}: Triggered when the slider handle is moving. The callback is provided
	the arguments `event` and `ui` where `ui.value` is the current value (position) of the handle
	in the range [0,100]. 0 means the slider is at the start (idle position) and 100 means the
	slider is at the end. 
* activate {sliderbuttonactivate}: Triggered when the slider handle reaches the "end" (taking the
	tolerance into account).
* start {sliderbuttonstart}: Triggered when the slider handle starts to move.
* stop {sliderbuttonstop}: Triggered when the slider handle is released and starts to slide back
	into its idle position.

Methods
-------
* destroy: Removes the sliderbutton functionality completely. This will return the element back
	to its pre-init state.
	Synopsis: `.sliderbutton("destroy")`
* disable: Disables the sliderbutton.
	Synopsis: `.sliderbutton("disable")`
* enable: Enalbes the sliderbutton.
	Synopsis: `.sliderbutton("enable")`
* option: Get or set any sliderbutton option. If no value is specified, will act as a getter.
	Synopsis: `.sliderbutton("option", optionName, [value])`
* option: Set multiple sliderbutton options at once by providing an options object.
	Synopsis: `.sliderbutton("option", options)`
* widget: Returns the .ui-sliderbutton element.
	Synopsis: `.sliderbutton("widget")`

Example usage
-------------
```javascript
$('#SliderDiv').sliderbutton({text: "slide to submit", activate: function() {alert("submitted!")}});
```

Requirements
------------
The plugin requires jQuery and either jQuery UI 1.8 (including the slider widget) or jQuery Mobile.

Compatiblity
------------
The UI version of the plugin has been successfully tested with jQuery 1.7.2 and jQuery UI 1.8.20 and
it should be compatible with future versions as long as the implementation of the jQuery UI slider
does not change.

The mobile version has been successuflly tested with jQuery 1.7.2 and jQuery Mobile 1.1.0 and it
should be compatible with future versions as long as the implementation of the jQuery mobile slider
does not change.

Licensing
---------
Copyright (c) 2012 Jochen Ulrich <jochenulrich@t-online.de>
Licensed under the [MIT license](http://opensource.org/licenses/MIT).


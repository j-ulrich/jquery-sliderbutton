jQuery UI/Mobile Sliderbutton 1.3.2
===================================

The sliderbutton plugin provides a button which is triggered by sliding a handle to the side. This
is a simple technique to avoid accidentally pressing a button.

The plugin is based on the jQuery UI/Mobile slider widget. Since this widget differs in its
implementation in jQuery UI and jQuery mobile, the plugin comes in two versions: one for jQuery UI
and one for jQuery Mobile. The plugin tries to hide the differences between the versions, which means
that the API documented below applies to both versions (exceptions are marked accordingly) but the
generated markup and CSS differs.

#### Table of Contents ####
- [Initialization & Usage](#initialization--usage)
	- [Example](#example)
	- [Demos](#demos)
- [Options](#options)
- [Events](#events)
- [Methods](#methods)
- [Requirements](#requirements)
- [Compatibility](#compatibility)
- [Licensing](#licensing)


Initialization & Usage
----------------------
The sliderbutton is created from a div element. When the sliderbutton is activated, the `activate`
event is triggered. So to execute the desired action, bind a function to the `activate` event. 

#### Example: ####
```javascript
// Initialize the sliderbutton
$('#SliderDiv').sliderbutton({
	text: "slide to submit", // Set slider lane text
	activate: function() { alert('Submitted!'); } // Bind to the activate event during initialization
});

// Bind to the activate event after initialization
$('#SliderDiv').bind('sliderbuttonactivate', function() { alert('Activate!'); });

// Turn sliderbutton around
$('#SliderDiv').sliderbutton('option', 'direction', 'right');
```

#### Demos: ####
The [demos folder](https://github.com/j-ulrich/jquery-sliderbutton/tree/master/demos) contains a
demonstration of most of the features of both versions of the sliderbutton plugin.

Live demos can be found at jsFiddle and JS Bin where you can also play around with the plugin:
* UI:
	- http://jsfiddle.net/Ignitor/SmZEr/embedded/result/ ([jsFiddle](http://jsfiddle.net/Ignitor/SmZEr/))
	- http://jsbin.com/eqasew/6/edit#live ([JS Bin](http://jsbin.com/eqasew/6/edit))
* Mobile:
	- http://jsfiddle.net/Ignitor/VY5FC/embedded/result/ ([jsFiddle](http://jsfiddle.net/Ignitor/VY5FC/))
	- http://jsbin.com/igovef/10/edit#live ([JS Bin](http://jsbin.com/igovef/10/edit))

Options
-------
* __disabled__ _{Boolean}_: Disables (`true`) or enables (`false`) the sliderbutton. Default: `false`
* __text__ _{String}_: The text appearing on the slider lane. Default: `"activate"`
* __tolerance__ _{Numeric}_: Defines the distance from the end of the slider lane where the button is triggered
	(activated). Must be in the range [0,100] where 0 means no tolerance (i.e. the slider needs to be
	moved entirely to the end before the button is triggered) and 100 means maximum tolerance (i.e. the
	slider just needs to be moved a slight bit for the button to trigger). Default: `1` for the UI
	version and `5` for the mobile version.
* __direction__ _{"right"|"left"}_: Defines the direction in which the slider needs to be moved.
	Default: `"right"`
* __opacity__ _{Function}_: Can be used to customize how the opacity of the text is changed. The function
	is handed one parameter, the current value in the range [0,100] where 0 means the slider is at
	the start (idle position) and 100 means the slider it at the end (activated). The provided function
	then has to return a value for the opacity of the text. The default is
	`function(value) { return 1.0-(value/(100.0/2.0)); }` which means a linear fade out where the
	text becomes invisible in the middle of the lane.
* __mini__ _{Boolean}_: **Mobile version only.** Creates a mini version of the sliderbutton. Default: `false`

Events
------
* __create__ _{sliderbuttoncreate}_: Triggered after the sliderbutton has been created.
* __slide__ _{sliderbuttonslide}_: Triggered when the slider handle is moving. The callback is provided
	the arguments `event` and `ui` where `ui.value` is the current value (position) of the handle
	in the range [0,100]. 0 means the slider is at the start (idle position) and 100 means the
	slider is at the end (activated). 
* __activate__ _{sliderbuttonactivate}_: Triggered when the slider handle reaches the "end" (taking the
	tolerance into account).
* __start__ _{sliderbuttonstart}_: Triggered when the slider handle starts to move.
* __stop__ _{sliderbuttonstop}_: Triggered when the slider handle is released and starts to slide back
	into its idle position.

Methods
-------
* __destroy__: **UI version only.** Removes the sliderbutton functionality completely. This will return the element back
	to its pre-init state.
	- Synopsis: `.sliderbutton("destroy")`
* __disable__: Disables the sliderbutton.
	- Synopsis: `.sliderbutton("disable")`
* __enable__: Enalbes the sliderbutton.
	- Synopsis: `.sliderbutton("enable")`
* __option__: Get or set any sliderbutton option. If no value is specified, will act as a getter.
	- Synopsis: `.sliderbutton("option", optionName, [value])`
	- Parameters:
		* __optionName__ _{String}_: The name of the option to be set/returned.
		* [optional] __value__ _{?}_: The new value for the option. The type depends on the option 
			to be set.
	- Returns _{?}_: The current value of the option if the function is used as a getter
		(i.e. if _value_ is omitted). The type depends on the option. Returns the jQuery object if the
		function is used as a setter.
* __option__: Set multiple sliderbutton options at once by providing an options object.
	- Synopsis: `.sliderbutton("option", options)`
* __widget__: Returns the .ui-sliderbutton element.
	- Synopsis: `.sliderbutton("widget")`
	- Returns _{Object}_: The `.ui-sliderbutton` element.

Requirements
------------
The plugin requires
* [jQuery 1.7.0+](http://jquery.com)
* [jQuery UI 1.8+](http://jqueryui.com) (including the slider widget) **or** [jQuery Mobile 1.0+](http://jquerymobile.com)

Compatibility
------------
The UI version of the plugin has been successfully tested with jQuery 1.7.2 and jQuery UI 1.8.20 and
it should be compatible with future versions as long as the implementation of the jQuery UI slider
does not change.

The mobile version has been successfully tested with jQuery 1.7.2 and jQuery Mobile 1.1.0 and it
should be compatible with future versions as long as the implementation of the jQuery mobile slider
does not change.

Licensing
---------
Copyright &copy; 2013 Jochen Ulrich
http://github.com/j-ulrich/jquery-sliderbutton

Licensed under the [MIT license](http://opensource.org/licenses/MIT).

Legal Note
----------
Note that Apple Inc. holds the [U.S. Patent 8,286,103](http://patft.uspto.gov/netacgi/nph-Parser?Sect1=PTO1&Sect2=HITOFF&d=PALL&p=1&u=%2Fnetahtml%2FPTO%2Fsrchnum.htm&r=1&f=G&l=50&s1=8,286,103.PN.&OS=PN/8,286,103&RS=PN/8,286,103)
which covers unlocking a touch-sensitive device via predefined gestures. In other words: don't use the
sliderbutton to unlock devices unless you own a license from Apple.


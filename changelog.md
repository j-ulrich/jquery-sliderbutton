jQuery UI/Mobile Sliderbutton Changelog
=======================================

Version 2.0.0 - (Released: 2013-04-25)
-------------
* Adds the "releaseToActivate" option which is enabled by default.
* Reconsidered the versioning scheme and according to semantic versioning,
  Version 1.3.0 should have already been version 2.0.0 since it totally changed
  the design and therefore, might have required code changes to users.
  Same applies to version 1.3.1 which changed the default text and therefore should
  have become version 3.0.0. However, since released versions cannot be changed,
  I just added a note to the affected versions in this changelog and will respect
  the semantic versioning more strictly in the future.

Version 1.3.1 - (Released: 2013-02-17)
-------------
**Note:** Version 1.3.1 contains breaking changes (change in the default values)
and should have been a major update (i.e. 3.0.0).

* Changes default text to "activate".
* Adds a legal note in the documentation.
* Minor changes in the package files.

Version 1.3.0 - (Released: 2013-02-12)
-------------
**Note:** Version 1.3.0 contains "breaking" changes (complete new design)
and should have been a major update (i.e. 2.0.0).

* Changes the design of the sliderbutton

Version 1.2.2 - (Released: 2013-01-30)
-------------
* Fixes the jQuery package manifest.

Version 1.2.1 - (Released: 2013-01-17)
-------------
* Updates the jQuery package manifest.

Version 1.2.0 - (Released: 2012-10-12)
-------------
* Adds grunt.js build system.
* Changes namespace of sliderbutton widget from 'ui'/'mobile' to 'ju'
* Replaces the separate jQuery simulate ext files with the complete version (all combined)

Version 1.1 - (Released: 2012-08-22)
-----------
* Unified the event triggering of mobile and UI version: Both version now behave
  exactly the same concerning the time and number of events triggered.
/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"gavdi/sandbox/Tami_training_app/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
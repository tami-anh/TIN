/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"gavdi/sandbox/Tami_training_app/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
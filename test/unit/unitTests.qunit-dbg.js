/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"pwc/portal/eval/ClubEvaluations/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
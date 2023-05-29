sap.ui.define([	"pwc/portal/eval/ClubEvaluations/controller/BaseController"
], function (e) {
	"use strict";
	return e.extend("pwc.portal.eval.ClubEvaluations.view.Applications.StakeholderMapping.controller.NotFound", {
		onLinkPressed: function () {
			this.getRouter().navTo("worklist")
		}
	})
});
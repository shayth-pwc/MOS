sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		formDesScore: function (sScore) {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			if (sScore !== null) {
				return oResourceBundle.getText("EvaluationCriteriaScore", sScore);

			} else {
				return oResourceBundle.getText("ScoreNotSelected");
			}
		},
		SelectedItems: function (sStatus, sCriteria_score) {
			var sSelected,
				that = this,
				oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			if (sStatus === 'Success') {
				//debugger;;
				that.byId("CriteriaList").setHeaderText(oResourceBundle.getText("EvaluationCriteriaScore", sCriteria_score));
				sSelected = "Success";
			} else {
				sSelected = "None";
			}
			return sSelected;
		},

		selectedMasterItem: function (sItem) {
			if (window.hasher.getHashAsArray()[4] === sItem) {
				return true;
			} else {
				return false;
			}

		}

	};
});
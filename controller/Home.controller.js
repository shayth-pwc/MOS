sap.ui.define([
	"pwc/portal/eval/ClubEvaluations/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("pwc.portal.eval.ClubEvaluations.controller.Home", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf pwc.portal.eval.ClubEvaluations.view.Home
		 */
		onInit: function () {
			this.getRouter().getRoute("home").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			var that = this,
				oBusy = new sap.m.BusyDialog(),
				oResourceBundle = this.getView().getModel("i18n").getResourceBundle(),
				Editable;
			oBusy.open();
			this.getModel().read("/Evaluations", {
				success: function (oData) {
					oBusy.close();
					that.setEvaluation(oData.results[0]);
					that.byId("eval_header").setTitle(that.getResourceBundle().getText("appTitle") + "  " + that.getResourceBundle().getText(
						"period_name") + " : " + oData.results[0].period_name);

					Editable = oData.results[0].Editable;
					if (Editable === "X") {
						that.getOwnerComponent().getRouter().navTo("noEvaluation");

					}
				},
				error: function (oError) {
					oBusy.close();
				}
			});
		},

		setEvaluation: function (sEval) {

				this.evaluation = sEval;
				sap.ui.getCore().AppContext = new Object();
				sap.ui.getCore().AppContext.evaluation = sEval;
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf pwc.portal.eval.ClubEvaluations.view.Home
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf pwc.portal.eval.ClubEvaluations.view.Home
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf pwc.portal.eval.ClubEvaluations.view.Home
		 */
		//	onExit: function() {
		//
		//	}

	});

});
sap.ui.define([
	"pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"sap/m/MessageBox",
	"./ReviewStakeholderGathering", "./CreateNewStakeholderGathering",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService"
], function(BaseController, MessageBox, ReviewStakeholderGathering, CreateNewStakeholderGathering, Utilities, History,RepoService) {
	"use strict";

	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.StakeholderGathering34G.controller.MainStakeholderGathering", {
	// onAfterRendering: function () {
 //               if (typeof sap.ui.getCore().AppContext === 'undefined') {
 //                   this.getOwnerComponent().getRouter().navTo("home");
 //                   this.destroy();
 //               }
 //           },
		_onButtonPress: function(oEvent) {

			var sDialogName = "CreateNewStakeholderGathering";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new CreateNewStakeholderGathering(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var oContext = this.getView().getModel("stakeholdergathering").createEntry("/StakeholderFeedback");
			oDialog._oControl.setBindingContext(oContext,"stakeholdergathering");

			oDialog.open();

		},
		urlformatter: function (url) {
			var that = this;

			var dataget = "";
			if (!url) {
				return "No File Uploaded";
			} else if (url == 'null') {

				return "No File Uploaded";
			} else {

				jQuery.ajax({
					url: "/portal/portal/portal_gen/DMSMapping/dmsnamemapping.xsjs?val1=" + url,
					async: false,
					method: "GET",
					success: function (response) {

						
						var ret = JSON.parse(response).myResult;

						dataget = decodeURIComponent(escape(ret));
						return decodeURIComponent(escape(ret));

					},
					error: function (e) {}
				});

				return dataget;


			}
		},
		_onRowPress: function(oEvent) {

			var sDialogName = "ReviewStakeholderGathering";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new ReviewStakeholderGathering(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext("stakeholdergathering");
			oDialog._oControl.setBindingContext(context,"stakeholdergathering");

			oDialog.open();

		},
		_onDeleteRow: function(oEvent) {

		 var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
           var that = this,
				sPath =	oEvent.getSource().getParent().getBindingContext("stakeholdergathering").getPath(),
				oModel = that.getView().getModel("stakeholdergathering");
			MessageBox.confirm(oResourceBundle.getText('ConfirmEditSubmit'), {
				onClose: function (oAction) {
					if (oAction === sap.m.MessageBox.Action.OK) {
						oModel.remove(sPath, {
							success: function (oData) {
							sap.m.MessageToast.show(oResourceBundle.getText('Success'));
								oModel.refresh();
							},
							error: function (oError) {
								sap.m.MessageToast.show(oResourceBundle.getText('err'));
							}
						});
					}
				}
			});

	
	},

		_onEditRow: function(oEvent) {

	var sDialogName = "CreateNewStakeholderGathering";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new CreateNewStakeholderGathering(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			// Set the Binding Context to the Dialog
			var context = oEvent.getSource().getBindingContext("stakeholdergathering");
			oDialog._oControl.setBindingContext(context,"stakeholdergathering");
			oDialog._Event = oEvent.getSource().getId();
			oDialog.open();

		},
		openlink: function (oEvent) {
			var sLink = '';
			var filename = oEvent.getSource().getText();
			RepoService.getRepoId().then(function (ReposId) {
				sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + filename;
				window.open(sLink);
			});
		},
		onInit: function() {
			// this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// this.oRouter.getTarget("MainStakeholderGathering").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

		}
	});
}, /* bExport= */ true);

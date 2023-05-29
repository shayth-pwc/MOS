sap.ui.define([
	"pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"sap/m/MessageBox",
	"./ReviewExpensePolicy", "./CreateNewExpensePolicy",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService",
	"sap/ui/core/Fragment"
], function(BaseController, MessageBox, ReviewExpensePolicy, CreateNewExpensePolicy, Utilities, History,RepoService,Fragment) {
	"use strict";

	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.ExpensePolicyManual41B.controller.MainExpensePolicy", {

		// onAfterRendering: function () {
  //              if (typeof sap.ui.getCore().AppContext === 'undefined') {
  //                  this.getOwnerComponent().getRouter().navTo("home");
  //                  this.destroy();
  //              }
  //          },
		_onButtonPress: function(oEvent) {

			var sDialogName = "CreateNewExpensePolicy";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new CreateNewExpensePolicy(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var oContext = this.getView().getModel("ExpenseManual").createEntry("/financialexpensepolicy");
			oDialog._oControl.setBindingContext(oContext,"ExpenseManual");

			oDialog.open();

		},
		_onRowPress: function(oEvent) {

			var sDialogName = "ReviewExpensePolicy";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new ReviewExpensePolicy(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext("ExpenseManual");
			oDialog._oControl.setBindingContext(context,"ExpenseManual");

			oDialog.open();

		},
		_onDeleteRow: function(oEvent) {

			 var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
           var that = this,
				sPath =	oEvent.getSource().getParent().getBindingContext("ExpenseManual").getPath(),
				oModel = that.getView().getModel("ExpenseManual");
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

	var sDialogName = "CreateNewExpensePolicy";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new CreateNewExpensePolicy(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			// Set the Binding Context to the Dialog
			var context = oEvent.getSource().getBindingContext("ExpenseManual");
			oDialog._oControl.setBindingContext(context,"ExpenseManual");
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

		},

	});
}, /* bExport= */ true);

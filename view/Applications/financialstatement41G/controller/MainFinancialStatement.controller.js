sap.ui.define([
	"pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"sap/m/MessageBox",
	"./ReviewFinancialStatement", "./CreateNewFinancialStatement",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService"
], function(BaseController, MessageBox, ReviewFinancialStatement, CreateNewFinancialStatement, Utilities, History,RepoService) {
	"use strict";

	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.financialstatement41G.controller.MainFinancialStatement", {
	// onAfterRendering: function () {
 //               if (typeof sap.ui.getCore().AppContext === 'undefined') {
 //                   this.getOwnerComponent().getRouter().navTo("home");
 //                   this.destroy();
 //               }
 //           },
		_onButtonPress: function(oEvent) {

			var sDialogName = "CreateNewFinancialStatement";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new CreateNewFinancialStatement(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var oContext = this.getView().getModel("financialstatement").createEntry("/financialstatement");
			oDialog._oControl.setBindingContext(oContext,"financialstatement");

			oDialog.open();

		},
		_onRowPress: function(oEvent) {

			var sDialogName = "ReviewFinancialStatement";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new ReviewFinancialStatement(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext("financialstatement");
			oDialog._oControl.setBindingContext(context,"financialstatement");

			oDialog.open();

		},
		_onDeleteRow: function(oEvent) {

			 var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
           var that = this,
				sPath =	oEvent.getSource().getParent().getBindingContext("financialstatement").getPath(),
				oModel = that.getView().getModel("financialstatement");
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

	var sDialogName = "CreateNewFinancialStatement";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new CreateNewFinancialStatement(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			// Set the Binding Context to the Dialog
			var context = oEvent.getSource().getBindingContext("financialstatement");
			oDialog._oControl.setBindingContext(context,"financialstatement");
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

	});
}, /* bExport= */ true);

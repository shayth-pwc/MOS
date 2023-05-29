sap.ui.define([
	"pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService",
	"sap/ui/core/Fragment", "./CreateNewmarketingGuide", "./ReviewmarketingGuide"
], function (BaseController, MessageBox, Utilities, History, RepoService, Fragment, CreateNewmarketingGuide, ReviewmarketingGuide) {
	"use strict";

	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.GameDayMarketingGuide54A.controller.MainmarketingGuide", {
		// onAfterRendering: function () {
		//               if (typeof sap.ui.getCore().AppContext === 'undefined') {
		//                   this.getOwnerComponent().getRouter().navTo("home");
		//                   this.destroy();
		//               }
		//           },

		_onDeleteRow: function (oEvent) {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var that = this,
				sPath = oEvent.getSource().getParent().getBindingContext("marketingGuide").getPath(),
				oModel = that.getView().getModel("marketingGuide");
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

		_onCreateNewCardPress: function (oEvent) {
			var sDialogName = "CreateNewmarketingGuide";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new CreateNewmarketingGuide(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			var that = this;
			this.getOwnerComponent().getModel("marketingGuide").read("/eventtypematchday", {
				success: function (oData) {
					var path = oData.results[0];
					console.log(path.id);
					var oContext = that.getView().getModel("marketingGuide").createEntry("/Activities", {
						properties: {}
					});
					oDialog._oControl.setBindingContext(oContext, "marketingGuide");

					oDialog.open();
				},
				error: function (oError) {}
			});

		},

		_onRowCardPress: function (oEvent) {

			var sDialogName = "ReviewmarketingGuide";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new ReviewmarketingGuide(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext("marketingGuide");
			oDialog._oControl.bindElement("marketingGuide>" + context);

			oDialog.open();

		},
		_onEditCardRow: function (oEvent) {

			var sDialogName = "CreateNewmarketingGuide";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new CreateNewmarketingGuide(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			// Set the Binding Context to the Dialog
			var context = oEvent.getSource().getBindingContext("marketingGuide");
			oDialog._oControl.bindElement("marketingGuide>" + context);
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
		onInit: function () {

		},

	});
}, /* bExport= */ true);
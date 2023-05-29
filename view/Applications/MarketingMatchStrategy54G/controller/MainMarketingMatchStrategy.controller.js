sap.ui.define([
	"pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService",
	"sap/ui/core/Fragment", "./CreateNewMarketingStrategy", "./ReviewMarketingStrategy"
], function (BaseController, MessageBox, Utilities, History, RepoService, Fragment, CreateNewMarketingStrategy, ReviewMarketingStrategy) {
	"use strict";

	return BaseController.extend(
		"pwc.portal.eval.ClubEvaluations.view.Applications.MarketingMatchStrategy54G.controller.MainRecreationalActivities", {

			// onAfterRendering: function () {
			// 	if (typeof sap.ui.getCore().AppContext === 'undefined') {
			// 		this.getOwnerComponent().getRouter().navTo("home");
			// 		this.destroy();
			// 	}
			// },

			_onDeleteRow: function (oEvent) {
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
				var that = this,
					sPath = oEvent.getSource().getParent().getBindingContext("MarketingMatchStrategy").getPath(),
					oModel = that.getView().getModel("MarketingMatchStrategy");
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

			// _onDeleteRow: function(oEvent) {
			// 	var sPath = oEvent.getSource().getParent().getBindingContext("MarketingMatchStrategy").getPath();
			// 	var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			// 	if (sPath) {
			// 		return new Promise(function (fnResolve, fnReject) {
			// 		oEvent.getSource().getParent().getModel("MarketingMatchStrategy").remove(sPath,{
			// 				success: function (oData) {

			// 					sap.m.MessageToast.show(oResourceBundle.getText("EntryDeleted"), {
			// 						onClose: fnResolve,
			// 						duration: 0 || 3000
			// 					});

			// 					return;
			// 				},
			// 				error: function (oError) {
			// 					MessageBox.show(oError.message.value, {
			// 						icon: sap.m.MessageBox.Icon.ERROR,
			// 						title: "oError"
			// 					});
			// 					return;
			// 				}
			// 			});
			// 		oEvent.getSource().getParent().getModel("MarketingMatchStrategy").refresh();
			// 	}).catch(function (err) {
			// 			if (err !== undefined) {
			// 				MessageBox.error(err.message);
			// 			}});
			// }

			// },
			_onCreateNewCardPress: function (oEvent) {

				var sDialogName = "CreateNewMarketingStrategy";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new CreateNewMarketingStrategy(this.getView());
					this.mDialogs[sDialogName] = oDialog;

					// For navigation.
					oDialog.setRouter(this.oRouter);
				}

				// var oContext = this.getView().getModel("MarketingMatchStrategy").createEntry("/ActivitiesEvidence");
				var oContext = this.getView().getModel("MarketingMatchStrategy").createEntry("ActivitiesEvidence", {
					properties: {
						related_department: '',
						finance_resource: "",
						expense_allocation: "",
						human_resources_number: "",
						target_date: new Date()

					}
				});

				oDialog._oControl.bindElement("MarketingMatchStrategy>" + oContext);

				oDialog.open();

			},
			_onRowCardPress: function (oEvent) {

				var sDialogName = "ReviewMarketingStrategy";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new ReviewMarketingStrategy(this.getView());
					this.mDialogs[sDialogName] = oDialog;

					// For navigation.
					oDialog.setRouter(this.oRouter);
				}

				var context = oEvent.getSource().getBindingContext("MarketingMatchStrategy");
				oDialog._oControl.bindElement("MarketingMatchStrategy>" + context);

				oDialog.open();

			},
			_onEditCardRow: function (oEvent) {

				var sDialogName = "CreateNewMarketingStrategy";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new CreateNewMarketingStrategy(this.getView());
					this.mDialogs[sDialogName] = oDialog;

					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("MarketingMatchStrategy");
				oDialog._oControl.bindElement("MarketingMatchStrategy>" + context);
				oDialog._Event = oEvent.getSource().getId();
				oDialog.open();

			},

			Openlink: function (oEvent) {
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
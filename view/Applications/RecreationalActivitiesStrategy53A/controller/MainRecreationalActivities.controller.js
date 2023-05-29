sap.ui.define([
	"pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService",
	"sap/ui/core/Fragment", "./CreateNewCard", "./ReviewNewCard"
], function (BaseController, MessageBox, Utilities, History, RepoService, Fragment, CreateNewCard, ReviewNewCard) {
	"use strict";

	return BaseController.extend(
		"pwc.portal.eval.ClubEvaluations.view.Applications.RecreationalActivitiesStrategy53A.controller.MainRecreationalActivities", {

			// onAfterRendering: function () {
			// 	if (typeof sap.ui.getCore().AppContext === 'undefined') {
			// 		this.getOwnerComponent().getRouter().navTo("home");
			// 		this.destroy();
			// 	}
			// },

			_onDeleteRow: function (oEvent) {
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
				var that = this,
					sPath = oEvent.getSource().getParent().getBindingContext("recreationalactivities").getPath(),
					oModel = that.getView().getModel("recreationalactivities");
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
			// 	var sPath = oEvent.getSource().getParent().getBindingContext("recreationalactivities").getPath();
			// 	var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			// 	if (sPath) {
			// 		return new Promise(function (fnResolve, fnReject) {
			// 		oEvent.getSource().getParent().getModel("recreationalactivities").remove(sPath,{
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
			// 		oEvent.getSource().getParent().getModel("recreationalactivities").refresh();
			// 	}).catch(function (err) {
			// 			if (err !== undefined) {
			// 				MessageBox.error(err.message);
			// 			}});
			// }

			// },
			_onCreateNewCardPress: function (oEvent) {

				var sDialogName = "CreateNewCard";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new CreateNewCard(this.getView());
					this.mDialogs[sDialogName] = oDialog;

					// For navigation.
					oDialog.setRouter(this.oRouter);
				}

				var oContext = this.getView().getModel("recreationalactivities").createEntry("/ClubActivityCards");
				oDialog._oControl.bindElement("recreationalactivities>" + oContext);

				oDialog.open();

			},
			_onRowCardPress: function (oEvent) {

				var sDialogName = "ReviewNewCard";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new ReviewNewCard(this.getView());
					this.mDialogs[sDialogName] = oDialog;

					// For navigation.
					oDialog.setRouter(this.oRouter);
				}

				var context = oEvent.getSource().getBindingContext("recreationalactivities");
				oDialog._oControl.bindElement("recreationalactivities>" + context);

				oDialog.open();

			},
			_onEditCardRow: function (oEvent) {

				var sDialogName = "CreateNewCard";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new CreateNewCard(this.getView());
					this.mDialogs[sDialogName] = oDialog;

					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("recreationalactivities");
				oDialog._oControl.bindElement("recreationalactivities>" + context);
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
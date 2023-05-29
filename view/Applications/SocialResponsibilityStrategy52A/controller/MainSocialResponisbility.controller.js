sap.ui.define([
	"pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"sap/m/MessageBox",
	"./ReviewSocialResponsibility", "./NewSocialResponsibility",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService",
	"sap/ui/core/Fragment", "./NewInitiative", "./ReviewInitiative", "./CreateNewCard", "./ReviewNewCard"
], function (BaseController, MessageBox, ReviewSocialResponsibility, NewSocialResponsibility, Utilities, History, RepoService, Fragment,
	NewInitiative, ReviewInitiative, CreateNewCard, ReviewNewCard) {
	"use strict";

	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.SocialResponsibilityStrategy52A.controller.Page1", {
		// onAfterRendering: function () {
		//               if (typeof sap.ui.getCore().AppContext === 'undefined') {
		//                   this.getOwnerComponent().getRouter().navTo("home");
		//                   this.destroy();
		//               }
		//           },
		_onCreateNewInitiativePress: function (oEvent) {

			var sDialogName = "NewInitiative";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new NewInitiative(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			var oContext = this.getView().getModel("socialresponsibility").createEntry("/QuarterlyPlan");
			oDialog._oControl.setBindingContext(oContext, "socialresponsibility");

			oDialog.open();

		},
		_onRowInitiativePress: function (oEvent) {

			var sDialogName = "ReviewInitiative";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new ReviewInitiative(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext("socialresponsibility");
			oDialog._oControl.setBindingContext(context, "socialresponsibility");

			oDialog.open();

		},
		_onDeleteRow: function (oEvent) {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var that = this,
				sPath = oEvent.getSource().getParent().getBindingContext("socialresponsibility").getPath(),
				oModel = that.getView().getModel("socialresponsibility");
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

		// 	var sPath = oEvent.getSource().getParent().getBindingContext("socialresponsibility").getPath();
		// 	var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
		// 	if (sPath) {
		// 		return new Promise(function (fnResolve, fnReject) {
		// 		oEvent.getSource().getParent().getModel("socialresponsibility").remove(sPath,{
		// 				success: function (oData) {
		// 						fnResolve();
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
		// 		oEvent.getSource().getParent().getModel("socialresponsibility").refresh();
		// 	}).catch(function (err) {
		// 			if (err !== undefined) {
		// 				MessageBox.error(err.message);
		// 			}});
		// }

		// },
		_onEditInitiavieRow: function (oEvent) {

			var sDialogName = "NewInitiative";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new NewInitiative(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			// Set the Binding Context to the Dialog
			var context = oEvent.getSource().getBindingContext("socialresponsibility");
			oDialog._oControl.setBindingContext(context, "socialresponsibility");
			oDialog._Event = oEvent.getSource().getId();
			oDialog.open();

		},

		_onCreateNewResponsibilityPress: function (oEvent) {

			var sDialogName = "NewSocialResponsibility";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new NewSocialResponsibility(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var oContext = this.getView().getModel("socialresponsibility").createEntry("/socialresponsibilitystrategy");
			oDialog._oControl.setBindingContext(oContext, "socialresponsibility");

			oDialog.open();

		},
		_onRowResponsibilityPress: function (oEvent) {

			var sDialogName = "ReviewSocialResponsibility";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new ReviewSocialResponsibility(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext("socialresponsibility");
			oDialog._oControl.setBindingContext(context, "socialresponsibility");

			oDialog.open();

		},
		_onEditResponsibilityRow: function (oEvent) {

			var sDialogName = "NewSocialResponsibility";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new NewSocialResponsibility(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			// Set the Binding Context to the Dialog
			var context = oEvent.getSource().getBindingContext("socialresponsibility");
			oDialog._oControl.setBindingContext(context, "socialresponsibility");
			oDialog._Event = oEvent.getSource().getId();
			oDialog.open();

		},

		_onCreateNewCardPress: function(oEvent) {

			var sDialogName = "CreateNewCard";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new CreateNewCard(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var oContext = this.getView().getModel("socialresponsibility").createEntry("/ClubActivityCards52A");
			oDialog._oControl.setBindingContext(oContext,"socialresponsibility");

			oDialog.open();

		},
		// _onCreateNewCardPress: function (oEvent) {
		// 	var sDialogName = "CreateNewCard";
		// 	this.mDialogs = this.mDialogs || {};
		// 	var oDialog = this.mDialogs[sDialogName];
		// 	if (!oDialog) {
		// 		oDialog = new CreateNewCard(this.getView());
		// 		this.mDialogs[sDialogName] = oDialog;

		// 		// For navigation.
		// 		oDialog.setRouter(this.oRouter);
		// 	}
		// 	var that = this;
		// 	this.getOwnerComponent().getModel("socialresponsibility").read("/eventtypesocialresp", {
		// 		success: function (oData) {
		// 			var path = oData.results[0];
		// 			console.log(path.id);
		// 			var oContext = that.getView().getModel("socialresponsibility").createEntry("/ClubActivityCards", {
		// 				properties: {
		// 					activity_type: path.id
		// 				}
		// 			});
		// 			oDialog._oControl.setBindingContext(oContext, "socialresponsibility");

		// 			oDialog.open();
		// 		},
		// 		error: function (oError) {}
		// 	});

		// },

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

			var context = oEvent.getSource().getBindingContext("socialresponsibility");
			oDialog._oControl.setBindingContext(context, "socialresponsibility");

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
			var context = oEvent.getSource().getBindingContext("socialresponsibility");
			oDialog._oControl.setBindingContext(context, "socialresponsibility");
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
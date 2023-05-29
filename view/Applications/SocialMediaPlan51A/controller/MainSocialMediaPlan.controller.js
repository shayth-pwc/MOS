sap.ui.define([
	"pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"sap/m/MessageBox",
	"./ReviewSocialMediaPlan", "./CreateNewSocialMediaPlan",
	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, ReviewSocialMediaPlan, CreateNewSocialMediaPlan, Utilities, History) {
	"use strict";

	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.SocialMediaPlan51A.controller.MainSocialMediaPlan", {
		// _onButtonPress: function(oEvent) {

		// 	var sDialogName = "CreateNewSocialMediaPlan";
		// 	this.mDialogs = this.mDialogs || {};
		// 	var oDialog = this.mDialogs[sDialogName];
		// 	if (!oDialog) {
		// 		oDialog = new CreateNewSocialMediaPlan(this.getView());
		// 		this.mDialogs[sDialogName] = oDialog;

		// 		// For navigation.
		// 		oDialog.setRouter(this.oRouter);
		// 	}

		// 	var oContext = this.getView().getModel("socialmediaplan").createEntry("/ClubActivityCards");
		// 	oDialog._oControl.setBindingContext(oContext,"socialmediaplan");

		// 	oDialog.open();

		// },
		
		_onButtonPress: function (oEvent) {

            var sDialogName = "CreateNewSocialMediaPlan";
            this.mDialogs = this.mDialogs || {};
            var oDialog = this.mDialogs[sDialogName];
            if (!oDialog) {
                oDialog = new CreateNewSocialMediaPlan(this.getView());
                this.mDialogs[sDialogName] = oDialog;

                // For navigation.
                oDialog.setRouter(this.oRouter);
            }
            var that = this;
            this.getOwnerComponent().getModel("socialmediaplan").read("/eventtypesocial", {
                success: function (oData) {
                    var path = oData.results[0];
                    console.log(path.id);
                    var oContext = that.getView().getModel("socialmediaplan").createEntry("/ClubActivityCards", {
                        properties: {
                            activity_type: path.id
                        }
                    });
                   oDialog._oControl.setBindingContext(oContext,"socialmediaplan");

                    oDialog.open();
                },
                error: function (oError) {}
            });

        },
		
		
		
		_onRowPress: function(oEvent) {

			var sDialogName = "ReviewSocialMediaPlan";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new ReviewSocialMediaPlan(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext("socialmediaplan");
			oDialog._oControl.setBindingContext(context,"socialmediaplan");

			oDialog.open();

		},
		_onDeleteRow: function (oEvent) {
			 var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
           var that = this,
				sPath =	oEvent.getSource().getParent().getBindingContext("socialmediaplan").getPath(),
				oModel = that.getView().getModel("socialmediaplan");
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

		// 	var sPath = oEvent.getSource().getParent().getBindingContext("socialmediaplan").getPath();
		// 	var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
		// 	if (sPath) {
		// 		return new Promise(function (fnResolve, fnReject) {
		// 		oEvent.getSource().getParent().getModel("socialmediaplan").remove(sPath,{
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
		// 		oEvent.getSource().getParent().getModel("socialmediaplan").refresh();
		// 	}).catch(function (err) {
		// 			if (err !== undefined) {
		// 				MessageBox.error(err.message);
		// 			}});
		// }

		// },
		_onEditRow: function(oEvent) {

			var sDialogName = "CreateNewSocialMediaPlan";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new CreateNewSocialMediaPlan(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext("socialmediaplan");
			oDialog._oControl.setBindingContext(context,"socialmediaplan");

			oDialog.open();

		},
		onInit: function() {
		}
	});
}, /* bExport= */ true);

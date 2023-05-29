sap.ui.define([
		"pwc/portal/eval/ClubEvaluations/controller/BaseController",
		"sap/m/MessageBox",
		"./AddCommitteeGoal",
		"./addPlayerBonus",
		"./addCoachBonus",
		"./CopyOfAddCommitteeGoal",
		"./CopyOfaddPlayerBonus",
		"./CopyOfaddCoachBonus",
		"./Dialog5",
		"./utilities",
		"sap/ui/core/routing/History"
	], function (BaseController, MessageBox, AddCommitteeGoal, addPlayerBonus, addCoachBonus, CopyOfAddCommitteeGoal,CopyOfaddPlayerBonus,CopyOfaddCoachBonus, Dialog5, Utilities, History) {
		"use strict";
		return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.ClubBonusCommittee.controller.Page1", {
			handleRouteMatched: function (oEvent) {
				var sAppId = "App62970f5980524e01c8a55fa7";
				var oParams = {};
				if (oEvent.mParameters.data.context) {
					this.sContext = oEvent.mParameters.data.context;
				} else {
					if (this.getOwnerComponent().getComponentData()) {
						var patternConvert = function (oParam) {
							if (Object.keys(oParam).length !== 0) {
								for (var prop in oParam) {
									if (prop !== "sourcePrototype" && prop.includes("Set")) {
										return prop + "(" + oParam[prop][0] + ")";
									}
								}
							}
						};
						this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);
					}
				}
				var oPath;
				if (this.sContext) {
					oPath = {
						path: "/" + this.sContext,
						parameters: oParams
					};
					this.getView().bindObject(oPath);
				}
			},
			editMainitem: function (oEvent) {
				var sDialogName = "Dialog5";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new Dialog5(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("ClubBonusCommittee");
				oDialog._oControl.setBindingContext(context, "ClubBonusCommittee");
				oDialog.open();
			},
			
			// 	editMainitem: function (oEvent) {
			// 		var sDialogName = "Dialog5";
			// 	this.mDialogs = this.mDialogs || {};
			// 	var oDialog = this.mDialogs[sDialogName];
			// 	if (!oDialog) {
			// 		oDialog = new Dialog5(this.getView());
			// 		this.mDialogs[sDialogName] = oDialog;
			// 		// For navigation.
			// 		oDialog.setRouter(this.oRouter);
			// 	}
			// 	var oContext = this.getView().getModel("ClubBonusCommittee").createEntry("/MAINITEMS");
			// 	oDialog._oControl.setBindingContext(oContext, "ClubBonusCommittee");
			// 	oDialog.open();
			// },
			
			
			
			
		
			addBonusGoal: function (oEvent) {
				var sDialogName = "AddCommitteeGoal";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new AddCommitteeGoal(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				var oContext = this.getView().getModel("ClubBonusCommittee").createEntry("/CLUBBONUSGOALS");
				oDialog._oControl.setBindingContext(oContext, "ClubBonusCommittee");
				oDialog.open();
			},
			editBonusGoal: function (oEvent) {
				var sDialogName = "AddCommitteeGoal";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new AddCommitteeGoal(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("ClubBonusCommittee");
				oDialog._oControl.setBindingContext(context, "ClubBonusCommittee");
				oDialog.open();
			},
			onRemoveRow: function (oEvent) {
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
				var that = this,
					sPath = oEvent.getSource().getParent().getBindingContext("ClubBonusCommittee").getPath(),
					oModel = that.getView().getModel("ClubBonusCommittee");
				MessageBox.confirm(oResourceBundle.getText("ConfirmEditSubmit"), {
					onClose: function (oAction) {
						if (oAction === sap.m.MessageBox.Action.OK) {
							oModel.remove(sPath, {
								success: function (oData) {
									sap.m.MessageToast.show(oResourceBundle.getText("Success"));
									oModel.refresh();
								},
								error: function (oError) {
									sap.m.MessageToast.show(oResourceBundle.getText("err"));
								}
							});
						}
					}
				});
			},
			addplayerbonus: function (oEvent) {
				var sDialogName = "addPlayerBonus";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new addPlayerBonus(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				var oContext = this.getView().getModel("ClubBonusCommittee").createEntry("/CLUBBONUSPLAYERS");
				oDialog._oControl.setBindingContext(oContext, "ClubBonusCommittee");
				oDialog.open();
			},
			editplayerbonus: function (oEvent) {
				var sDialogName = "addPlayerBonus";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new addPlayerBonus(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("ClubBonusCommittee");
				oDialog._oControl.setBindingContext(context, "ClubBonusCommittee");
				oDialog.open();
			},
			addadminbonus: function (oEvent) {
				var sDialogName = "addCoachBonus";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new addCoachBonus(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				var oContext = this.getView().getModel("ClubBonusCommittee").createEntry("/CLUBBONUSADMINS");
				oDialog._oControl.setBindingContext(oContext, "ClubBonusCommittee");
				oDialog.open();
			},
			editadminbonus: function (oEvent) {
				var sDialogName = "addCoachBonus";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new addCoachBonus(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("ClubBonusCommittee");
				oDialog._oControl.setBindingContext(context, "ClubBonusCommittee");
				oDialog.open();
			},
			onInit: function () {
				var that = this;
				this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				this.getOwnerComponent().getModel("ClubBonusCommittee").read("/MAINITEMS", {
					success: function (oData) {
						// console.log(oData.results.slice(-1).pop().id);
						that.getView().byId("text31").bindElement("ClubBonusCommittee>/MAINITEMS(" + oData.results.slice(-1).pop().id + "l)");
					},
					error: function (oError) {}
				}); // this.oRouter.getTarget("Page1").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			},
			/**
			 *@memberOf pwc.portal.eval.ClubEvaluations.view.Applications.ClubBonusCommittee.controller.Page1
			 */
			Pressrow1: function (oEvent) {
				var sDialogName = "CopyOfAddCommitteeGoal";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new CopyOfAddCommitteeGoal(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("ClubBonusCommittee");
				oDialog._oControl.setBindingContext(context, "ClubBonusCommittee");
				oDialog.open();
			},
			/**
			 *@memberOf pwc.portal.eval.ClubEvaluations.view.Applications.ClubBonusCommittee.controller.Page1
			 */
			PressRow2: function (oEvent) {
					var sDialogName = "CopyOfaddPlayerBonus";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new CopyOfaddPlayerBonus(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("ClubBonusCommittee");
				oDialog._oControl.setBindingContext(context, "ClubBonusCommittee");
				oDialog.open();
			},
			/**
			 *@memberOf pwc.portal.eval.ClubEvaluations.view.Applications.ClubBonusCommittee.controller.Page1
			 */
			PressRow3: function (oEvent) {
	var sDialogName = "CopyOfaddCoachBonus";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new CopyOfaddCoachBonus(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("ClubBonusCommittee");
				oDialog._oControl.setBindingContext(context, "ClubBonusCommittee");
				oDialog.open();			}
		});
	}, /* bExport= */
	true);
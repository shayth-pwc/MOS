sap.ui.define([
		"pwc/portal/eval/ClubEvaluations/controller/BaseController",
		"sap/m/MessageBox",
		"./Dialog1",
		"./Dialog2",
			"./CopyOfDialog1",
		"./CopyOfDialog2",
		"./utilities",
		"sap/ui/core/routing/History",
		"pwc/portal/eval/ClubEvaluations/service/RepoService"
	], function (BaseController, MessageBox, Dialog1, Dialog2,CopyOfDialog1,CopyOfDialog2, Utilities, History, RepoService) {
		"use strict";
		return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.ReportingStrategy.controller.Page1", {
			handleRouteMatched: function (oEvent) {
				var sAppId = "App629dcc89fb75ae01ca545768";
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
			addDocument1: function (oEvent) {
				var sDialogName = "Dialog1";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new Dialog1(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				var oContext = this.getView().getModel("ReportingStrategy").createEntry("/REPORTING1");
				oDialog._oControl.setBindingContext(oContext, "ReportingStrategy");
				oDialog.open();
			},
			editDocument1: function (oEvent) {
				var sDialogName = "Dialog1";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new Dialog1(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("ReportingStrategy");
				oDialog._oControl.setBindingContext(context, "ReportingStrategy");
				oDialog.open();
			},
			onRemoveRow: function (oEvent) {
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
				var that = this,
					sPath = oEvent.getSource().getParent().getBindingContext("ReportingStrategy").getPath(),
					oModel = that.getView().getModel("ReportingStrategy");
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
			addDocument2: function (oEvent) {
				var sDialogName = "Dialog2";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new Dialog2(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				var oContext = this.getView().getModel("ReportingStrategy").createEntry("/REPORTING2");
				oDialog._oControl.setBindingContext(oContext, "ReportingStrategy");
				oDialog.open();
			},
			editDocument2: function (oEvent) {
				var sDialogName = "Dialog2";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new Dialog2(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("ReportingStrategy");
				oDialog._oControl.setBindingContext(context, "ReportingStrategy");
				oDialog.open();
			},
			deleteDocument2: function (oEvent) {
				var sPath = oEvent.getSource().getParent().getBindingContext("ReportingStrategy").getPath();
				if (sPath) {
					return new Promise(function (fnResolve, fnReject) {
						oEvent.getSource().getParent().getModel("ReportingStrategy").remove(sPath, {
							success: function (oData) {
								fnResolve();
								sap.m.MessageToast.show("Entry Has been Deleted!", {
									onClose: fnResolve,
									duration: 0 || 3000
								});
								return;
							},
							error: function (oError) {
								sap.m.MessageBox.show(oError.message.value, {
									icon: sap.m.MessageBox.Icon.ERROR,
									title: "oError"
								});
								return;
							}
						});
						oEvent.getSource().getParent().getModel("ReportingStrategy").refresh();
					}).catch(function (err) {
						if (err !== undefined) {
							MessageBox.error(err.message);
						}
					});
				}
			},
			onInit: function () {
				this.oRouter = sap.ui.core.UIComponent.getRouterFor(this); // this.oRouter.getTarget("Page1").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			},
			openlink: function (oEvent) {
				var sLink = "";
				var filename = oEvent.getSource().getText();
				RepoService.getRepoId().then(function (ReposId) {
					sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + filename;
					window.open(sLink);
				});
			},
			/**
			 *@memberOf pwc.portal.eval.ClubEvaluations.view.Applications.ReportingStrategy.controller.Page1
			 */
			Press1: function (oEvent) {
				var sDialogName = "CopyOfDialog1";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new CopyOfDialog1(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("ReportingStrategy");
				oDialog._oControl.setBindingContext(context, "ReportingStrategy");
				oDialog.open();
			},
			/**
			 *@memberOf pwc.portal.eval.ClubEvaluations.view.Applications.ReportingStrategy.controller.Page1
			 */
			Press2: function (oEvent) {
	var sDialogName = "CopyOfDialog2";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new CopyOfDialog2(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("ReportingStrategy");
				oDialog._oControl.setBindingContext(context, "ReportingStrategy");
				oDialog.open();			}
		});
	}, /* bExport= */
	true);
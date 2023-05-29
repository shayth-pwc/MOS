sap.ui.define([
		"pwc/portal/eval/ClubEvaluations/controller/BaseController",
		"sap/m/MessageBox",
		"./AddBusinessPlan",
		"./CopyOfAddBusinessPlan",

		"./utilities",
		"sap/ui/core/routing/History",
		"pwc/portal/eval/ClubEvaluations/service/RepoService"
	], function (BaseController, MessageBox, AddBusinessPlan, CopyOfAddBusinessPlan, Utilities, History, RepoService) {
		"use strict";
		return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.HRBusinessPlan.controller.HumanResources", {
			handleRouteMatched: function (oEvent) {
				var sAppId = "App62664739f30c5c0347b264ab";
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

			addnewbusinessplan: function (oEvent) {
				var sDialogName = "AddBusinessPlan";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new AddBusinessPlan(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				var oContext = this.getView().getModel("HRBusinessPlan").createEntry("/HRBUSINESSPLAN", {
					properties: {
						id: "-1",
						club_id: Math.floor(Math.random() * 1000) + "",
						club_plan_id: Math.floor(Math.random() * 1000) + "",
						document_type: "",
						document_description: "",

						creation_date_time: new Date(),
						changed_date_time: new Date(),
						// created_by: sap.ushell.Container.getService("UserInfo").getId(),
						// changed_by: sap.ushell.Container.getService("UserInfo").getId(),
						// CREATED_BY_NAME: sap.ushell.Container.getService("UserInfo").getId(),
						// CHANGED_BY_NAME: sap.ushell.Container.getService("UserInfo").getId(),
						proof_cmis_id: ""
					}
				});
				oDialog._oControl.setBindingContext(oContext, "HRBusinessPlan");
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
			editbusinessplan: function (e) {
				var t = "AddBusinessPlan";
				this.mDialogs = this.mDialogs || {};
				var i = this.mDialogs[t];
				if (!i) {
					i = new AddBusinessPlan(this.getView());
					this.mDialogs[t] = i;
					i.setRouter(this.oRouter);
				}
				var o = e.getSource().getBindingContext("HRBusinessPlan");
				i._oControl.setBindingContext(o, "HRBusinessPlan");
				i.open();
			},
			deletebusinessplan: function (oEvent) {
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
				var that = this,
					sPath = oEvent.getSource().getParent().getBindingContext("HRBusinessPlan").getPath(),
					oModel = that.getView().getModel("HRBusinessPlan");
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
			doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
				var sPath = oBindingContext ? oBindingContext.getPath() : null;
				var oModel = oBindingContext ? oBindingContext.getModel("HRBusinessPlan") : null;
				var sEntityNameSet;
				if (sPath !== null && sPath !== "") {
					if (sPath.substring(0, 1) === "/") {
						sPath = sPath.substring(1);
					}
					sEntityNameSet = sPath.split("(")[0];
				}
				var sNavigationPropertyName;
				var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;
				if (sEntityNameSet !== null) {
					sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet,
						sRouteName);
				}
				if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
					if (sNavigationPropertyName === "") {
						this.oRouter.navTo(sRouteName, {
							context: sPath,
							masterContext: sMasterContext
						}, false);
					} else {
						oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function (bindingContext) {
							if (bindingContext) {
								sPath = bindingContext.getPath();
								if (sPath.substring(0, 1) === "/") {
									sPath = sPath.substring(1);
								}
							} else {
								sPath = "undefined";
							}
							// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
							if (sPath === "undefined") {
								this.oRouter.navTo(sRouteName);
							} else {
								this.oRouter.navTo(sRouteName, {
									context: sPath,
									masterContext: sMasterContext
								}, false);
							}
						}.bind(this));
					}
				} else {
					this.oRouter.navTo(sRouteName);
				}
				if (typeof fnPromiseResolve === "function") {
					fnPromiseResolve();
				}
			},
			_onRowPress1: function (oEvent) {
				var oBindingContext = oEvent.getSource().getBindingContext("HRBusinessPlan");
				return new Promise(function (fnResolve) {
					this.doNavigate("HumanResources", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
			},
			onInit: function () {
				this.oRouter = sap.ui.core.UIComponent.getRouterFor(this); // this.oRouter.getTarget("HumanResources").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
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
			 *@memberOf pwc.portal.eval.ClubEvaluations.view.Applications.HRBusinessPlan.controller.HumanResources
			 */
			press1: function (e) {
				var t = "CopyofAddBusinessPlan";
				this.mDialogs = this.mDialogs || {};
				var i = this.mDialogs[t];
				if (!i) {
					i = new CopyOfAddBusinessPlan(this.getView());
					this.mDialogs[t] = i;
					i.setRouter(this.oRouter);
				}
				var o = e.getSource().getBindingContext("HRBusinessPlan");
				i._oControl.setBindingContext(o, "HRBusinessPlan");
				i.open();
			}
		});
	}, /* bExport= */
	true);
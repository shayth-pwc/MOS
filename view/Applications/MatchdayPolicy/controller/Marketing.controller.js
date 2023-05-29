sap.ui.define([
		"pwc/portal/eval/ClubEvaluations/controller/BaseController",
		"sap/m/MessageBox",
		"./AddMatchdayPolicy",
		"./CopyOfAddMatchdayPolicy",

		"./Dialog9",
		"./utilities",
		"sap/ui/core/routing/History",
		"sap/ui/model/json/JSONModel",
		"pwc/portal/eval/ClubEvaluations/service/RepoService"
	], function (BaseController, MessageBox, AddMatchdayPolicy, CopyOfAddMatchdayPolicy, Dialog9, Utilities, History, JSONModel, RepoService) {
		"use strict";
		return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.MatchdayPolicy.controller.Marketing", {
			handleRouteMatched: function (oEvent) {
				var sAppId = "App624d33171cfbfb01d2ea7327";
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
			_onButtonPress: function (oEvent) {
				var sDialogName = "Dialog9";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new Dialog9(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				var context = oEvent.getSource().getBindingContext("MatchdayPolicy");
				oDialog._oControl.setBindingContext(context, "MatchdayPolicy");
				oDialog.open();
			},
			_onButtonPress1: function (oEvent) {
				var sDialogName = "AddMatchdayPolicy";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new AddMatchdayPolicy(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				var context = oEvent.getSource().getBindingContext("MatchdayPolicy");
				oDialog._oControl.setBindingContext(context, "MatchdayPolicy");
				oDialog.open();
			},
			_onButtonPress2: function (oEvent) {
				var sDialogName = "AddWebsiteQuality";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new AddWebsiteQuality(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				var context = oEvent.getSource().getBindingContext("MatchdayPolicy");
				oDialog._oControl.setBindingContext(context);
				oDialog.open();
			},
			onInit: function () {
				this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				// this.oRouter.getTarget("Marketing").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
				var omodel = this.getView().getModel("MatchdayPolicy");
				var oviewmodel = new JSONModel();
			},
			addmatchdaypolicy: function (oEvent) {
				var sDialogName = "AddMatchdayPolicy";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new AddMatchdayPolicy(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				var oContext = this.getView().getModel("MatchdayPolicy").createEntry("/MATCHPOLICIES", {
					properties: {
						id: "-1",
						club_id: Math.floor(Math.random() * 1000) + "",
						club_matchpolicy_id: Math.floor(Math.random() * 1000) + "",
						document_type: "",
						document_description: "",
						creation_date_time: new Date(),
						changed_date_time: new Date(),
						created_by: sap.ushell.Container.getService("UserInfo").getId(),
						changed_by: sap.ushell.Container.getService("UserInfo").getId(),
						CREATED_BY_NAME: sap.ushell.Container.getService("UserInfo").getId(),
						CHANGED_BY_NAME: sap.ushell.Container.getService("UserInfo").getId(),
						proof_cmis_id: "",
						match_date: new Date()
					}
				});
				oDialog._oControl.setBindingContext(oContext, "MatchdayPolicy");
				oDialog.open();
			},
			editmatchdaypolicy: function (e) {
				var t = "AddMatchdayPolicy";
				this.mDialogs = this.mDialogs || {};
				var i = this.mDialogs[t];
				if (!i) {
					i = new AddMatchdayPolicy(this.getView());
					this.mDialogs[t] = i;
					i.setRouter(this.oRouter);
				}
				var o = e.getSource().getBindingContext("MatchdayPolicy");
				i._oControl.setBindingContext(o, "MatchdayPolicy");
				i.open();
			},
			deletematchdaypolicy: function (oEvent) {
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
				var that = this,
					sPath = oEvent.getSource().getParent().getBindingContext("MatchdayPolicy").getPath(),
					oModel = that.getView().getModel("MatchdayPolicy");
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
			addwebsitequality: function (oEvent) {
				var sDialogName = "AddWebsiteQuality";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new AddWebsiteQuality(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				var oContext = this.getView().getModel("MatchdayPolicy").createEntry("/WEBSITEATTACHMENTS", {
					properties: {
						id: "-1",
						club_id: Math.floor(Math.random() * 1000) + "",
						document2_type: "",
						document2_description: "",
						relevant_url: "",
						creation_date_time: new Date(),
						changed_date_time: new Date(),
						created_by: sap.ushell.Container.getService("UserInfo").getId(),
						changed_by: sap.ushell.Container.getService("UserInfo").getId(),
						CREATED_BY_NAME: sap.ushell.Container.getService("UserInfo").getId(),
						CHANGED_BY_NAME: sap.ushell.Container.getService("UserInfo").getId(),
						proof_cmis_id: ""
					}
				});
				oDialog._oControl.setBindingContext(oContext, "MatchdayPolicy");
				oDialog.open();
			},
			editwebsitequality: function (e) {
				var t = "AddWebsiteQuality";
				this.mDialogs = this.mDialogs || {};
				var i = this.mDialogs[t];
				if (!i) {
					i = new AddWebsiteQuality(this.getView());
					this.mDialogs[t] = i;
					i.setRouter(this.oRouter);
				}
				var o = e.getSource().getBindingContext("MatchdayPolicy");
				i._oControl.setBindingContext(o, "MatchdayPolicy");
				i.open();
			},
			deletewebsitequality: function (oEvent) {
				var sPath = oEvent.getSource().getParent().getBindingContext("MatchdayPolicy").getPath();
				if (sPath) {
					return new Promise(function (fnResolve, fnReject) {
						oEvent.getSource().getParent().getModel("MatchdayPolicy").remove(sPath, {
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
						oEvent.getSource().getParent().getModel("MatchdayPolicy").refresh();
					}).catch(function (err) {
						if (err !== undefined) {
							MessageBox.error(err.message);
						}
					});
				}
			},
			addwebsiteinfo: function (oEvent) {
				var sDialogName = "Dialog9";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new Dialog9(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				var oContext = this.getView().getModel("MatchdayPolicy").createEntry("/WEBSITEDETAILS", {
					properties: {
						id: "-1",
						club_id: Math.floor(Math.random() * 1000) + "",
						website_link: "",
						website_description: "",
						creation_date_time: new Date(),
						changed_date_time: new Date(),
						created_by: sap.ushell.Container.getService("UserInfo").getId(),
						changed_by: sap.ushell.Container.getService("UserInfo").getId(),
						CREATED_BY_NAME: sap.ushell.Container.getService("UserInfo").getId(),
						CHANGED_BY_NAME: sap.ushell.Container.getService("UserInfo").getId()
					}
				});
				oDialog._oControl.setBindingContext(oContext, "MatchdayPolicy");
				oDialog.open();
			},
			editwebsiteinfo: function (e) {
				var t = "Dialog9";
				this.mDialogs = this.mDialogs || {};
				var i = this.mDialogs[t];
				if (!i) {
					i = new Dialog9(this.getView());
					this.mDialogs[t] = i;
					i.setRouter(this.oRouter);
				}
				var o = e.getSource().getBindingContext("MatchdayPolicy");
				i._oControl.setBindingContext(o, "MatchdayPolicy");
				i.open();
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
			 *@memberOf pwc.portal.eval.ClubEvaluations.view.Applications.MatchdayPolicy.controller.Marketing
			 */
			press1: function (e) {
				var t = "CopyOfAddMatchdayPolicy";
				this.mDialogs = this.mDialogs || {};
				var i = this.mDialogs[t];
				if (!i) {
					i = new CopyOfAddMatchdayPolicy(this.getView());
					this.mDialogs[t] = i;
					i.setRouter(this.oRouter);
				}
				var o = e.getSource().getBindingContext("MatchdayPolicy");
				i._oControl.setBindingContext(o, "MatchdayPolicy");
				i.open();
			}
		});
	}, /* bExport= */
	true);
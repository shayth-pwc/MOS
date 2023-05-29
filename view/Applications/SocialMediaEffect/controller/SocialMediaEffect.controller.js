sap.ui.define([
	"pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"sap/m/MessageBox",
	"./AddAccount", "./AddActivity", "./addDocument", "./EditAccount",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService"

], function (BaseController, MessageBox, AddAccount, AddActivity, addDocument, EditAccount, Utilities, History, RepoService) {
	"use strict";

	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.SocialMediaEffect.controller.SocialMediaEffect", {
		club_dms_id: '',
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

		// onAfterRendering: function () {
		// 	if (typeof sap.ui.getCore().AppContext === 'undefined') {
		// 		this.getOwnerComponent().getRouter().navTo("home");
		// 		this.destroy();
		// 	}
		// },

		addnewbusinessplan: function (oEvent) {

			var sDialogName = "AddAccount";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new AddAccount(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			console.log(this.getOwnerComponent().getModel("SocialMediaEff"));
			var oContext = this.getOwnerComponent().getModel("SocialMediaEff").createEntry("/SMACC");

			oDialog._oControl.setBindingContext(oContext, "SocialMediaEff");
			oDialog.open();

		},
		addnewactivity: function (oEvent) {

			var sDialogName = "AddActivity";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new AddActivity(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			console.log(this.getOwnerComponent().getModel("SocialMediaEff"));
			var oContext = this.getOwnerComponent().getModel("SocialMediaEff").createEntry("/SMACT");

			oDialog._oControl.setBindingContext(oContext, "SocialMediaEff");
			oDialog.open();

		},
		editbusinessplan: function (e) {
			var t = "EditAccount";
			this.mDialogs = this.mDialogs || {};
			var i = this.mDialogs[t];
			if (!i) {
				i = new EditAccount(this.getView());
				this.mDialogs[t] = i;
				i.setRouter(this.oRouter)
			}
			var o = e.getSource().getBindingContext("SocialMediaEff");
			i._oControl.setBindingContext(o, "SocialMediaEff");
			i.open()
		},

		deletebusinessplan: function (oEvent) {

			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var that = this,
				sPath = oEvent.getSource().getParent().getBindingContext("SocialMediaEff").getPath(),
				oModel = that.getView().getModel("SocialMediaEff");
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
		

		AddActivity: function (oEvent) {

			var sDialogName = "AddActivity";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new AddActivity(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			var oContext = this.getOwnerComponent().getModel("SocialMediaEff").createEntry("/SMACT");

			oDialog._oControl.setBindingContext(oContext, "SocialMediaEff");
			oDialog.open();

		},
		editDecision: function (e) {
			var t = "AddActivity";
			this.mDialogs = this.mDialogs || {};
			var i = this.mDialogs[t];
			if (!i) {
				i = new AddActivity(this.getView());
				this.mDialogs[t] = i;
				i.setRouter(this.oRouter)
			}
			var o = e.getSource().getBindingContext("SocialMediaEff");
			i._oControl.setBindingContext(o, "SocialMediaEff");
			i.open()
		},

		deleteDecision: function (oEvent) {
			var that = this;
			var ConfirmSubmit = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Confirm');
			var sPath = oEvent.getSource().getParent().getBindingContext("SocialMediaEff").getPath();
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			if (sPath) {
				sap.m.MessageBox.show(ConfirmSubmit, {
					icon: sap.m.MessageBox.Icon.QUESTION,
					title: that.getOwnerComponent().getModel("i18n").getResourceBundle().getText("Confirm"),
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === "YES") {

							return new Promise(function (fnResolve, fnReject) {
								that._oODataModel.remove(sPath, {
									success: function (oData) {
										fnResolve();
										sap.m.MessageToast.show(oResourceBundle.getText("EntryDeleted"), {
											onClose: fnResolve,
											duration: 0 || 3000
										});

										return;
									},
									error: function (oError) {
										MessageBox.show(oError.message.value, {
											icon: sap.m.MessageBox.Icon.ERROR,
											title: "oError"
										});
										return;
									}
								});
								that._oODataModel.refresh();
							}).catch(function (err) {
								if (err !== undefined) {
									MessageBox.error(err.message);
								}
							});
						} else {
							return;
						}
					}
				})

			}

		},

		addDocument: function (oEvent) {
			var sDialogName = "addDocument";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new addDocument(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			var oContext = this.getOwnerComponent().getModel("SocialMediaEff").createEntry("/SMDOC");
			oDialog._oControl.setBindingContext(oContext, "SocialMediaEff");
			oDialog.open();
		},

		editprocedure: function (e) {
			var t = "addDocument";
			this.mDialogs = this.mDialogs || {};
			var i = this.mDialogs[t];
			if (!i) {
				i = new addDocument(this.getView());
				this.mDialogs[t] = i;
				i.setRouter(this.oRouter)
			}
			var o = e.getSource().getBindingContext("SocialMediaEff");
			i._oControl.setBindingContext(o, "SocialMediaEff");
			i.open()
		},

		deleteprocedure: function (oEvent) {

			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var that = this,
				sPath = oEvent.getSource().getParent().getBindingContext("SocialMediaEff").getPath(),
				oModel = that.getView().getModel("SocialMediaEff");
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

		_onOverflowToolbarButtonPress2: function (oEvent) {

			var sDialogName = "AddActivity";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new AddActivity(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext("SocialMediaEff");
			oDialog._oControl.setBindingContext(context, "SocialMediaEff");

			oDialog.open();

		},

		_onRowPress: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext("SocialMediaEff");

			return new Promise(function (fnResolve) {

				this.doNavigate("SocialMediaEffect", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},

		doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel("SocialMediaEff") : null;

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

			var oBindingContext = oEvent.getSource().getBindingContext("SocialMediaEff");

			return new Promise(function (fnResolve) {

				this.doNavigate("SocialMediaEffect", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oODataModel = this.getOwnerComponent().getModel("SocialMediaEffect");
			var that = this;
			this.getOwnerComponent().getModel("User").read("/UserClub", {
				success: function (oData) {
					that.club_dms_id = oData.results[0].club_dms_id;
				},
				error: function (oError) {}
			});

			// this.oRouter.getTarget("SocialMediaEffect").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

		},
		EditSocialMediaPlan: function (e) {
			var t = "AddActivity";
			this.mDialogs = this.mDialogs || {};
			var i = this.mDialogs[t];
			if (!i) {
				i = new AddActivity(this.getView());
				this.mDialogs[t] = i;
				i.setRouter(this.oRouter)
			}
			var o = e.getSource().getBindingContext("SocialMediaEff");
			i._oControl.setBindingContext(o, "SocialMediaEff");
			i.open()
		},

		openlink: function (oEvent) {
			var sLink = '';
			var filename = oEvent.getSource().getText();
			RepoService.getRepoId().then(function (ReposId) {
				sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + filename;
				window.open(sLink);
			});
		}
	});
}, /* bExport= */ true);
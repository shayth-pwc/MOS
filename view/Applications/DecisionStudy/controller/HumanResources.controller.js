sap.ui.define(["pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"sap/m/MessageBox",
	"./AddDecision",
	"./CopyOfAddDecision",

	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService"
], function (BaseController, MessageBox, AddDecision, CopyOfAddDecision, Utilities, History, RepoService) {
	"use strict";

	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.DecisionStudy.controller.HumanResources", {
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

		addDecision: function (oEvent) {

			var sDialogName = "AddDecision";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new AddDecision(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			var oContext = this.getView().getModel("DecisionStudy").createEntry("/HRDECISIONEVIDENCE", {
				properties: {

					decision_risk_type: ""

				}
			});

			oDialog._oControl.setBindingContext(oContext, "DecisionStudy");
			oDialog.open();

		},
		editDecision: function (e) {
			var t = "AddDecision";
			this.mDialogs = this.mDialogs || {};
			var i = this.mDialogs[t];
			if (!i) {
				i = new AddDecision(this.getView());
				this.mDialogs[t] = i;
				i.setRouter(this.oRouter)
			}
			var o = e.getSource().getBindingContext("DecisionStudy");
			i._oControl.setBindingContext(o, "DecisionStudy");
			i.open()
		},

		deleteDecision: function (oEvent) {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var that = this,
				sPath = oEvent.getSource().getParent().getBindingContext("DecisionStudy").getPath(),
				oModel = that.getView().getModel("DecisionStudy");
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

		_onOverflowToolbarButtonPress3: function (oEvent) {

			var sDialogName = "AddReviewPolicy";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new AddReviewPolicy(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext("DecisionStudy");
			oDialog._oControl.setBindingContext(context);

			oDialog.open();

		},
		_onOverflowToolbarButtonPress2: function (oEvent) {

			var sDialogName = "AddDecision";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new AddDecision(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext("DecisionStudy");
			oDialog._oControl.setBindingContext(context);

			oDialog.open();

		},
		_onRowPress: function (e) {

			var t = "CopyOfAddDecision";
			this.mDialogs = this.mDialogs || {};
			var i = this.mDialogs[t];
			if (!i) {
				i = new CopyOfAddDecision(this.getView());
				this.mDialogs[t] = i;
				i.setRouter(this.oRouter)
			}
			var o = e.getSource().getBindingContext("DecisionStudy");
			i._oControl.setBindingContext(o, "DecisionStudy");
			i.open()

		},
		doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel("DecisionStudy") : null;

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

			var oBindingContext = oEvent.getSource().getBindingContext("DecisionStudy");

			return new Promise(function (fnResolve) {

				this.doNavigate("HumanResources", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// this.oRouter.getTarget("HumanResources").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

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
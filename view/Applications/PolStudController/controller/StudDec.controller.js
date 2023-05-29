sap.ui.define([
		"pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"sap/m/MessageBox",
	 "./AddDecision", 
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService"

], function(BaseController, MessageBox, AddDecision, Utilities, History,RepoService) {
	"use strict";

	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.PolStudController.controller.StudDec", {
		handleRouteMatched: function(oEvent) {
			var sAppId = "App62664739f30c5c0347b264ab";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function(oParam) {
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
							// onAfterRendering: function () {
       //         if (typeof sap.ui.getCore().AppContext === 'undefined') {
       //             this.getOwnerComponent().getRouter().navTo("home");
       //             this.destroy();
       //         }
       //     },

	addDecision: function(oEvent) {

			var sDialogName = "AddDecision";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new AddDecision(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
	var oContext = this.getView().getModel("PolicyStudec").createEntry("/HRDECISIONS");

			oDialog._oControl.setBindingContext(oContext, "PolicyStudec");
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
			var o = e.getSource().getBindingContext("PolicyStudec");
			i._oControl.setBindingContext(o, "PolicyStudec");
			i.open()
		},
		
		deleteDecision: function (oEvent) {
			var sPath = oEvent.getSource().getParent().getBindingContext("PolicyStudec").getPath();
			if (sPath) {
				return new Promise(function (fnResolve, fnReject) {
				oEvent.getSource().getParent().getModel("PolicyStudec").remove(sPath,{
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
				oEvent.getSource().getParent().getModel("PolicyStudec").refresh();
			}).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}});
		}
	},
	

		_onOverflowToolbarButtonPress2: function(oEvent) {

			var sDialogName = "AddDecision";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new AddDecision(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext("PolicyStudec");
			oDialog._oControl.setBindingContext(context, "PolicyStudec");

			oDialog.open();

		},
		_onRowPress: function(oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext("PolicyStudec");

			return new Promise(function(fnResolve) {

				this.doNavigate("StudDec", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		doNavigate: function(sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel("PolicyStudec") : null;

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
				sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet, sRouteName);
			}
			if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
				if (sNavigationPropertyName === "") {
					this.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function(bindingContext) {
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
	
		_onRowPress1: function(oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext("PolicyStudec");

			return new Promise(function(fnResolve) {

				this.doNavigate("StudDec", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// this.oRouter.getTarget("StudDec").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

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

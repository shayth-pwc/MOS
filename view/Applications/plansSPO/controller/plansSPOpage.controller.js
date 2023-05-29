sap.ui.define([
	"pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"sap/m/MessageBox",
	"./plansSPOreview", "./plansSPOcreate",
	"./utilities",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService"
], function (BaseController, MessageBox, plansSPOreview, plansSPOcreate, Utilities, Sorter, Filter, FilterOperator, FilterType, History,
	RepoService) {
	"use strict";

	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.plansSPO.controller.plansSPOpage", {
		club_dms_id: '',
		// onCriteria: function (oEvent) {
		// 	var oListCount = oEvent.getSource().getAggregation("items").length;
		// 	for (var r = 0; r < oListCount; r++) {
		// 		if (oEvent.getSource().getAggregation("items")[r].getSelected()) {
		// 			oEvent.getSource().getAggregation("items")[r].setHighlight('Success');
		// 			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
		// 			oEvent.getSource().setHeaderText(oResourceBundle.getText("EvaluationCriteriaScore", oEvent.getSource().getAggregation("items")[r]
		// 				.getTitle().charAt(0)));
		// 		} else {
		// 			oEvent.getSource().getAggregation("items")[r].setHighlight('None');
		// 		}
		// 	}
		// },
		// onAfterRendering: function () {
		// 	if (typeof sap.ui.getCore().AppContext === 'undefined') {
		// 		this.getOwnerComponent().getRouter().navTo("home");
		// 		this.destroy();
		// 	}
		// },

		handleRouteMatched: function (oEvent) {
			var sAppId = "App628ea63ff6b3d701d130dc02";

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
		_onButtonPress: function (oEvent) {

			var sDialogName = "plansSPOcreate";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new plansSPOcreate(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var oContext = this.getView().getModel("plansSPO").createEntry("/PLANSSPORTS", {
				properties: {
					club_dept_name: ''

				}
			});
			oDialog._oControl.setBindingContext(oContext, "plansSPO");

			oDialog.open();

		},
		// _onButtonPress: function (oEvent) {
		// 	var sDialogName = "plansSPOcreate";
		// 	this.mDialogs = this.mDialogs || {};
		// 	var oDialog = this.mDialogs[sDialogName];
		// 	if (!oDialog) {
		// 		oDialog = new plansSPOcreate(this.getView());
		// 		this.mDialogs[sDialogName] = oDialog;
		// 		// For navigation.
		// 		oDialog.setRouter(this.oRouter);
		// 	}
		// 	var oContext = this.getView().getModel("plansSPO").createEntry("/PLANSSPORTS");
		// 	oDialog._oControl.setBindingContext(oContext, "plansSPO");
		// 	oDialog.open();
		// },
		_onRowPress: function (oEvent) {

			var context = oEvent.getSource().getBindingContext("plansSPO");
			console.log(oEvent.getSource().getBindingContext("plansSPO"));
			var sDialogName = "plansSPOreview";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			return new Promise(function (fnResolve) {

				if (!oDialog) {
					oDialog = new plansSPOreview(this.getView());
					this.mDialogs[sDialogName] = oDialog;

					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				oDialog._oControl.bindElement("plansSPO>" + context.sPath);
				oDialog.open();
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

			// var sDialogName = "Review";
			// this.mDialogs = this.mDialogs || {};
			// var oDialog = this.mDialogs[sDialogName];
			// if (!oDialog) {
			// 	oDialog = new Review(this.getView());
			// 	this.mDialogs[sDialogName] = oDialog;

			// 	// For navigation.
			// 	oDialog.setRouter(this.oRouter);
			// }

			// var context = oEvent.getSource().getBindingContext();
			// oDialog._oControl.setBindingContext(context);

			// oDialog.open();

		},

		// doNavigate: function(sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
		// 	var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
		// 	var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

		// 	var sEntityNameSet;
		// 	if (sPath !== null && sPath !== "") {
		// 		if (sPath.substring(0, 1) === "/") {
		// 			sPath = sPath.substring(1);
		// 		}
		// 		sEntityNameSet = sPath.split("(")[0];
		// 	}
		// 	var sNavigationPropertyName;
		// 	var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

		// 	if (sEntityNameSet !== null) {
		// 		sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet, sRouteName);
		// 	}
		// 	if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
		// 		if (sNavigationPropertyName === "") {
		// 			this.oRouter.navTo(sRouteName, {
		// 				context: sPath,
		// 				masterContext: sMasterContext
		// 			}, false);
		// 		} else {
		// 			oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function(bindingContext) {
		// 				if (bindingContext) {
		// 					sPath = bindingContext.getPath();
		// 					if (sPath.substring(0, 1) === "/") {
		// 						sPath = sPath.substring(1);
		// 					}
		// 				} else {
		// 					sPath = "undefined";
		// 				}

		// 				// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
		// 				if (sPath === "undefined") {
		// 					this.oRouter.navTo(sRouteName);
		// 				} else {
		// 					this.oRouter.navTo(sRouteName, {
		// 						context: sPath,
		// 						masterContext: sMasterContext
		// 					}, false);
		// 				}
		// 			}.bind(this));
		// 		}
		// 	} else {
		// 		this.oRouter.navTo(sRouteName);
		// 	}

		// 	if (typeof fnPromiseResolve === "function") {
		// 		fnPromiseResolve();
		// 	}

		// },

		_onRowPress1: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext("plansSPO");

			return new Promise(function (fnResolve) {

				this.doNavigate("Model", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},

		_onDeleteRow: function (oEvent) {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var that = this,
				sPath = oEvent.getSource().getParent().getBindingContext("plansSPO").getPath(),
				oModel = that.getView().getModel("plansSPO");
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

		_onEditRow: function (oEvent) {

			var sDialogName = "plansSPOcreate";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new plansSPOcreate(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			// Set the Binding Context to the Dialog
			var context = oEvent.getSource().getBindingContext("plansSPO");
			oDialog._oControl.bindElement("plansSPO>" + context.sPath);
			oDialog._Event = oEvent.getSource().getId();
			oDialog.open();

		},

		onSearch: function () {
			var oView = this.getView(),
				sValue = oView.byId("searchField").getValue(),
				oFilter = new Filter("goal_title", FilterOperator.Contains, sValue);

			oView.byId("plansSpo").getBinding("items").filter(oFilter, FilterType.Application);
		},

		onSort: function () {
			var oView = this.getView(),
				aStates = [undefined, "asc", "desc"],
				aStateTextIds = ["sortNone", "sortAscending", "sortDescending"],
				sMessage,
				iOrder = oView.getModel("plansSPO").getProperty("plansSPO>/order");
			console.log(iOrder);
			iOrder = (iOrder + 1) % aStates.length;
			var sOrder = aStates[iOrder];

			oView.getModel("plansSPO").setProperty("plansSPO>/order", iOrder);
			oView.byId("plansSpo").getBinding("items").sort(sOrder && new Sorter("related_department", sOrder === "desc"));

			// sMessage = this._getText("sortMessage", [this._getText(aStateTextIds[iOrder])]);
			// MessageToast.show(sMessage);
		},

		openlink: function (oEvent) {
			var sLink = '';
			var filename = oEvent.getSource().getText();
			RepoService.getRepoId().then(function (ReposId) {
				sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + filename;
				window.open(sLink);
			});
		},
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oODataModel = this.getOwnerComponent().getModel("plansSPO");
			var that = this;
			this.getOwnerComponent().getModel("User").read("/UserClub", {
				success: function (oData) {
					that.club_dms_id = oData.results[0].club_dms_id;
				},
				error: function (oError) {}
			});
			var oJSONData = {
				order: 0
			}

			// this.oRouter.getTarget("plansSPOpage").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

		}
	});
}, /* bExport= */ true);
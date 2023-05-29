sap.ui.define([
	'pwc/portal/eval/ClubEvaluations/controller/BaseController',
	"sap/m/MessageBox",
	"./plansCEOreview", "./plansCEOcreate",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService"
], function (BaseController, MessageBox, plansCEOreview, plansCEOcreate, Utilities, History, RepoService) {
	"use strict";
	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.PlanCEO.controller.plansCEOpage", {
		club_dms_id: '',

		related_department_id: 0,
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
		// _onButtonPress: function (oEvent) {

		// 	var sDialogName = "plansCEOcreate";
		// 	this.mDialogs = this.mDialogs || {};
		// 	var oDialog = this.mDialogs[sDialogName];
		// 	if (!oDialog) {
		// 		oDialog = new plansCEOcreate(this.getView());
		// 		this.mDialogs[sDialogName] = oDialog;

		// 		// For navigation.
		// 		oDialog.setRouter(this.oRouter);
		// 	}
		// 	var that = this;

		// 	this.getOwnerComponent().getModel("plansCEO").read("/CEO_Dep", {
		// 		success: function (oData) {
		// 			var path = oData.results[0];
		// 			console.log(path.related_department);
		// 			var oContext = that.getView().getModel("plansCEO").createEntry("/PLANSCEO", {
		// 				properties: {

		// 					related_department: path.related_department

		// 				}
		// 			});
		// 			oDialog._oControl.bindElement("plansCEO>" + oContext.sPath);

		// 			oDialog.open();
		// 		},
		// 		error: function (oError) {}
		// 	});

		// },

		_onButtonPress: function (oEvent) {
			var sDialogName = "plansCEOcreate";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new plansCEOcreate(this.getView());
				this.mDialogs[sDialogName] = oDialog;
				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			var oContext = this.getView().getModel("plansCEO").createEntry("/PLANSCEO");
			oDialog._oControl.setBindingContext(oContext, "plansCEO");
			oDialog.open();
		},

		_onRowPress: function (oEvent) {

			var context = oEvent.getSource().getBindingContext("plansCEO");
			console.log(oEvent.getSource().getBindingContext("plansCEO"));
			var sDialogName = "plansCEOreview";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			return new Promise(function (fnResolve) {

				if (!oDialog) {
					oDialog = new plansCEOreview(this.getView());
					this.mDialogs[sDialogName] = oDialog;

					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				oDialog._oControl.bindElement("plansCEO>" + context.sPath);
				oDialog.open();
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},

		// onAfterRendering: function () {
		// 	if (typeof sap.ui.getCore().AppContext === 'undefined') {
		// 		this.getOwnerComponent().getRouter().navTo("home");
		// 		this.destroy();
		// 	}
		// },

		_onRowPress1: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext("plansCEO");

			return new Promise(function (fnResolve) {

				this.doNavigate("Model", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		// _onDeleteRow: function (oEvent) {
		// 	var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
		// 	var that = this,
		// 		sPath = oEvent.getSource().getParent().getBindingContext("plansCEO").getPath(),
		// 		oModel = that.getView().getModel("plansCEO");
		// 	MessageBox.confirm(oResourceBundle.getText('ConfirmEditSubmit'), {
		// 		onClose: function (oAction) {
		// 			if (oAction === sap.m.MessageBox.Action.OK) {
		// 				oModel.remove(sPath, {
		// 					success: function (oData) {
		// 						sap.m.MessageToast.show(oResourceBundle.getText('Success'));
		// 						oModel.refresh();
		// 					},
		// 					error: function (oError) {
		// 						sap.m.MessageToast.show(oResourceBundle.getText('err'));
		// 					}
		// 				});
		// 			}
		// 		}
		// 	});

		// },

		_onDeleteRow: function (oEvent) {
			var that = this;
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			var sPath = oEvent.getSource().getParent().getBindingContext("plansCEO").getPath();

			var oModel = this.getView().getModel("plansCEO");
			oModel.setProperty(sPath + "/DELETED", "1");

			sap.m.MessageBox.confirm(that.getResourceBundle().getText("DeleteMSG"), { //Translate   "Are you sure you want to delete this Group?"
				onClose: function (oAction) {
					if (oAction === sap.m.MessageBox.Action.OK) {
						oModel.submitChanges({
							success: function (param) {
								sap.m.MessageToast.show(oResourceBundle.getText('Success'));
								oModel.refresh();

							},
							error: function (param) {
								sap.m.MessageToast.show(oResourceBundle.getText('err'));

							}
						});
					}
				}
			});

		},

		_onEditRow: function (oEvent) {

			var sDialogName = "plansCEOcreate";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new plansCEOcreate(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			// Set the Binding Context to the Dialog
			var context = oEvent.getSource().getBindingContext("plansCEO");
			oDialog._oControl.bindElement("plansCEO>" + context.sPath);
			oDialog._Event = oEvent.getSource().getId();
			oDialog.open();

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
			this._oODataModel = this.getOwnerComponent().getModel("plansCEO");
			var that = this;
			this.getOwnerComponent().getModel("User").read("/UserClub", {
				success: function (oData) {
					that.club_dms_id = oData.results[0].club_dms_id;
				},
				error: function (oError) {}
			});

			// this.oRouter.getTarget("plansCEOpage").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

		}
	});
}, /* bExport= */ true);
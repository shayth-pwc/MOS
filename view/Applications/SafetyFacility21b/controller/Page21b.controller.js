sap.ui.define([
	"pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"sap/m/MessageBox",
	"./Review21b", "./Review121b", "./Create21b", "./Create121b",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService"
], function (BaseController, MessageBox, Review21b, Review121b, Create21b, Create121b, Utilities, History, RepoService) {
	"use strict";

	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.SafetyFacility21b.controller.Page21b", {
		club_dms_id: '',
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

		// onAfterRendering: function () {
		// 	if (typeof sap.ui.getCore().AppContext === 'undefined') {
		// 		this.getOwnerComponent().getRouter().navTo("home");
		// 		this.destroy();
		// 	}
		// },

		_onButtonPress: function (oEvent) {

			var sDialogName = "Create21b";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Create21b(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var oContext = this.getView().getModel("pmuFacilities").createEntry("/FACILITIES", {
				properties: {
					maint_flag: '0'
				}

			});
			oDialog._oControl.bindElement("pmuFacilities>" + oContext.sPath);

			oDialog.open();

		},
		_onButtonPress1: function (oEvent) {

			var sDialogName = "Create121b";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Create121b(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var oContext = this.getView().getModel("pmuFacilities").createEntry("/FACILITIES1", {
				properties: {
					// facility_entry: "N/A",
					maint_flag: '1'
				}
			});
			oDialog._oControl.bindElement("pmuFacilities>" + oContext.sPath);

			oDialog.open();

		},

		_onRowPress: function (oEvent) {

			var sDialogName = "Review21b";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Review21b(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext("pmuFacilities");
			oDialog._oControl.bindElement("pmuFacilities>" + context.sPath);

			oDialog.open();

		},

		_onRowPress_1: function (oEvent) {

			var sDialogName = "Review121b";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Review121b(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext("pmuFacilities");
			oDialog._oControl.bindElement("pmuFacilities>" + context.sPath);

			oDialog.open();

		},

		_onDeleteRow: function (oEvent) {
			var that = this;
			var ConfirmSubmit = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Confirm');
			var sPath = oEvent.getSource().getParent().getBindingContext("pmuFacilities").getPath();
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
		_onEditRow: function (oEvent) {

			var sDialogName = "Create21b";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Create21b(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			// Set the Binding Context to the Dialog
			var context = oEvent.getSource().getBindingContext("pmuFacilities");
			oDialog._oControl.bindElement("pmuFacilities>" + context.sPath);
			oDialog._Event = oEvent.getSource().getId();
			oDialog.open();

		},

		_onEditRow1: function (oEvent) {

			var sDialogName = "Create121b";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Create121b(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			// Set the Binding Context to the Dialog
			var context = oEvent.getSource().getBindingContext("pmuFacilities");
			oDialog._oControl.bindElement("pmuFacilities>" + context.sPath);
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
			this._oODataModel = this.getOwnerComponent().getModel("pmuFacilities");
			var that = this;
			this.getOwnerComponent().getModel("User").read("/UserClub", {
				success: function (oData) {
					that.club_dms_id = oData.results[0].club_dms_id;
				},
				error: function (oError) {}
			});
			// this.oRouter.getTarget("Page21b").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

		},

		myFormatterDate: function (value) {

			var d = new Date(value),
				month = '' + (d.getMonth() + 1),
				day = '' + d.getDate(),
				year = d.getFullYear();

			if (month.length < 2) month = '0' + month;

			if (day.length < 2) day = '0' + day;

			return [year, month, day].join('-');

		}
	});
}, /* bExport= */ true);
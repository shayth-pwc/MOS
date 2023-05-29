sap.ui.define([
	"pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService",
	"sap/ui/core/Fragment", "./CreateSocialEvidence", "./ReviewSocialEvidence",
	'sap/ui/core/util/Export',
	'sap/ui/core/util/ExportTypeCSV',
	'sap/ui/model/json/JSONModel'
], function (BaseController, MessageBox, Utilities, History, RepoService, Fragment, CreateSocialEvidence, ReviewSocialEvidence, Export,
	ExportTypeCSV, JSONModel) {
	"use strict";

	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.socialevidence52G.controller.MainSocialEvidence", {

		// onAfterRendering: function () {
		//              if (typeof sap.ui.getCore().AppContext === 'undefined') {
		//                  this.getOwnerComponent().getRouter().navTo("home");
		//                  this.destroy();
		//              }
		//          },
		onDataExport: function (oEvent) {

			var oExport = new Export({

				// Type that will be used to generate the content. Own ExportType's can be created to support other formats
				exportType: new ExportTypeCSV({
					separatorChar: ";"
				}),

				// Pass in the model created above
				models: this.getView().getModel("socialevidence"),

				// binding information for the rows aggregation
				rows: {
					path: "/Activities"
				},

				// column definitions with column name and binding info for the content

				columns: [{
					name: "Product",
					template: {
						content: "{activity_name}"
					}
				}, {
					name: "Product ID",
					template: {
						content: "{ProductId}"
					}
				}, {
					name: "Supplier",
					template: {
						content: "{SupplierName}"
					}
				}, {
					name: "Dimensions",
					template: {
						content: {
							parts: ["Width", "Depth", "Height", "DimUnit"],
							formatter: function (width, depth, height, dimUnit) {
								return width + " x " + depth + " x " + height + " " + dimUnit;
							},
							state: "Warning"
						}
						// "{Width} x {Depth} x {Height} {DimUnit}"
					}
				}, {
					name: "Weight",
					template: {
						content: "{WeightMeasure} {WeightUnit}"
					}
				}, {
					name: "Price",
					template: {
						content: "{Price} {CurrencyCode}"
					}
				}]
			});

			// download exported file
			oExport.saveFile().catch(function (oError) {
				MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
			}).then(function () {
				oExport.destroy();
			});
		},
		_onDeleteRow: function (oEvent) {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var that = this,
				sPath = oEvent.getSource().getParent().getBindingContext("socialevidence").getPath(),
				oModel = that.getView().getModel("socialevidence");
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

		// _onDeleteRow: function(oEvent) {
		// 	var sPath = oEvent.getSource().getParent().getBindingContext("socialevidence").getPath();
		// 	var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
		// 	if (sPath) {
		// 		return new Promise(function (fnResolve, fnReject) {
		// 		oEvent.getSource().getParent().getModel("socialevidence").remove(sPath,{
		// 				success: function (oData) {

		// 					sap.m.MessageToast.show(oResourceBundle.getText("EntryDeleted"), {
		// 						onClose: fnResolve,
		// 						duration: 0 || 3000
		// 					});

		// 					return;
		// 				},
		// 				error: function (oError) {
		// 					MessageBox.show(oError.message.value, {
		// 						icon: sap.m.MessageBox.Icon.ERROR,
		// 						title: "oError"
		// 					});
		// 					return;
		// 				}
		// 			});
		// 		oEvent.getSource().getParent().getModel("socialevidence").refresh();
		// 	}).catch(function (err) {
		// 			if (err !== undefined) {
		// 				MessageBox.error(err.message);
		// 			}});
		// }

		// },
		_onCreateNewCardPress: function (oEvent) {

			var sDialogName = "CreateSocialEvidence";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new CreateSocialEvidence(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var oContext = this.getView().getModel("socialevidence").createEntry("/ActivitiesEvidence");
			oDialog._oControl.bindElement("socialevidence>" + oContext);

			oDialog.open();

		},
		_onRowCardPress: function (oEvent) {

			var sDialogName = "ReviewSocialEvidence";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new ReviewSocialEvidence(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext("socialevidence");
			oDialog._oControl.bindElement("socialevidence>" + context);

			oDialog.open();

		},
		_onEditCardRow: function (oEvent) {

			var sDialogName = "CreateSocialEvidence";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new CreateSocialEvidence(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			// Set the Binding Context to the Dialog
			var context = oEvent.getSource().getBindingContext("socialevidence");
			oDialog._oControl.bindElement("socialevidence>" + context);
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

		},

	});
}, /* bExport= */ true);
sap.ui.define([
	"pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"sap/m/MessageBox",
	"./AchievCEOReview", "./AchievCEOCreate",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService",
], function (BaseController, MessageBox, AchievCEOReview, AchievCEOCreate, Utilities, History, RepoService) {
	"use strict";

	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.achievceo.controller.AchievCEOPage", {
		related_department_id: '',
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
		renderPDF: function (oEvent) {
			//Generate the token
			var modeldata = oEvent.getSource().getBindingContext("achievCEO").sPath;

			var data = this.getOwnerComponent().getModel("achievCEO").getProperty(modeldata);
			console.log(data);

			//Build the xml data with the data from the model
			// console.log(data.activity_name);

			var xmldata = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><topmostSubform><TextField1>" + data.kpi_title +
				"</TextField1><TextField10>" + data.related_strategic_goal + "</TextField10><DateField1>" + data.target +
				"</DateField1><DateField2>" + data.actual_achievement + "</DateField2><TextField6>" + data.kpi_owner + "</TextField6><TextField4>" +
				data.reason_not_reaching_goal + "</TextField4></topmostSubform>";

			var encdata = btoa(unescape(encodeURIComponent(xmldata)));
			//prepare the render API call. Pick up the template from template store
			var jsondata = "{  " + "\"xdpTemplate\": \"" + "21c/21c" + "\", " + "\"xmlData\": \"" + encdata + "\"}";
			var url_render = "/render/v1/adsRender/pdf?templateSource=storageName";
			//make the API call
			$.ajax({
				url: url_render,
				type: "post",
				contentType: "application/json",
				data: jsondata,
				success: function (data, textStatus, jqXHR) {
					//once the API call is successfull, Display PDF on screen
					var decodedPdfContent = atob(data.fileContent);
					var byteArray = new Uint8Array(decodedPdfContent.length);
					for (var i = 0; i < decodedPdfContent.length; i++) {
						byteArray[i] = decodedPdfContent.charCodeAt(i);
					}
					var blob = new Blob([byteArray.buffer], {
						type: 'application/pdf'
					});
					var _pdfurl = URL.createObjectURL(blob);

					if (!this._PDFViewer) {
						this._PDFViewer = new sap.m.PDFViewer({
							width: "auto",
							source: _pdfurl
						});
						jQuery.sap.addUrlWhitelist("blob"); // register blob url as whitelist
					}

					this._PDFViewer.open();

				},
				error: function (data) {

				}
			});

		},
		// onAfterRendering: function () {
		// 	if (typeof sap.ui.getCore().AppContext === 'undefined') {
		// 		this.getOwnerComponent().getRouter().navTo("home");
		// 		this.destroy();
		// 	}
		// },

		_onButtonPress: function (oEvent) {

			var sDialogName = "AchievCEOCreate";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new AchievCEOCreate(this.getView());
				this.mDialogs[sDialogName] = oDialog;
				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			// var oContext = this.getView().getModel("BoardCharter").createEntry("BOARDCHARTERPOLICY");
			var oContext = this.getView().getModel("achievCEO").createEntry("ACHIEVEMENTSCEO", {
				properties: {
					kpi_type: 'CEO',
					kpi_method_of_measure: 'N/A',
					kpi_frequency_of_measure: 'N/A'
				}
			});
			oDialog._oControl.setBindingContext(oContext, "achievCEO");
			oDialog.open();

		},

		_onRowPress: function (oEvent) {

			var sDialogName = "AchievCEOReview";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new AchievCEOReview(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext("achievCEO");
			oDialog._oControl.setBindingContext(context, "achievCEO");

			oDialog.open();

		},
		_onDeleteRow: function (oEvent) {

			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var that = this,
				sPath = oEvent.getSource().getParent().getBindingContext("achievCEO").getPath(),
				oModel = that.getView().getModel("achievCEO");
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

			var sDialogName = "AchievCEOCreate";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new AchievCEOCreate(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext("achievCEO");
			oDialog._oControl.setBindingContext(context, "achievCEO");

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

		onInit: async function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oODataModel = this.getOwnerComponent().getModel("achievCEO");
			var that = this;
			this.getOwnerComponent().getModel("User").read("/UserClub", {
				success: function (oData) {
					that.club_dms_id = oData.results[0].club_dms_id;
				},
				error: function (oError) {}
			});
			this.getOwnerComponent().getModel("achievCEO").read("/CLUB_ORG_STRUC_EMP_CEOs", {
				success: function (oData) {
					var path = oData.results[0];
					console.log(path.Department_id);
					that.related_department_id = path.Department_id;

				},
				error: function (oError) {}
			});

		},

	});
}, /* bExport= */ true);
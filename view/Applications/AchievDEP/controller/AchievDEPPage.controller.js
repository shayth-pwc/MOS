sap.ui.define([
	"pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"sap/m/MessageBox",
	"./AchievDEPReview", "./AchievDEPCreate",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService",
], function (BaseController, MessageBox, AchievDEPReview, AchievDEPCreate, Utilities, History, RepoService) {
	"use strict";

	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.AchievDEP.controller.AchievDEPPage", {
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
			var modeldata = oEvent.getSource().getBindingContext("AchievDep").sPath;

			var data = this.getOwnerComponent().getModel("AchievDep").getProperty(modeldata);
			console.log(data);

			//Build the xml data with the data from the model
			// console.log(data.activity_name);

			var xmldata = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><topmostSubform><TextField1>" + data.kpi_title +
				"</TextField1><TextField10>" + data.related_strategic_goal + "</TextField10><DateField1>" + data.target +
				"</DateField1><DateField2>" + data.actual_achievement + "</DateField2><TextField6>" + data.kpi_owner + "</TextField6><TextField4>" +
				data.reason_not_reaching_goal + "</TextField4></topmostSubform>";

			var encdata = btoa(unescape(encodeURIComponent(xmldata)));
			//prepare the render API call. Pick up the template from template store
			var jsondata = "{  " + "\"xdpTemplate\": \"" + "22c/22c" + "\", " + "\"xmlData\": \"" + encdata + "\"}";
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

			var sDialogName = "AchievDEPCreate";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new AchievDEPCreate(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var oContext = this.getView().getModel("AchievDep").createEntry("/MAINPDEPARTMENT", {
				properties: {
					kpi_type: "Main Department",
					kpi_method_of_measure: "N/A",
					kpi_frequency_of_measure: "N/A"
				}
			});
			oDialog._oControl.setBindingContext(oContext, "AchievDep");

			oDialog.open();

		},
		_onRowPress: function (oEvent) {

			var sDialogName = "AchievDEPReview";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new AchievDEPReview(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext("AchievDep");
			oDialog._oControl.setBindingContext(context, "AchievDep");

			oDialog.open();

		},

		_onDeleteRow: function (oEvent) {
			var that = this;
			var ConfirmSubmit = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Confirm');
			var sPath = oEvent.getSource().getParent().getBindingContext("AchievDep").getPath();
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

			var sDialogName = "AchievDEPCreate";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new AchievDEPCreate(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext("AchievDep");
			oDialog._oControl.setBindingContext(context, "AchievDep");

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

		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oODataModel = this.getOwnerComponent().getModel("AchievDep");
			var that = this;
			this.getOwnerComponent().getModel("User").read("/UserClub", {
				success: function (oData) {
					that.club_dms_id = oData.results[0].club_dms_id;
				},
				error: function (oError) {}
			});

		}
	});
}, /* bExport= */ true);
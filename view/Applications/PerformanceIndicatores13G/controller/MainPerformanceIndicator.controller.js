sap.ui.define([
	"pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"sap/m/MessageBox",
	"./ReviewPerformanceIndicator", "./CreateNewPerformanceIndicator",
	"./utilities",
	"sap/ui/core/routing/History"
], function (BaseController, MessageBox, ReviewPerformanceIndicator, CreateNewPerformanceIndicator, Utilities, History) {
	"use strict";

	return BaseController.extend(
		"pwc.portal.eval.ClubEvaluations.view.Applications.PerformanceIndicatores13G.controller.MainPerformanceIndicator", {
			_onButtonPress: function (oEvent) {

				var sDialogName = "CreateNewPerformanceIndicator";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new CreateNewPerformanceIndicator(this.getView());
					this.mDialogs[sDialogName] = oDialog;

					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				var oContext = this.getView().getModel("performanceindicator").createEntry("/clubstrategykpi", {
					properties: {
						RELATED_KPI_OWNER: "1",
						RELATED_INITIATIVE_TITLE: "1",

					}
				});

				// var oContext = this.getView().getModel("performanceindicator").createEntry("/clubstrategykpi");
				oDialog._oControl.setBindingContext(oContext, "performanceindicator");

				oDialog.open();

			},
			renderPDF: function (oEvent) {
				//Generate the token
				var modeldata = oEvent.getSource().getBindingContext("performanceindicator").sPath;

				var data = this.getOwnerComponent().getModel("performanceindicator").getProperty(modeldata);
				console.log(data);

				//Build the xml data with the data from the model
				// console.log(data.activity_name);

				var xmldata = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><topmostSubform><TextField1>" + data.kpi_title +
					"</TextField1><TextField10>" + data.related_strategic_goal + "</TextField10><DateField1>" + data.target +
					"</DateField1><DateField2>" + data.Actual_Achievement + "</DateField2><TextField6>" + data.RELATED_KPI_OWNER +
					"</TextField6><TextField4>" + data.RELATED_KPI_OWNER + "</TextField4></topmostSubform>";

				var encdata = btoa(unescape(encodeURIComponent(xmldata)));
				//prepare the render API call. Pick up the template from template store
				var jsondata = "{  " + "\"xdpTemplate\": \"" + "13C/13c" + "\", " + "\"xmlData\": \"" + encdata + "\"}";
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
			_onRowPress: function (oEvent) {

				var sDialogName = "ReviewPerformanceIndicator";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new ReviewPerformanceIndicator(this.getView());
					this.mDialogs[sDialogName] = oDialog;

					// For navigation.
					oDialog.setRouter(this.oRouter);
				}

				var context = oEvent.getSource().getBindingContext("performanceindicator");
				oDialog._oControl.setBindingContext(context, "performanceindicator");

				oDialog.open();

			},
			_onDeleteRow: function (oEvent) {

				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
				var that = this,
					sPath = oEvent.getSource().getParent().getBindingContext("performanceindicator").getPath(),
					oModel = that.getView().getModel("performanceindicator");
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

				var sDialogName = "CreateNewPerformanceIndicator";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new CreateNewPerformanceIndicator(this.getView());
					this.mDialogs[sDialogName] = oDialog;

					// For navigation.
					oDialog.setRouter(this.oRouter);
				}

				var context = oEvent.getSource().getBindingContext("performanceindicator");
				oDialog._oControl.setBindingContext(context, "performanceindicator");

				oDialog.open();

			},
			onInit: function () {

			}
		});
}, /* bExport= */ true);
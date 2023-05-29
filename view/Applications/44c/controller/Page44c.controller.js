sap.ui.define([
	"pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"sap/m/MessageBox",
	"./Review44c", "./Create44c",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService",
	'sap/ui/export/Spreadsheet'

], function (BaseController, MessageBox, Review44c, Create44c, Utilities, History, RepoService, Spreadsheet) {
	"use strict";

	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.44c.controller.Page44c", {
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

		_onButtonPress44c: function (oEvent) {

			var sDialogName = "Create44c";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Create44c(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var oContext = this.getView().getModel("payment").createEntry("/SALARY");
			oDialog._oControl.bindElement("payment>" + oContext.sPath);

			oDialog.open();

		},
		onDataExport: function () {
			var aCols, oRowBinding, oSettings, oSheet, oTable;

			if (!this._oTable) {
				this._oTable = this.byId('table2');
			}

			oTable = this._oTable;
			oRowBinding = oTable.getBinding('items');
			aCols = this.createColumnConfig();

			oSettings = {
				workbook: {
					columns: aCols,
					hierarchyLevel: 'Level'
				},
				dataSource: oRowBinding,
				fileName: 'SalaryReports.xlsx',
				worker: true // We need to disable worker because we are using a MockServer as OData Service
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build().finally(function () {
				oSheet.destroy();
			});
		},
		createColumnConfig: function () {
			var aCols = [];

			aCols.push({
				property: 'emp_category',

				label: "تصنيف الموظف",

			});
			aCols.push({
				property: 'salary_sum',

				label: "مجموع الرواتب الشهري"

			});

			aCols.push({
				property: 'leftover_sum',

				label: "قيمة المستحقات المتبقية للرواتب"
			});

			return aCols;
		},

		monthsformater: function (bAvailable) {
			if (bAvailable == '-1') {
				return "";
			} else {
				return bAvailable + "   أشهر";

			}
		},

		handleUploadPress1: function (oEvent) {
			var that = this;
			var sPath = 'bank_statement_cmis_id';

			var DomRef = this.getView().byId("uploadbank").getFocusDomRef();
			var sModel = oEvent.getSource().getModel("payment");
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var sBindingPath = oEvent.getSource().getBindingContext("payment").sPath;
			var file = oEvent.getParameter("files")[0];
			// console.log(file);
			if (file != "") {

				var sendpath = that.club_dms_id;
				RepoService.uploadFile(file, sendpath).then(function (param1, param2) {
					var filename = param1.properties["cmis:name"].value;
					var test = sModel.getProperty(sBindingPath + "/last_payment_month");
					if (test == "" || test === null) {

						sModel.setProperty(sBindingPath + "/last_payment_month", new Date("July 21, 1983 01:15:00"));
					}
					sModel.setProperty(sBindingPath + "/" + sPath, sendpath + "/Evaluation/" + filename);
					if (sModel.getPendingChanges()) {
						return new Promise(function (fnResolve) {
							sap.m.MessageBox.confirm(oResourceBundle.getText("ConfirmEditSubmit"), {
								title: oResourceBundle.getText("Confirm"),
								actions: [
									oResourceBundle.getText("Confirm"),
									oResourceBundle.getText("cancel")
								],
								onClose: function (sActionClicked) {
									if (sActionClicked === oResourceBundle.getText("Confirm")) {
										sModel.submitChanges({
											success: function (param) {
												sap.m.MessageToast.show(oResourceBundle.getText("Success"));
											},
											error: function (param) {}
										});
										self._oDialog.close();
									} else {
										sModel.resetChanges(); // oBusy.close();
									}
								}
							});
						}).catch(function (err) {
							if (err !== undefined) {
								MessageBox.error(err);
							}
						});
					}
				});
			}
		},
		handleUploadPress2: function (oEvent) {
			var that = this;
			var sPath = 'proof_cmis_id_uploadexcel';

			var DomRef = this.getView().byId("Excelupload").getFocusDomRef();
			var sModel = oEvent.getSource().getModel("payment");
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var sBindingPath = oEvent.getSource().getBindingContext("payment").sPath;
			// console.log(sBindingPath);
			var file = oEvent.getParameter("files")[0];
			// console.log(file);
			if (file != "") {

				var sendpath = that.club_dms_id;
				RepoService.uploadFile(file, sendpath).then(function (param1, param2) {
					var filename = param1.properties["cmis:name"].value;
					// sModel.setProperty(sBindingPath + "/proof_cmis_id1", filename);
					var test = sModel.getProperty(sBindingPath + "/last_payment_month");
					if (test == "" || test === null) {

						sModel.setProperty(sBindingPath + "/last_payment_month", new Date("July 21, 1983 01:15:00"));
					}
					sModel.setProperty(sBindingPath + "/" + sPath, sendpath + "/Evaluation/" + filename);
					if (sModel.getPendingChanges()) {
						return new Promise(function (fnResolve) {
							sap.m.MessageBox.confirm(oResourceBundle.getText("ConfirmEditSubmit"), {
								title: oResourceBundle.getText("Confirm"),
								actions: [
									oResourceBundle.getText("Confirm"),
									oResourceBundle.getText("cancel")
								],
								onClose: function (sActionClicked) {
									if (sActionClicked === oResourceBundle.getText("Confirm")) {
										sModel.submitChanges({
											success: function (param) {
												sap.m.MessageToast.show(oResourceBundle.getText("Success"));
											},
											error: function (param) {}
										});
										self._oDialog.close();
									} else {
										sModel.resetChanges(); // oBusy.close();
									}
								}
							});
						}).catch(function (err) {
							if (err !== undefined) {
								MessageBox.error(err);
							}
						});
					}
				});
			}
		},
		handleUploadPress_Social: function (oEvent) {
			var that = this;
			var sPath = 'social_insurance_proof';

			var sModel = oEvent.getSource().getModel("payment");
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var sBindingPath = oEvent.getSource().getBindingContext("payment").sPath;
			// console.log(sBindingPath);
			var file = oEvent.getParameter("files")[0];
			// console.log(file);
			if (file != "") {

				var sendpath = that.club_dms_id;
				RepoService.uploadFile(file, sendpath).then(function (param1, param2) {
					var filename = param1.properties["cmis:name"].value;
					// sModel.setProperty(sBindingPath + "/proof_cmis_id1", filename);
					var test = sModel.getProperty(sBindingPath + "/last_payment_month");
					if (test == "" || test === null) {

						sModel.setProperty(sBindingPath + "/last_payment_month", new Date("July 21, 1983 01:15:00"));
					}
					sModel.setProperty(sBindingPath + "/" + sPath, sendpath + "/Evaluation/" + filename);
					if (sModel.getPendingChanges()) {
						return new Promise(function (fnResolve) {
							sap.m.MessageBox.confirm(oResourceBundle.getText("ConfirmEditSubmit"), {
								title: oResourceBundle.getText("Confirm"),
								actions: [
									oResourceBundle.getText("Confirm"),
									oResourceBundle.getText("cancel")
								],
								onClose: function (sActionClicked) {
									if (sActionClicked === oResourceBundle.getText("Confirm")) {
										sModel.submitChanges({
											success: function (param) {
												sap.m.MessageToast.show(oResourceBundle.getText("Success"));
											},
											error: function (param) {}
										});
										self._oDialog.close();
									} else {
										sModel.resetChanges(); // oBusy.close();
									}
								}
							});
						}).catch(function (err) {
							if (err !== undefined) {
								MessageBox.error(err);
							}
						});
					}
				});
			}
		},
		handleUploadPress_VAT: function (oEvent) {
			var that = this;
			var sPath = 'VAT_proof';

			var sModel = oEvent.getSource().getModel("payment");
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var sBindingPath = oEvent.getSource().getBindingContext("payment").sPath;
			// console.log(sBindingPath);
			var file = oEvent.getParameter("files")[0];
			// console.log(file);
			if (file != "") {

				var sendpath = that.club_dms_id;
				RepoService.uploadFile(file, sendpath).then(function (param1, param2) {
					var filename = param1.properties["cmis:name"].value;
					// sModel.setProperty(sBindingPath + "/proof_cmis_id1", filename);
					var test = sModel.getProperty(sBindingPath + "/last_payment_month");
					if (test == "" || test === null) {

						sModel.setProperty(sBindingPath + "/last_payment_month", new Date("July 21, 1983 01:15:00"));
					}
					sModel.setProperty(sBindingPath + "/" + sPath, sendpath + "/Evaluation/" + filename);
					if (sModel.getPendingChanges()) {
						return new Promise(function (fnResolve) {
							sap.m.MessageBox.confirm(oResourceBundle.getText("ConfirmEditSubmit"), {
								title: oResourceBundle.getText("Confirm"),
								actions: [
									oResourceBundle.getText("Confirm"),
									oResourceBundle.getText("cancel")
								],
								onClose: function (sActionClicked) {
									if (sActionClicked === oResourceBundle.getText("Confirm")) {
										sModel.submitChanges({
											success: function (param) {
												sap.m.MessageToast.show(oResourceBundle.getText("Success"));
											},
											error: function (param) {}
										});
										self._oDialog.close();
									} else {
										sModel.resetChanges(); // oBusy.close();
									}
								}
							});
						}).catch(function (err) {
							if (err !== undefined) {
								MessageBox.error(err);
							}
						});
					}
				});
			}
		},
		_onRowPress44c: function (oEvent) {

			var sDialogName = "Review44c";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Review44c(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext("payment");
			oDialog._oControl.bindElement("payment>" + context.sPath);

			oDialog.open();
		},

		_onDeleteRow44c: function (oEvent) {
			var that = this;
			var ConfirmSubmit = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Confirm');
			var sPath = oEvent.getSource().getParent().getBindingContext("payment").getPath();
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

		// _onEditRow44c: function (oEvent) {

		// 	var sDialogName = "Create44c";
		// 	this.mDialogs = this.mDialogs || {};
		// 	var oDialog = this.mDialogs[sDialogName];
		// 	if (!oDialog) {
		// 		oDialog = new Create44c(this.getView());
		// 		this.mDialogs[sDialogName] = oDialog;

		// 		// For navigation.
		// 		oDialog.setRouter(this.oRouter);
		// 	}
		// 	// Set the Binding Context to the Dialog
		// 	var context = oEvent.getSource().getBindingContext("payment");
		// 	oDialog._oControl.bindElement("payment>" + context.sPath);
		// 	oDialog._Event = oEvent.getSource().getId();
		// 	oDialog.open();

		// },
		_onEditRow44c: function (oEvent) {
			var sDialogName = "Create44c";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Create44c(this.getView());
				this.mDialogs[sDialogName] = oDialog;
				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			// Set the Binding Context to the Dialog
			var context = oEvent.getSource().getBindingContext("payment");
			oDialog._oControl.setBindingContext(context, "payment");
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
			this.oModel = this.getOwnerComponent().getModel("payment");

			this._oODataModel = this.getOwnerComponent().getModel("payment");
			var that = this;
			this.getOwnerComponent().getModel("payment").read("/SALARY", {
				success: function (oData) {
					console.log(oData);
					that.getView().byId("uploadbank").bindElement("payment>/SALARY(" + oData.results.slice(0, 1).pop().id + "l)");
					that.getView().byId("bankstatement").bindElement("payment>/SALARY(" + oData.results.slice(0, 1).pop().id + "l)");

					that.getView().byId("Excelupload").bindElement("payment>/SALARY(" + oData.results.slice(0, 1).pop().id + "l)");
					that.getView().byId("Exceluploadlink").bindElement("payment>/SALARY(" + oData.results.slice(0, 1).pop().id + "l)");

					that.getView().byId("social_insurance_proof_upload").bindElement("payment>/SALARY(" + oData.results.slice(0, 1).pop().id +
						"l)");
					that.getView().byId("social_insurance_proof_link").bindElement("payment>/SALARY(" + oData.results.slice(0, 1).pop().id + "l)");

					that.getView().byId("VAT_proof_upload").bindElement("payment>/SALARY(" + oData.results.slice(0, 1).pop().id + "l)");
					that.getView().byId("VAT_proof_link").bindElement("payment>/SALARY(" + oData.results.slice(0, 1).pop().id + "l)");

				},
				error: function (oError) {}
			});

			var that = this;
			this.getOwnerComponent().getModel("User").read("/UserClub", {
				success: function (oData) {
					that.club_dms_id = oData.results[0].club_dms_id;
				},
				error: function (oError) {}
			});

			// this.oRouter.getTarget("Page44c").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

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
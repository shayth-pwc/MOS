sap.ui.define([
	"pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"../controller/Validator",
	"sap/ui/model/json/JSONModel",
	"sap/m/PDFViewer",
	"pwc/portal/eval/ClubEvaluations/service/RepoService"
], function (BaseController, Validator, JSONModel, PDFViewer, RepoService) {
	"use strict";

	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.paymentcollection.controller.paymentcollection", {
		club_dms_id: '',

		onInit: function () {

			// jQuery.sap.includeStyleSheet("../css/paymentcollection.css", "paymentcollection");
			var that = this;
			this._aDialogs = {};
			this._oViewModel = new JSONModel({
				mainModel: "",
				EntitySet: ""
			});
			this.getView().setModel(this._oViewModel, "viewModel");
			sap.ui.getCore().attachValidationError(function (oEvent) {
				oEvent.getParameter("element").setValueState("Error");
			});
			sap.ui.getCore().attachValidationSuccess(function (oEvent) {
				oEvent.getParameter("element").setValueState("None");
			});
			this.getOwnerComponent().getModel("User").read("/UserClub", {
				success: function (oData) {
					that.club_dms_id = oData.results[0].club_dms_id;
				},
				error: function (oError) {}
			});

			this._pdfViewer = new PDFViewer();
			this.getView().addDependent(this._pdfViewer);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("paymentcollection").attachMatched(this._onObjectMatched, this);

		},
		_onObjectMatched: function (oEvent) {

			var that = this;
			var evaluation = this.getEvaluation();

			var oBinding = this.byId("CommercialRevenueTable").getBinding("items");
			var oFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("quarter_start_date", sap.ui.model.FilterOperator.EQ, evaluation.period_start_date_time),
					new sap.ui.model.Filter("quarter_end_date", sap.ui.model.FilterOperator.EQ, evaluation.period_end_date_time),
				],
				and: true
			});
			oBinding.filter(oFilter);
			var SecondMonth = new Date(evaluation.period_start_date_time),
				SecondMonthName;
			if (SecondMonth.getMonth() + 1 == 13) {
				SecondMonthName = new Date(SecondMonth.setMonth(0)).toLocaleString('default', {
					month: 'short'
				});
			} else {
				SecondMonthName = new Date(SecondMonth.setMonth(evaluation.period_end_date_time.getMonth() - 2)).toLocaleString('default', {
					month: 'short'
				});
			}
			var FirstMonth = new Date(SecondMonth.setMonth(evaluation.period_end_date_time.getMonth() - 3)).toLocaleString('default', {
					month: 'short'
				}),
				LastMonth = new Date(SecondMonth.setMonth(evaluation.period_end_date_time.getMonth() - 1)).toLocaleString('default', {
					month: 'short'
				}),
				oResourceBundle = that.getView().getModel("i18n45G").getResourceBundle();

			that.getView().byId("month1Lab").setText(oResourceBundle.getText("month_1_revenue", oResourceBundle.getText(FirstMonth)));
			that.getView().byId("month2Lab").setText(oResourceBundle.getText("month_2_revenue", oResourceBundle.getText(SecondMonthName)));
			that.getView().byId("month3Lab").setText(oResourceBundle.getText("month_3_revenue", oResourceBundle.getText(LastMonth)));

		},

		onDelete_paymentcollection: function (oEvent) {
			this._oViewModel.setProperty("/mainModel", "paymentcollection");
			this._delete_Entity(oEvent);
		},
		onViewPress_paymentcollection: function (oEvent) {
			// if (this._oViewModel.getProperty("/mode") === "edit_opened") {
			// 	return;
			// }
			var that = this;
			this._oViewModel.setProperty("/mode", "view");
			this._oViewModel.setProperty("/mainModel", "paymentcollection");
			this._oViewModel.setProperty("/EntitySet", "paymentcollection");
			that._openFormDialog(oEvent, "_paymentcollection_DetailsDialog", "DetailsItem", "COM1_title", {});
		},
		onAddPress_paymentcollection: function (oEvent) {
			var evaluation = sap.ui.getCore().AppContext.evaluation;
			var that = this;
			this._oViewModel.setProperty("/mode", "add");
			this._oViewModel.setProperty("/mainModel", "paymentcollection");
			this._oViewModel.setProperty("/EntitySet", "paymentcollection");
			that._openFormDialog(oEvent, "_paymentcollection_FormDialog", "AddItem", "COM1_title", {
				"club_id": "1",
				"quarter_start_date": evaluation.period_start_date_time,
				"quarter_end_date": evaluation.period_end_date_time,
				"total_amount_received": '0',
				"total_amount_owed": '0',
				"proof_cmis_id": "dasd",
				"evaluation_quarter": "0",
				"evaluation_period": "0"

			});
		},
		onEditPress_paymentcollection: function (oEvent) {
			var that = this;
			this._oViewModel.setProperty("/mode", "edit");
			this._oViewModel.setProperty("/mainModel", "paymentcollection");
			this._oViewModel.setProperty("/EntitySet", "paymentcollection");
			that._openFormDialog(oEvent, "_paymentcollection_FormDialog", "EditItem", "COM1_title", {
				"club_id": "1",
				"total_amount_received": "0",
				"total_amount_owed": "0",
				"proof_cmis_id": "dasd",
				"creation_date_time": new Date(),
				"changed_date_time": new Date(),
				"evaluation_quarter": "0",
				"evaluation_period": "0"

			});
		},
		_openFormDialog: function (oEvent, FormID, FormType, FormTitle, oProperties) {
			var evaluation = this.getEvaluation();
			var that = this,
				SecondMonth = new Date(evaluation.start_date_time),
				SecondMonthName,
				FirstMonth = new Date(SecondMonth.setMonth(evaluation.period_end_date_time.getMonth() - 3)).toLocaleString('default', {
					month: 'short'
				}),
				LastMonth = new Date(SecondMonth.setMonth(evaluation.period_end_date_time.getMonth() - 1)).toLocaleString('default', {
					month: 'short'
				}),
				sMainModel = this._oViewModel.getProperty("/mainModel"),
				oBusy = new sap.m.BusyDialog(),
				sEntitySet = this._oViewModel.getProperty("/EntitySet"),
				oResourceBundle = that.getView().getModel("i18n46G").getResourceBundle(),
				oContext;
			if (SecondMonth.getMonth() + 1 == 13) {
				SecondMonthName = new Date(SecondMonth.setMonth(0)).toLocaleString('default', {
					month: 'short'
				});
			} else {
				SecondMonthName = new Date(SecondMonth.setMonth(evaluation.period_end_date_time.getMonth() - 2)).toLocaleString('default', {
					month: 'short'
				});
			}

			that.getView().byId("month1").setText(oResourceBundle.getText("Month1_outstanding", oResourceBundle.getText(FirstMonth)));
			that.getView().byId("month2").setText(oResourceBundle.getText("Month2_Outstanding", oResourceBundle.getText(SecondMonthName)));
			that.getView().byId("month3").setText(oResourceBundle.getText("Month3_Outstanding", oResourceBundle.getText(LastMonth)));
			that.getView().byId("month1rev").setText(oResourceBundle.getText("Month1_Outstanding", oResourceBundle.getText(FirstMonth)));
			that.getView().byId("month2rev").setText(oResourceBundle.getText("Month2_Outstanding", oResourceBundle.getText(SecondMonthName)));
			that.getView().byId("month3rev").setText(oResourceBundle.getText("Month3_Outstanding", oResourceBundle.getText(LastMonth)));

			that._aDialogs[FormID] = that.byId(FormID);
			oBusy.open();

			if (FormType === "AddItem") {
				oContext = this.getView().getModel(sMainModel).createEntry("/" + sEntitySet, {
					properties: oProperties,
					success: function (oData) {
						sap.m.MessageToast.show(that.getResourceBundle().getText("Created"));
						that._aDialogs[FormID].close();
					},
					error: function (oError) {
						sap.m.MessageToast.show(that.getResourceBundle().getText("FailedToCreate"));
					}
				});
				oBusy.close();
				that._aDialogs[FormID].setTitle(that.getView().getModel("i18n46G").getResourceBundle().getText(FormTitle));

				that._aDialogs[FormID].setBindingContext(oContext, sMainModel).open();
				that.getView().getModel(sMainModel).resetChanges();
				that._aDialogs[FormID].setEscapeHandler(that.handleDialogCancel);

			} else {
				oContext = oEvent.getSource().getBindingContext(sMainModel);
				Object.keys(oProperties).forEach(key => {
					this.getView().getModel(sMainModel).setProperty(oContext.sPath + "/" + key, oProperties[key]);
				});
				that._aDialogs[FormID].setBindingContext(oContext, sMainModel);
				that.getView().getModel(sMainModel).resetChanges();
				oBusy.close();
				that._aDialogs[FormID].open();
				this._oViewModel.setProperty("/mode", "edit_opened");
			}
			that._aDialogs[FormID].setTitle(that.getView().getModel("i18n46G").getResourceBundle().getText(FormTitle));
			that._aDialogs[FormID].setEscapeHandler(that.handleDialogCancel);
		},
		_delete_Entity: function (oEvent) {
			var that = this,
				oBusy = new sap.m.BusyDialog(),
				sMainModel = this._oViewModel.getProperty("/mainModel"),
				sPath = oEvent.getParameter("listItem").getBindingContext(sMainModel).getPath(),
				oModel = that.getView().getModel(sMainModel);
			sap.m.MessageBox.confirm(that.getResourceBundle().getText("DeleteConfirmMsg"), {
				onClose: function (oAction) {
					if (oAction === sap.m.MessageBox.Action.OK) {
						oBusy.open();
						oModel.remove(sPath, {
							success: function (oData) {

								sap.m.MessageToast.show(that.getResourceBundle().getText("SucessDelete"));
								oModel.refresh();
								oBusy.close();
							},
							error: function (oError) {
								oBusy.close();
								sap.m.MessageToast.show(that.getResourceBundle().getText("ErrorDelete"));
							}
						});
					}
				}
			});
		},
		handleDialogCancel: function (oEvent) {
			return;
		},
		handleDialogCancelButton: function (oEvent) {
			var that = this,
				sMainModel = this._oViewModel.getProperty("/mainModel"),
				oModel = that.getView().getModel(sMainModel),
				sDialogID = oEvent.getSource().getParent().getId().split("-");
			sDialogID = sDialogID[sDialogID.length - 1];
			if (oModel.hasPendingChanges()) {
				sap.m.MessageBox.confirm(that.getResourceBundle().getText("CancelEditing"), {
					onClose: function (oAction) {
						if (oAction === sap.m.MessageBox.Action.OK) {
							that.getView().getModel(sMainModel).resetChanges();
							that.getView().getModel(sMainModel).refresh();
							that._aDialogs[sDialogID].close();
							that.getView().getModel(sMainModel).refresh();
						}
					}
				});
			} else {
				this.getView().getModel(sMainModel).resetChanges();
				that._aDialogs[sDialogID].close();
			}
		},
		handleDialogSaveButton: function (oEvent) {
			console.log(oEvent);
			var that = this,
				sDialogID = oEvent.getSource().getParent().getId().split("-"),
				sMainModel = this._oViewModel.getProperty("/mainModel"),
				oModel = that.getView().getModel(sMainModel),
				validator = new Validator();
			sDialogID = sDialogID[sDialogID.length - 1];

			if (!validator.validate(this.byId(sDialogID))) {
				return;
			}
			if (!oModel.hasPendingChanges()) {
				sap.m.MessageBox.information(that.getResourceBundle().getText("noChanges"));
				return;
			} else {

				oModel.submitChanges({
					groupId: null,
					success: function (oData) {
						if (that._oViewModel.getProperty("/mode") === "edit" || that._oViewModel.getProperty("/mode") === "edit_opened") {
							sap.m.MessageToast.show(that.getResourceBundle().getText("Updated"));
							that._aDialogs[sDialogID].close();
							that.getView().getModel(sMainModel).refresh();
						}
					},
					error: function (oError) {
						sap.m.MessageToast.show(that.getResourceBundle().getText("FailedtoUpdate"));
					}
				});
			}
		},
		onUpdateFinish: function (oEvent) {
			var evaluation = this.getEvaluation();
			//debugger;;
			var newFilter = [
				new sap.ui.model.Filter("Start_date", sap.ui.model.FilterOperator.EQ, evaluation.period_start_date_time),
				new sap.ui.model.Filter("end_date", sap.ui.model.FilterOperator.EQ, evaluation.period_end_date_time),
				new sap.ui.model.Filter("isCommercial", sap.ui.model.FilterOperator.EQ, "0"),

			]
			this.getOwnerComponent().getModel("paymentcollection").read("/revenueproof", {
				filters: newFilter,
				success: function (oData) {
					try {
						that.getView().byId("link").bindElement("paymentcollection>/revenueproof(" + oData.results.slice(-1).pop().id + "l)");
					} catch (err) {}
				},
				error: function (oError) {

				}
			});
			var that = this,
				oTableItems = oEvent.getSource().getAggregation("items"),
				sTotalReceived = 0,
				sOutstandingTotal = 0,
				oItem;
			oTableItems.forEach(function (item, index) {
				if (typeof item.getBindingContext("paymentcollection") !== 'undefined') {
					oItem = item.getBindingContext("paymentcollection").getObject();

					sTotalReceived += parseFloat(oItem.total_amount_received);
					sOutstandingTotal += parseFloat(oItem.total_amount_owed);
				}

			});
			var TotalReceived = new sap.m.ObjectIdentifier({
				title: that.getView().getModel("i18n46G").getResourceBundle().getText("TotalValue"),
				text: sTotalReceived,
				wrapping: true
			});
			var TotalOutstanding = new sap.m.ObjectIdentifier({
				title: that.getView().getModel("i18n46G").getResourceBundle().getText("TotalCValue"),
				text: sOutstandingTotal,
				wrapping: true
			});
			var percentage = (sTotalReceived / sOutstandingTotal) * 100;
			var CollectionRate = new sap.m.ObjectIdentifier({
				title: that.getView().getModel("i18n46G").getResourceBundle().getText("collectionrate"),
				text: percentage.toFixed(2) + "%",
				wrapping: true
			});
			this.getView().byId("CommercialRevenueTable").getColumns()[5].setFooter(TotalOutstanding);
			this.getView().byId("CommercialRevenueTable").getColumns()[6].setFooter(TotalReceived);
			this.getView().byId("CommercialRevenueTable").getColumns()[7].setFooter(CollectionRate);

		},

		onDataExportPDF: function (oEvent) {
			html2canvas($("table")[0]).then((canvas) => {
				const pdf = new jspdf.jsPDF("p", "pt", "a3", true);
				const imgData = canvas.toDataURL('image/png');
				const imgProps = pdf.getImageProperties(imgData);
				const pdfWidth = pdf.internal.pageSize.getWidth();
				const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

				pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
				pdf.save("download.pdf");
			});
		},

		handleUploadPress: function (oEvent) {
			//debugger;;
			var evaluation = this.getEvaluation();
			var oEntry = {};
			oEntry["Start_date"] = evaluation.period_start_date_time;
			oEntry["end_date"] = evaluation.period_end_date_time;
			oEntry["isCommercial"] = "0";
			var oModel = this.getView().getModel("paymentcollection");
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var file = oEvent.getParameter("files")[0];
			// var sBindingPath = oEvent.getSource().getBindingContext("paymentcollection").getPath(); // oEvent.get
			var sPath = "valid_proof_cmis_id";
			var that = this;
			var uploadpath
			if (file !== '') {
				if (file !== "") {
					var sendpath = that.club_dms_id;
					RepoService.uploadFile(file, sendpath).then(function (param1, param2) {

						var filename = param1.properties['cmis:name'].value;
						if (filename != "") {
							// oModel.setProperty(sBindingPath + "/" + sPath, sendpath + "/Evaluation/" + filename);

							uploadpath = sendpath + "/Evaluation/" + filename;
							console.log(uploadpath);

						}
					});;
					sap.m.MessageBox.confirm(oResourceBundle.getText('confirmationmsg'), {
						title: oResourceBundle.getText('confirmation'),
						actions: [oResourceBundle.getText('confirm'), oResourceBundle.getText('cancel')],
						onClose: function (sActionClicked) {
							if (sActionClicked === oResourceBundle.getText('confirm')) {
								if (that.getView().byId("link").getText() != ' No File Uploaded') {

									var id = that.getView().byId("link").getBindingContext("paymentcollection").getObject("id");
									oEntry["valid_proof_cmis_id"] = uploadpath;
									oModel.update("/revenueproof(" + id + "l)", oEntry, {
										success: function (oData) {
											sap.m.MessageToast.show(oResourceBundle.getText("Updated"));
											oModel.refresh();
										},
										error: function (oError) {
											sap.m.MessageToast.show(oResourceBundle.getText("FailedtoUpdate"));
										}
									});
									oModel.refresh();

								} else {
									console.log(uploadpath);

									oEntry["valid_proof_cmis_id"] = uploadpath;
									oModel.create("/revenueproof", oEntry, {
										success: function (oData) {
											sap.m.MessageToast.show(oResourceBundle.getText("Updated"));
											oModel.refresh();
										},
										error: function (oError) {
											sap.m.MessageToast.show(oResourceBundle.getText("FailedtoUpdate"));
										}
									});
									oModel.refresh();
								}
							} else {
								oModel.resetChanges();
							}
						}
					});

				}
			}
		},
		handleContractUploadPress: function (oEvent) {
			var that = this;

			var oModel = this.getView().getModel("paymentcollection");
			var file = oEvent.getParameter("files")[0];
			var sBindingPath = oEvent.getSource().getBindingContext("paymentcollection").getPath(); // oEvent.get
			var sPath = oEvent.getSource().getParent().getFields()[1].mBindingInfos.href.binding.sPath;
			if (file !== '') {
				if (file !== "") {
					var sendpath = that.club_dms_id;
					RepoService.uploadFile(file, sendpath).then(function (param1, param2) {

						var filename = param1.properties['cmis:name'].value;
						oModel.setProperty(sBindingPath + "/" + sPath, sendpath + "/Evaluation/" + filename);
					});

				}
			}
		},

	});

});
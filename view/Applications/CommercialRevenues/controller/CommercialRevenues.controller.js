sap.ui.define([
	"pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"../controller/Validator",
	"sap/ui/model/json/JSONModel",
	"sap/m/PDFViewer",
	"pwc/portal/eval/ClubEvaluations/service/RepoService",
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',

], function (BaseController, Validator, JSONModel, PDFViewer, RepoService, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.CommercialRevenues.controller.CommercialRevenues", {

		club_dms_id: '',

		onInit: function () {
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

			this._pdfViewer = new PDFViewer();
			this.getView().addDependent(this._pdfViewer);

			var that = this;
			this.getOwnerComponent().getModel("User").read("/UserClub", {
				success: function (oData) {
					that.club_dms_id = oData.results[0].club_dms_id;
				},
				error: function (oError) {}
			});
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("commercialrevenues").attachMatched(this._onObjectMatched, this);

		},
		_onObjectMatched: function (oEvent) {
			var that = this;
			var evaluation = this.getEvaluation();
			//debugger;;

			var oBinding = this.byId("CommercialRevenueTable").getBinding("items");
			var oFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("start_date", sap.ui.model.FilterOperator.EQ, evaluation.period_start_date_time),
					new sap.ui.model.Filter("end_date", sap.ui.model.FilterOperator.EQ, evaluation.period_end_date_time),
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
		onDelete_CommercialRevenues: function (oEvent) {
			this._oViewModel.setProperty("/mainModel", "CommercialRevenues");
			this._delete_Entity(oEvent);
		},
		onViewPress_CommercialRevenues: function (oEvent) {
			// if (this._oViewModel.getProperty("/mode") === "edit_opened") {
			// 	return;
			// }else{
			var that = this;
			this._oViewModel.setProperty("/mode", "view");
			this._oViewModel.setProperty("/mainModel", "CommercialRevenues");
			this._oViewModel.setProperty("/EntitySet", "CommercialRevenues");
			that._openFormDialog(oEvent, "_CommercialRevenues_DetailsDialog", "DetailsItem", "COM1_title", {});

		},
		onAddPress_CommercialRevenues: function (oEvent) {
			var evaluation = this.getEvaluation();
			var that = this;
			this._oViewModel.setProperty("/mode", "add");
			this._oViewModel.setProperty("/mainModel", "CommercialRevenues");
			this._oViewModel.setProperty("/EntitySet", "CommercialRevenues");
			that._openFormDialog(oEvent, "_CommercialRevenues_FormDialog", "AddItem", "COM1_title", {
				"club_id": "1",
				"proof_cmis_id": "0",
				"start_date": evaluation.period_start_date_time,
				"end_date": evaluation.period_end_date_time,
				"total_revenue": "0",
				"creation_date_time": new Date(),
				"changed_date_time": new Date(),
				"total_monthly_revenue": "0",
				"commercial_revenue_precentage": "0"
			});
		},
		onEditPress_CommercialRevenues: function (oEvent) {
			var that = this;
			this._oViewModel.setProperty("/mode", "edit");
			this._oViewModel.setProperty("/mainModel", "CommercialRevenues");
			this._oViewModel.setProperty("/EntitySet", "CommercialRevenues");
			that._openFormDialog(oEvent, "_CommercialRevenues_FormDialog", "EditItem", "COM1_title", {
				"club_id": "1",
				"total_revenue": "0",
				"proof_cmis_id": "",
				"creation_date_time": new Date(),
				"changed_date_time": new Date()
			});
		},
		_openFormDialog: function (oEvent, FormID, FormType, FormTitle, oProperties) {
			//debugger;;
			var evaluation = this.getEvaluation();
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
			var that = this,
				FirstMonth = new Date(SecondMonth.setMonth(evaluation.period_end_date_time.getMonth() - 3)).toLocaleString('default', {
					month: 'short'
				}),
				LastMonth = new Date(SecondMonth.setMonth(evaluation.period_end_date_time.getMonth() - 1)).toLocaleString('default', {
					month: 'short'
				}),
				sMainModel = this._oViewModel.getProperty("/mainModel"),
				oBusy = new sap.m.BusyDialog(),
				sEntitySet = this._oViewModel.getProperty("/EntitySet"),
				oContext,
				oResourceBundle = that.getView().getModel("i18n45G").getResourceBundle();
			that.getView().byId("month1").setText(oResourceBundle.getText("month_1_revenue", oResourceBundle.getText(FirstMonth)));
			that.getView().byId("month2").setText(oResourceBundle.getText("month_2_revenue", oResourceBundle.getText(SecondMonthName)));
			that.getView().byId("month3").setText(oResourceBundle.getText("month_3_revenue", oResourceBundle.getText(LastMonth)));
			that.getView().byId("month1rev").setText(oResourceBundle.getText("month_1_revenue", oResourceBundle.getText(FirstMonth)));
			that.getView().byId("month2rev").setText(oResourceBundle.getText("month_2_revenue", oResourceBundle.getText(SecondMonthName)));
			that.getView().byId("month3rev").setText(oResourceBundle.getText("month_3_revenue", oResourceBundle.getText(LastMonth)));

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
				that._aDialogs[FormID].setBindingContext(oContext, sMainModel).open();
				that.getView().getModel(sMainModel).resetChanges();
				that._aDialogs[FormID].setTitle(that.getView().getModel("i18n45G").getResourceBundle().getText(FormTitle));
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

				that._aDialogs[FormID].setTitle(that.getView().getModel("i18n45G").getResourceBundle().getText(FormTitle));
				that._aDialogs[FormID].setEscapeHandler(that.handleDialogCancel);
			}
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
			var newFilter = [
				new sap.ui.model.Filter("Start_date", sap.ui.model.FilterOperator.EQ, evaluation.period_start_date_time),
				new sap.ui.model.Filter("end_date", sap.ui.model.FilterOperator.EQ, evaluation.period_end_date_time),
				new sap.ui.model.Filter("isCommercial", sap.ui.model.FilterOperator.EQ, "1"),

			]
			this.getOwnerComponent().getModel("CommercialRevenues").read("/revenueproof", {
				filters: newFilter,
				success: function (oData) {
					try {
						that.getView().byId("link").bindElement("CommercialRevenues>/revenueproof(" + oData.results.slice(-1).pop().id + "l)");
					} catch (err) {}
				},
				error: function (oError) {

				}
			});

			var that = this,
				//oEvent.getSource().getAggregation("items")[0].getBindingContext("CommercialRevenues").getObject()
				oTableItems = oEvent.getSource().getAggregation("items"),
				sTotal = 0,
				sCommTotal = 0,
				oItem;

			oTableItems.forEach(function (item, index) {
				if (typeof item.getBindingContext("CommercialRevenues") !== 'undefined') {
					oItem = item.getBindingContext("CommercialRevenues").getObject();

					sTotal += parseFloat(oItem.total_monthly_revenue);
					if (oItem.commercial_revenue_type === 2 || oItem.commercial_revenue_type === 4) {
						sCommTotal += parseFloat(oItem.total_monthly_revenue);
					}
				}

			});

			var TotalValue = new sap.m.ObjectIdentifier({
				title: that.getView().getModel("i18n45G").getResourceBundle().getText("TotalValues"),
				text: sTotal
			});
			var TotalCValue = new sap.m.ObjectIdentifier({
				title: that.getView().getModel("i18n45G").getResourceBundle().getText("TotalCommercialValue"),
				text: sCommTotal
			});
			var PercentageRevenue = (sCommTotal / sTotal) * 100;
			var PercentageValue = new sap.m.ObjectIdentifier({
				title: that.getView().getModel("i18n45G").getResourceBundle().getText("PercentageCommercialValue"),
				text: PercentageRevenue.toFixed(2) + "%"
			});

			this.getView().byId("CommercialRevenueTable").getColumns()[3].setFooter(TotalCValue);
			this.getView().byId("CommercialRevenueTable").getColumns()[4].setFooter(TotalValue);
			this.getView().byId("CommercialRevenueTable").getColumns()[2].setFooter(PercentageValue);

		},

		onDataExportPDF: function (oEvent) {
			html2canvas($("table")[0])
				.then((canvas) => {
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
			var evaluation = this.getEvaluation();
			var oEntry = {};
			oEntry["Start_date"] = evaluation.period_start_date_time;
			oEntry["end_date"] = evaluation.period_end_date_time;
			oEntry["isCommercial"] = "1";
			var oModel = this.getView().getModel("CommercialRevenues");
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var file = oEvent.getParameter("files")[0];
			// var sBindingPath = oEvent.getSource().getBindingContext("CommercialRevenues"); // oEvent.get
			// var sPath = "valid_proof_cmis_id";
			var uploadpath;
			var that = this;
			if (file !== '') {
				if (file !== "") {
					var sendpath = that.club_dms_id;
					RepoService.uploadFile(file, sendpath).then(function (param1, param2) {

						var filename = param1.properties['cmis:name'].value;
						console.log(filename);
						if (filename != "") {
							// oModel.setProperty(sBindingPath + "/" + sPath, sendpath + "/Evaluation/" + filename);
							uploadpath = sendpath + "/Evaluation/" + filename;

						}
					});

					sap.m.MessageBox.confirm(oResourceBundle.getText('confirmationmsg'), {
						title: oResourceBundle.getText('confirmation'),
						actions: [oResourceBundle.getText('confirm'), oResourceBundle.getText('cancel')],
						onClose: function (sActionClicked) {
							if (sActionClicked === oResourceBundle.getText('confirm')) {
								if (that.getView().byId("link").getText() != ' No File Uploaded') {

									var id = that.getView().byId("link").getBindingContext("CommercialRevenues").getObject("id");
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

					// if (!oModel.hasPendingChanges()) {
					// 	sap.m.MessageBox.information(oResourceBundle.getText("noChanges"));
					// 	return;
					// } else {

					// }

				}
			}
		},

		openlink: function (oEvent) {
			var sLink = '';
			var filename = oEvent.getSource().getText();
			RepoService.getRepoId().then(function (ReposId) {
				sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + filename;
				window.open(sLink);
			});
		},
		handleContractUploadPress: function (oEvent) {
			var that = this;

			var oModel = this.getView().getModel("CommercialRevenues");
			var file = oEvent.getParameter("files")[0];
			var sBindingPath = oEvent.getSource().getBindingContext("CommercialRevenues").getPath(); // oEvent.get
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

		// _setDates: function(startDate,EndDate)

	});
});
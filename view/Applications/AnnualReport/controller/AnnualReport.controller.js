sap.ui.define([
	'../../../../controller/BaseController',
	"pwc/portal/eval/ClubEvaluations/service/RepoService",
	"sap/m/library",
	'sap/ui/core/Fragment',
	"sap/m/upload/Uploader"

], function (BaseController, RepoService, MLibrary, Fragment, Uploader) {
	"use strict";
	var URLHelper = MLibrary.URLHelper;
	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.AnnualReport.controller.AnnualReport", {
		pathid: 0,
		club_id: 0,
		club_dms_id:'',
		uploadlink: '',
		onInit: function () {

			this._oODataModel = this.getOwnerComponent().getModel('Annualreport');
			var oUploadSet = this.byId("UploadSet");
			var that = this;
			this.getOwnerComponent().getModel("User").read("/UserClub", {
				success: function (oData) {
					that.club_id = oData.results[0].club_id;
						that.club_dms_id = oData.results[0].club_dms_id;
				},
				error: function (oError) {}
			});

			var that = this;
		this.getOwnerComponent().getModel("Annualreport").read("/EVALUATIONS_YEARLY_CLUB_ANNUAL_REPORT", {
				success: function (oData) {

					console.log(oData.results.slice(-1).pop().id);

					that.getView().bindElement("Annualreport>/EVALUATIONS_YEARLY_CLUB_ANNUAL_REPORT(" + oData.results.slice(-1).pop().id + "l)");
				},
				error: function (oError) {}
			});
		},
		myFormatterdata: function (Data) {
			if (Data == 0) {
				return "Not included"
			} else {
				return "Included"
			}
		},
		
		// onAfterRendering: function () {
  //              if (typeof sap.ui.getCore().AppContext === 'undefined') {
  //                  this.getOwnerComponent().getRouter().navTo("home");
  //                  this.destroy();
  //              }
  //          },
		onUpload: function (oEvent) {
			var that = this,
				oModel = this.getView().getModel();

			var file = oEvent.getParameter("files")[0];
			 //file = encodeURI(file);
			//	var sBindingPath = "/EVALUATIONS_YEARLY_CLUB_ANNUAL_REPORT(1l)";
			var datapath = oEvent.getSource().oFilePath.oParent.sId.split('--')[2];
			console.log(file);
			if (file != '') {
				RepoService.uploadFile(file,that.club_dms_id).then(function (param1, param2) {
					var oEntry = {};
					var filename = param1.properties['cmis:name'].value;
					var sLink = '';
					RepoService.getRepoId().then(function (ReposId) {
						sLink = that.club_dms_id + "/Evaluation/" + filename;

						that.uploadlink = sLink;

						that.onSeeEmployeeevalorg(oEvent);

					});

				});
			}
		},

		handleLinkObjectAttributePressannualeval: function (oEvent) {
			var url = oEvent.getSource().mProperties.text;
			url = url.replace(/\s/g, '');
			var sLink = '';
			RepoService.getRepoId().then(function (ReposId) {
				sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + url;
				URLHelper.redirect(sLink, true);
			});

		},

		formaturlannualeval: function (url) {

			if (!url) {
				return "No File Uploaded";
			} else if (url == 'null') {

				return "No File Uploaded";
			} else {
				var ret = url.split('/').pop();
				return ret;
			}
		},
		
		
		
		
		// onSeePositionevalorg: function (oEvent) {
		// 	var that = this;
		// 	that._onItemPressevalorg(oEvent, "AddItem", "CheckPosition");
		// },
		onSeeEmployeeevalorg: function (oEvent) {
			var that = this;
			that._onItemPressevalorg(oEvent, "AddItem", "CheckBox");
		},

		_onItemPressevalorg: function (oEvent, FormType, FormID) {
			var that = this;

			var dialog = that.byId(FormID);
			dialog.open();
		},

		closecheckbox: function () {
			var that = this;
			that.getView().getModel("Annualreport").read("/EVALUATIONS_YEARLY_CLUB_ANNUAL_REPORT", {
				success: function (oData) {

					console.log(oData.results.slice(-1).pop().id);

					that.getView().bindElement("Annualreport>/EVALUATIONS_YEARLY_CLUB_ANNUAL_REPORT(" + oData.results.slice(-1).pop().id + "l)");
				},
				error: function (oError) {}
			});

			var FieldInfo = that._getRequiredFields();

			FieldInfo.forEach(function (item, index, arr) {
				that.byId(item.id).setSelected(false);
			});
			that.byId("CheckBox").close();
		},

		onexit: function () {
			var that = this;
			var FieldInfo = that._getRequiredFields();

			FieldInfo.forEach(function (item, index, arr) {
				that.byId(item.id).setSelected(false);
			});
			that.byId("CheckBox").close();

		},
		onSubmit: function (oEvent) {

			var that = this,
				oView = this.getView(),
				bValidationError = false,
				oEntInd, Form,
				ConfirmSubmit = that.getOwnerComponent().getModel("i18n").getResourceBundle().getText('ConfirmSubmit'),
				oBusy = new sap.m.BusyDialog(),
				oEntry = {},
				FieldInfo = that._getRequiredFields();

			FieldInfo.forEach(function (item, index, arr) {
				oEntInd = item.id;

				if (item.type === "checkbox") {
					console.log(that.byId(item.id).mProperties);
					if (!that.byId(item.id).mProperties.selected) {
						oEntry[item.id] = "0";

					} else {
						oEntry[item.id] = "1";

					}

				}
			});

			oEntry["club_id"] = this.club_id;
		//		oEntry["changed_by"] = sap.ushell.Container.getService("UserInfo").getId();
		oEntry["changed_by"] = "P00003";

			oEntry["ANNUAL_REPORT_CMIS_ID"] = that.uploadlink;
			console.log(oEntry);
			sap.m.MessageBox.show(ConfirmSubmit, {
				icon: sap.m.MessageBox.Icon.QUESTION,
				title:  that.getOwnerComponent().getModel("i18n").getResourceBundle().getText('ConfirmSubmit'),
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === "YES") {

						return new Promise(function (fnResolve, fnReject) {
							that._oODataModel.create('/EVALUATIONS_YEARLY_CLUB_ANNUAL_REPORT', oEntry, {
								success: function (oData) {
									that._oODataModel.refresh();
									fnResolve();
									sap.m.MessageToast.show( that.getOwnerComponent().getModel("i18n").getResourceBundle().getText('updated'), {
										onClose: that.closecheckbox(),
										duration: 0 || 3000
									});
									oBusy.close();
									return;
								},
								error: function (oError) {
									sap.m.MessageBox.show(oError.message.value, {
										icon: sap.m.MessageBox.Icon.ERROR,
										title: "oError"
									});
									return;
								}
							});
						}).catch(function (err) {
							if (err !== undefined) {
								MessageBox.error(err.message);
							}
						});
					} else {
						oEntry = {};
						oBusy.close();
						return;
					}
				}
			});

		},

		_getRequiredFields: function () {
			return [{
				"id": "Annual_report_director_group_word",
				"type": "checkbox",
				"required": true
			}, {
				"id": "Annual_report_history_and_origins",
				"type": "checkbox",
				"required": true
			}, {
				"id": "Annual_report_board_of_director",
				"type": "checkbox",
				"required": true
			}, {
				"id": "Annual_report_challenges",
				"type": "checkbox",
				"required": true
			}, {
				"id": "Annual_report_main_departments",
				"type": "checkbox",
				"required": true
			}, {
				"id": "Annual_report_organizing_and_executive_committees",
				"type": "checkbox",
				"required": true
			}, {
				"id": "Annual_report_achieving_performance_indicator",
				"type": "checkbox",
				"required": true
			}, {
				"id": "Annual_report_sport_activities",
				"type": "checkbox",
				"required": true
			}, {
				"id": "Annual_report_club_academy",
				"type": "checkbox",
				"required": true
			}, {
				"id": "Annual_report_marketing_activities",
				"type": "checkbox",
				"required": true
			}, {
				"id": "Annual_report_social_responsibility",
				"type": "checkbox",
				"required": true
			}, {
				"id": "Annual_report_future_goals",
				"type": "checkbox",
				"required": true
			}];

		},

	});
});
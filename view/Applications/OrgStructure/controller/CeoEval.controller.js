sap.ui.define([
	//"sap/ui/core/mvc/Controller",
	'../../../../controller/BaseController',
	'sap/ui/core/Fragment',
	'sap/ui/model/json/JSONModel',
	"sap/m/MessageBox",
	"pwc/portal/eval/ClubEvaluations/service/RepoService",
	"sap/m/library",
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'
], function (BaseController, Fragment, JSONModel, MessageBox, RepoService, MLibrary, Filter, FilterOperator) {
	"use strict";
	var URLHelper = MLibrary.URLHelper;

	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.OrgStructure.controller.CeoEval", {
		club_id: 0,
		club_dms_id: '',

		pos: '',
		onInit: function (oEvent) {
			this._oODataModel = this.getOwnerComponent().getModel("evalorgstruct");

			this.getCurrentRouteName();

			//	this.handleswitch();
			// this.getView().bindElement("/CLUB_ORG_STRUC_EMP(37l)");
			this._formFragments = {};

			// Set the initial form to be the display one
			this._showFormFragmentevalorg("Display");

			this.handleswitchevalorg();
			var that = this;
			this.getOwnerComponent().getModel("User").read("/UserClub", {
				success: function (oData) {
					that.club_id = oData.results[0].club_id;
					that.club_dms_id = oData.results[0].club_dms_id;

				},
				error: function (oError) {}
			});

		},

		getCurrentRouteName: function () {
			var currentHash = this.getOwnerComponent().getRouter().getHashChanger().getHash().split('/')[4];
			this.pos = currentHash;
			console.log(currentHash);
		},
		handleLinkObjectAttributePressevalorgstruct: function (oEvent) {
			var url = oEvent.getSource().mProperties.text;
			var that=this;
			 url = url.trim();
			var sLink = '';
			console.log(oEvent.getSource().mProperties);
			RepoService.getRepoId().then(function (ReposId) {
			sLink = that.club_dms_id + "/Evaluation/" + url;
			URLHelper.redirect(sLink, true);
			});

		},

		/*onCriteria: function (oEvent) {
			var oListCount = oEvent.getSource().getAggregation("items").length;
			for (var r = 0; r < oListCount; r++) {
				if (oEvent.getSource().getAggregation("items")[r].getSelected()) {
					oEvent.getSource().getAggregation("items")[r].setHighlight('Success');
					var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
					oEvent.getSource().setHeaderText(oResourceBundle.getText("EvaluationCriteriaScore", oEvent.getSource().getAggregation("items")[r]
						.getTitle().charAt(0)));
				} else {
					oEvent.getSource().getAggregation("items")[r].setHighlight('None');
				}
			}
		},*/
		// handleswitchevalorg: function (oEvent) {

		// 	var that = this;
		// 	var pos = oEvent.getSource().getTitle();
		// 	var oFilter;
		// 	oFilter = [];
		// 	oFilter.push(new Filter("position_name", "EQ", pos));

		// 	that.getView().getModel("evalorgstruct").read("/CLUB_ORG_STRUC_EMPPOSIdentification", {
		// 		 filters: oFilter,
		// 		success: function (oData) {
		// 			var path = oData.results[0];
		// 			var empid= path.id;
		// 			 that.pathid = path.id;
		// 			 that.getView().bindElement("evalorgstruct>/CLUB_ORG_STRUC_EMP(" + path.id + "l)");

		// 		},
		// 		error: function (oError) {}
		// 	});

		// },

		handleswitchevalorg: function (oEvent) {
			//	//debugger;;
			var that = this;
			//	var pos = oEvent.getSource().getTitle();

			if (this.pos == 'الفريق المالي') {
				this._showFormFragmentevalorg("FinanceDisplay");

				var that = this;
				this.getOwnerComponent().getModel("evalorgstruct").read("/CLUB_ORG_STRUC_financedept", {
					success: function (oData) {
						console.log(oData);
						var path = oData.results[0];
						that.pathid = path.id;

						that.getView().bindElement("evalorgstruct>/CLUB_ORG_STRUC_financedept(" + path.id + "l)");

					},
					error: function (oError) {}
				});

			} else {
				var oFilter;
				oFilter = [];
				oFilter.push(new Filter("position_name", "EQ", this.pos));

				this.getOwnerComponent().getModel("evalorgstruct").read("/CLUB_ORG_STRUC_EMPPOSIdentification", {
					filters: oFilter,
					success: function (oData) {
						var path = oData.results[0];
						var empid = path.id;
						that.pathid = path.id;
						that.getView().bindElement("evalorgstruct>/CLUB_ORG_STRUC_EMP(" + path.id + "l)");
							that.getView().byId('edit').setVisible(true);

					},
					error: function (oError) {}
				});
			}
		},
		validateevalorg: function () {
			var email = this.getView().byId("emp_email").getValue();
			var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
			if (!mailregex.test(email)) {
				alert(email + " is not a valid email address");
				this.getView().byId("emp_email").setValueState(sap.ui.core.ValueState.Error);
			}
		},
		validatenumberevalorg: function () {
			var no = this.getView().byId("emp_contactnumber").getValue();

			if (no == "") {
				alert(no + " is not a valid number");
				return false;
			} else if (isNaN(no) || no.length === 20) {
				alert(" enter valid number");
				return false;
			}
		},
		onUploadevalorg: function (oEvent) {
			var that = this,
				oModel = this.getOwnerComponent().getModel();

			var file = oEvent.getParameter("files")[0];
			var sBindingPath = oEvent.getSource().getBindingContext("evalorgstruct").sPath;
			var datapath = oEvent.getSource().oFilePath.oParent.sId.split('--')[2];
			console.log(datapath);
			if (file != '') {
				var sendpath = that.club_dms_id;
				RepoService.uploadFile(file, sendpath).then(function (param1, param2) {
					var oEntry = {};
					var filename = param1.properties['cmis:name'].value;
					var sLink = '';
					RepoService.getRepoId().then(function (ReposId) {
						sLink = that.club_dms_id + "/Evaluation/" + filename;

						oEntry[datapath] = sLink;
						console.log(oEntry);
						sap.m.MessageBox.show(that.getOwnerComponent().getModel("i18n").getResourceBundle().getText('ConfirmSubmit'), {
							icon: sap.m.MessageBox.Icon.QUESTION,
							title: that.getOwnerComponent().getModel("i18n").getResourceBundle().getText('ConfirmSubmit'),
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === "YES") {

									return new Promise(function (fnResolve, fnReject) {
										that._oODataModel.update(sBindingPath, oEntry, {
											success: function (oData) {
												fnResolve();
												that._oODataModel.refresh();
												sap.m.MessageToast.show(that.getOwnerComponent().getModel("i18n").getResourceBundle().getText('updated'), {
													onClose: fnResolve,
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
						// oModel.setProperty(sBindingPath + '/'+datapath, sLink);
					});

				});
			}
		},
		handleEditPressevalorg: function (oEvent) {
			//Clone the data

			this._toggleButtonsAndViewevalorg(true);

		},

		handleCancelPressevalorg: function () {

			//Restore the data
			this._toggleButtonsAndViewevalorg(false);
			this._oODataModel.resetChanges();

		},

		handleSavePressevalorg: function (oEvent) {
			// 	oModel = this.getView().getModel();
			// if (!oModel.hasPendingChanges()) {
			// 	MessageBox.information(
			// 		"No Change", {
			// 			id: "noChangesInfoMessageBox"

			// 		}
			// 	);
			// 	return;
			// }

			var that = this,
				oView = this.getView(),
				bValidationError = false,
				oEntInd, Form,
				ConfirmSubmit = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('ConfirmSubmit'),
				oBusy = new sap.m.BusyDialog(),
				oEntry = {},
				path, currentdata,
				FieldInfo = that._getRequiredFields();

			FieldInfo.forEach(function (item, index, arr) {
				oEntInd = item.id;

				if (item.type === "text") {
					oEntry[oEntInd] = sap.ui.core.Fragment.byId(that.getView().getId(), item.id).getValue();
				} else if (item.type === "select") {
					oEntry[oEntInd] = that.byId(item.id).getSelectedKey();
				}
				if (oEntry[oEntInd] === "" && item.required === true) {
					bValidationError = true;
					sap.ui.core.Fragment.byId(that.getView().getId(), that.byId(item.id).setValueState("Error"));

				} else if (oEntry[oEntInd] !== "" && item.required === true) {
					sap.ui.core.Fragment.byId(that.getView().getId(), that.byId(item.id).setValueState("None"));

				} else {
					sap.ui.core.Fragment.byId(that.getView().getId(), that.byId(item.id).setValueState("None"));
				}
			});

			oEntry['club_id'] = this.club_id.toString();
			// oEntry["emp_name"] = sap.ui.core.Fragment.byId(this.getView().getId(), "emp_name").getValue();
			// oEntry["emp_email"] = sap.ui.core.Fragment.byId(this.getView().getId(), "emp_email").getValue();
			// oEntry["emp_contactnumber"] = sap.ui.core.Fragment.byId(this.getView().getId(), "emp_contactnumber").getValue();

			path = oEvent.getSource().getBindingContext("evalorgstruct").sPath;

			console.log(oEntry);
			console.log(path);
			if (!bValidationError) {
				sap.m.MessageBox.show(ConfirmSubmit, {
					icon: sap.m.MessageBox.Icon.QUESTION,
					title: that.getOwnerComponent().getModel("i18n").getResourceBundle().getText('ConfirmSubmit'),
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === "YES") {

							return new Promise(function (fnResolve, fnReject) {
								that._oODataModel.update(path, oEntry, {
									success: function (oData) {
										fnResolve();
										that._oODataModel.refresh();
										sap.m.MessageToast.show(that.getOwnerComponent().getModel("i18n").getResourceBundle().getText('updated'), {
											onClose: that._toggleButtonsAndViewevalorg(false),
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
			}
		},

		_getRequiredFields: function () {
			return [{
				"id": "emp_name",
				"type": "text",
				"required": true
			}, {
				"id": "emp_email",
				"type": "text",
				"required": true
			}, {
				"id": "emp_contactnumber",
				"type": "text",
				"required": true
			}];

		},
		formaturlevalorg: function (url) {
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
		myFormatterDateevalorg: function (value) {

			var d = new Date(value),
				month = '' + (d.getMonth() + 1),
				day = '' + d.getDate(),
				year = d.getFullYear();

			if (month.length < 2) month = '0' + month;

			if (day.length < 2) day = '0' + day;

			return [year, month, day].join('-');

		},

		_toggleButtonsAndViewevalorg: function (bEdit) {
			var oView = this.getView();

			// Show the appropriate action buttons
			oView.byId("edit").setVisible(!bEdit);
			oView.byId("save").setVisible(bEdit);
			oView.byId("cancel").setVisible(bEdit);

			// Set the right form type
			this._showFormFragmentevalorg(bEdit ? "Change" : "Display");
		},

		_getFormFragmentevalorg: function (sFragmentName) {
			var pFormFragment = this._formFragments[sFragmentName],
				oView = this.getView();

			if (!pFormFragment) {
				pFormFragment = Fragment.load({
					id: oView.getId(),
					name: "pwc.portal.eval.ClubEvaluations.view.Applications.OrgStructure.view." + sFragmentName,
					controller: this,
				});
				this._formFragments[sFragmentName] = pFormFragment;
			}

			return pFormFragment;
		},

		_showFormFragmentevalorg: function (sFragmentName) {
			var oPage = this.byId("page");

			oPage.removeAllContent();
			this._getFormFragmentevalorg(sFragmentName).then(function (oVBox) {
				oPage.insertContent(oVBox);
			});
		}
	});
});
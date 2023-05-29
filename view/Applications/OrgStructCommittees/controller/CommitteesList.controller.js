sap.ui.define([
	'../../../../controller/BaseController',
	"pwc/portal/eval/ClubEvaluations/service/RepoService",
	"sap/m/library",
	'sap/ui/core/Fragment'

], function (BaseController, RepoService, MLibrary, Fragment) {
	"use strict";
	var URLHelper = MLibrary.URLHelper;
	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.OrgStructCommittees.controller.CommitteesList", {
		pathid: 0,
		club_dms_id: '',

		onInit: function () {

			this._oODataModel = this.getOwnerComponent().getModel('Evalcommittee');
			this._formFragments = {};
			this._showFormFragmentcomlist("renumerationcommittee");

			this.getCurrentRouteName();

			var that = this;
			this.getOwnerComponent().getModel("User").read("/UserClub", {
				success: function (oData) {
					that.club_dms_id = oData.results[0].club_dms_id;
				},
				error: function (oError) {}
			});

		},

		FormatBoard: function (value) {

			if (value == "1") {
				return "ينتمي"
			} else {
				return "لا ينتمي"
			}

		},
		getCurrentRouteName: function () {
			var currentHash = this.getOwnerComponent().getRouter().getHashChanger().getHash().split('/')[4];
			if (currentHash == "لجنة المكافآت") {
				this.handleComRenswitch();
			} else if (currentHash == "اللجنة التنفيذية") {
				this.handleComExecswitch();
			} else if (currentHash == "لجنة الاستثمار") {
				this.handleComInvswitch();
			} else {
				this.handleComBoardswitch();
			}
			console.log(currentHash);
		},
		handleLinkObjectAttributePresscomlist: function (oEvent) {
			var url = oEvent.getSource().mProperties.text;
			var that = this;
			url = url.trim();
			var sLink = '';
			RepoService.getRepoId().then(function (ReposId) {
				sLink = that.club_dms_id + "/Evaluation/" + url;
				URLHelper.redirect(sLink, true);
			});

		},
		formaturlcomlist: function (url) {

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

		myFormatterDatecomlist: function (value) {

			var d = new Date(value),
				month = '' + (d.getMonth() + 1),
				day = '' + d.getDate(),
				year = d.getFullYear();

			if (month.length < 2) month = '0' + month;

			if (day.length < 2) day = '0' + day;

			return [year, month, day].join('-');

		},

		handleComExecswitch: function () {

			var that = this;
			this.getOwnerComponent().getModel("Evalcommittee").read("/CLUB_ORG_STRUC_ExecutiveCommittee", {
				success: function (oData) {
					var path = oData.results[0];
					that.pathid = path.id;
					// that.getView().byId("BlockLayout2").setVisible(true);

					that.getView().bindElement("Evalcommittee>/CLUB_ORG_STRUC_ExecutiveCommittee(" + path.id + "l)");

				},
				error: function (oError) {}
			});

		},
		handleComInvswitch: function () {

			var that = this;

			this.getOwnerComponent().getModel("Evalcommittee").read("/CLUB_ORG_STRUC_InvestmentCommittee", {
				success: function (oData) {
					var path = oData.results[0];
					that.pathid = path.id;
					// that.getView().byId("BlockLayout2").setVisible(true);

					that.getView().bindElement("Evalcommittee>/CLUB_ORG_STRUC_InvestmentCommittee(" + path.id + "l)");

				},
				error: function (oError) {}
			});

		},
		handleComRenswitch: function () {

			var that = this;
			this.getOwnerComponent().getModel("Evalcommittee").read("/CLUB_ORG_STRUC_RemunerationCommittee", {
				success: function (oData) {
					var path = oData.results[0];
					that.pathid = path.id;
					// that.getView().byId("BlockLayout2").setVisible(true);

					that.getView().bindElement("Evalcommittee>/CLUB_ORG_STRUC_RemunerationCommittee(" + path.id + "l)");

				},
				error: function (oError) {}
			});

		},

		handleComBoardswitch: function () {

			var that = this;

			this.getOwnerComponent().getModel("Evalcommittee").read("/CLUB_ORG_STRUC_BoardofDirectorsCommittee", {
				success: function (oData) {
					var path = oData.results[0];
					that.pathid = path.id;
					that.getView().byId("BlockLayout2").setVisible(true);
					that.getView().byId("AreofSpecialityvalue").setVisible(true);
					that.getView().byId("AreofSpecialityinput").setVisible(true);

					that.getView().bindElement("Evalcommittee>/CLUB_ORG_STRUC_BoardofDirectorsCommittee(" + path.id + "l)");

				},
				error: function (oError) {}
			});

		},

		_getFormFragmentcomlist: function (sFragmentName) {
			var pFormFragment = this._formFragments[sFragmentName],
				oView = this.getView();

			if (!pFormFragment) {
				pFormFragment = Fragment.load({
					id: oView.getId(),
					name: "pwc.portal.eval.ClubEvaluations.view.Applications.OrgStructCommittees.view." + sFragmentName,
					controller: this,
				});
				this._formFragments[sFragmentName] = pFormFragment;
			}

			return pFormFragment;
		},

		_showFormFragmentcomlist: function (sFragmentName) {
			var oPage = this.byId("page");

			oPage.removeAllContent();
			this._getFormFragmentcomlist(sFragmentName).then(function (oVBox) {
				oPage.insertContent(oVBox);
			});
		},

		onUploadcomlist: function (oEvent) {
			var that = this,
				oModel = this.getView().getModel();

			var file = oEvent.getParameter("files")[0];
			var sBindingPath = "/CLUB_ORG_STRUC_COM(" + this.pathid + "l)";
			var datapath = oEvent.getSource().oFilePath.oParent.sId.split('--')[2];
			console.log(datapath);
			if (file != '') {
				RepoService.uploadFile(file, that.club_dms_id).then(function (param1, param2) {
					var oEntry = {};
					var filename = param1.properties['cmis:name'].value;
					var sLink = '';
					RepoService.getRepoId().then(function (ReposId) {
						sLink = that.club_dms_id + "/Evaluation/" + filename;

						oEntry[datapath] = sLink;
						console.log(oEntry);
						sap.m.MessageBox.show("تحديث", {
							icon: sap.m.MessageBox.Icon.QUESTION,
							title: "تحديث",
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === "YES") {

									return new Promise(function (fnResolve, fnReject) {
										that._oODataModel.update(sBindingPath, oEntry, {
											success: function (oData) {
												fnResolve();
												that._oODataModel.refresh();
												sap.m.MessageToast.show('Updated', {
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
		}

	});
});
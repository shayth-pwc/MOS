sap.ui.define([
	'../../../../controller/BaseController',
	'sap/ui/model/json/JSONModel',
	"pwc/portal/eval/ClubEvaluations/service/RepoService",
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	"sap/m/library"
], function (BaseController, JSONModel, RepoService, Filter, FilterOperator, MLibrary) {
	"use strict";
	var URLHelper = MLibrary.URLHelper;
	return BaseController.extend(
		"pwc.portal.eval.ClubEvaluations.view.Applications.OrgStructureOverview.controller.OrganizationalStructureEval", {
			club_id: 0,
			club_dms_id:'',

			onInit: function () {
				this._oODataModel = this.getOwnerComponent().getModel("evalorg");

				var that = this;
				this.handleComBoardswitch();

				this.getOwnerComponent().getModel("User").read("/UserClub", {
					success: function (oData) {
						that.club_id = oData.results[0].club_id;
						that.club_dms_id = oData.results[0].club_dms_id;

						var aFilters = [];

						var filter = new Filter("club_id", FilterOperator.EQ, oData.results[0].club_id);
						aFilters.push(filter);

						// update list binding
						var oList = that.getView().byId("Departmentlist");
						var oBinding = oList.getBinding("items");
						oBinding.filter(aFilters, "Application");
					},
					error: function (oError) {}
				});

			},

			handleComBoardswitch: function (oEvent) {

				var that = this;
				var com_dms = '';
				this.getOwnerComponent().getModel("evalorg").read("/CLUB_ORG_STRUC_OrgUpload", {
					success: function (oData) {
						var path = oData.results[0];
						that.pathid = path.id;
						that.getView().byId('com_cmis_id2').bindElement("evalorg>/CLUB_ORG_STRUC_OrgUpload(" + path.id + "l)");
						console.log(that.getView().byId('com_cmis_id2'));

					},
					error: function (oError) {}
				});

			},

			onUploadevalorg: function (oEvent) {
				var that = this,
					oModel = this.getView().getModel();

				var file = oEvent.getParameter("files")[0];
				var sBindingPath = "/CLUB_ORG_STRUC_COM(" + this.pathid + "l)";
				var datapath = oEvent.getSource().oFilePath.oParent.sId.split('--')[2];
				console.log(datapath);
				if (file != '') {
				RepoService.uploadFile(file,that.club_dms_id).then(function (param1, param2) {
						var oEntry = {};
						var filename = param1.properties['cmis:name'].value;
						var sLink = '';
						RepoService.getRepoId().then(function (ReposId) {
						sLink = that.club_dms_id + "/Evaluation/" + filename;

							oEntry[datapath] = sLink;
							console.log(oEntry);
							sap.m.MessageBox.show("يتأكد", {
								icon: sap.m.MessageBox.Icon.QUESTION,
								title: "يتأكد",
								actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
								onClose: function (oAction) {
									if (oAction === "YES") {

										return new Promise(function (fnResolve, fnReject) {
											that._oODataModel.update(sBindingPath, oEntry, {
												success: function (oData) {
													fnResolve();
													that._oODataModel.refresh();
													sap.m.MessageToast.show('Update', {
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
			handleLinkObjectAttributePressevalorg: function (oEvent) {
				var url = oEvent.getSource().mProperties.text;
				url = url.trim();

				var sLink = '';
				RepoService.getRepoId().then(function (ReposId) {
					sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + url;
					URLHelper.redirect(sLink, true);
				});

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
			
			
			onSeePositionevalorg: function (oEvent) {
				var that = this;
				that._onItemPressevalorg(oEvent, "AddItem", "CheckPosition");
			},
			onSeeEmployeeevalorg: function (oEvent) {
				var that = this;
				that._onItemPressevalorg(oEvent, "AddItem", "CheckEmployee");
			},
			_onItemPressevalorg: function (oEvent, FormType, FormID) {
				var that = this,
					dialog = that.byId(FormID),
					item = oEvent.getSource();

				console.log(item._aSelectedPaths[0]);
				dialog.bindObject("evalorg>" + item._aSelectedPaths[0]);
				dialog.open();
			},
			closedept: function () {
				var that = this;
				that.byId("CheckPosition").close();
			},
			closecom: function () {
				var that = this;
				that.byId("CheckEmployee").close();
			},
			handleSearchdep: function (oEvent) {
				// add filter for search
				var aFilters = [];
				var sQuery = oEvent.getSource().getValue();
				if (sQuery && sQuery.length > 0) {
					var filter = new Filter("club_dept_name", FilterOperator.Contains, sQuery);
					aFilters.push(filter);
				}
				// update list binding
				var oList = this.byId("Departmentlist");
				var oBinding = oList.getBinding("items");
				oBinding.filter(aFilters, "Application");
			},
			handleSearchcom: function (oEvent) {
				// add filter for search
				var aFilters = [];
				var sQuery = oEvent.getSource().getValue();
				if (sQuery && sQuery.length > 0) {
					var filter = new Filter("club_com_name", FilterOperator.Contains, sQuery);
					aFilters.push(filter);
				}
				// update list binding
				var oList = this.byId("CommitteeList");
				var oBinding = oList.getBinding("items");
				oBinding.filter(aFilters, "Application");
			},

		});
});
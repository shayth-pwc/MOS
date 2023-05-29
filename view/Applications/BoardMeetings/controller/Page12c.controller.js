sap.ui.define([

	"pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"sap/m/MessageBox",
	"./Review12c", "./Create12c",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"

], function (BaseController, MessageBox, Review12c, Create12c, Utilities, History, RepoService, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.BoardMeetings.controller.Page12c", {
		club_cmis_id: '',
		onInit: async function () {

			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.getRouter().getRoute("BoardMeetings").attachPatternMatched(await this.evaluationStart, this);
			this._oODataModel = this.getOwnerComponent().getModel("RegBoardMeeting");

			var that = this;
			this.getOwnerComponent().getModel("User").read("/UserClub", {
				success: function (oData) {
					that.club_dms_id = oData.results[0].club_dms_id;
				},
				error: function (oError) {}
			});

		},
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

		_onButtonPress12c: function (oEvent) {
			var sDialogName = "Create12c";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Create12c(this.getView());
				this.mDialogs[sDialogName] = oDialog;
				oDialog.setRouter(this.oRouter);
			}
			var oContext = this.getView().getModel("RegBoardMeeting").createEntry("/BOARDMEETING");
			oDialog._oControl.bindElement("RegBoardMeeting>" + oContext.sPath);
			oDialog.open();
		},
		_onRowPress12c: function (oEvent) {
			var sDialogName = "Review12c";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Review12c(this.getView());
				this.mDialogs[sDialogName] = oDialog;
				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			var context = oEvent.getSource().getBindingContext("RegBoardMeeting");
			console.log(context);
			oDialog._oControl.bindElement("RegBoardMeeting>" + context.sPath);
			oDialog.open();

		},

		_onDeleteRow12c: function (oEvent) {
			var that = this;
			var ConfirmSubmit = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Confirm');
			var sPath = oEvent.getSource().getParent().getBindingContext("RegBoardMeeting").getPath();
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

		_onEditRow12c: function (oEvent) {

			var sDialogName = "Create12c";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Create12c(this.getView());
				this.mDialogs[sDialogName] = oDialog;
				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			// Set the Binding Context to the Dialog
			var context = oEvent.getSource().getBindingContext("RegBoardMeeting");
			oDialog._oControl.bindElement("RegBoardMeeting>" + context.sPath);
			oDialog._Event = oEvent.getSource().getId();
			oDialog.open();
		},

		openlink: function (oEvent) {
			var that = this;
			var sLink = '';
			var filename = oEvent.getSource().getText();
			RepoService.getRepoId().then(function (ReposId) {
				// sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + filename;
				sLink = that.club_dms_id + "/Evaluation/" + filename;

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
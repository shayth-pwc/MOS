sap.ui.define([
	"pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"sap/m/MessageBox",
	"./AddAccount", "./AddActivity",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService",
	'sap/ui/core/Fragment'

], function (BaseController, MessageBox, AddAccount, AddActivity, Utilities, History, RepoService, Fragment) {
	"use strict";

	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.RecreationalActivitiesGuide.controller.events", {
		handleRouteMatched: function (oEvent) {
			var sAppId = "App62664739f30c5c0347b264ab";

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

		AddActivity: function (oEvent) {

			var sDialogName = "AddActivity";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new AddActivity(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			var oContext = this.getView().getModel("RecreationalEvents").createEntry("/RECEFF");

			oDialog._oControl.setBindingContext(oContext, "RecreationalEvents");
			oDialog.open();

		},

		EditActivity: function (e) {
			var t = "AddActivity";
			this.mDialogs = this.mDialogs || {};
			var i = this.mDialogs[t];
			if (!i) {
				i = new AddActivity(this.getView());
				this.mDialogs[t] = i;
				i.setRouter(this.oRouter)
			}
			var o = e.getSource().getBindingContext("RecreationalEvents");
			i._oControl.setBindingContext(o, "RecreationalEvents");
			i.open()
		},

		DeleteActivity: function (oEvent) {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var that = this,
				sPath = oEvent.getSource().getParent().getBindingContext("RecreationalEvents").getPath(),
				oModel = that.getView().getModel("RecreationalEvents");
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

		_onOverflowToolbarButtonPress2: function (oEvent) {

			var sDialogName = "AddActivity";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new AddActivity(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext("RecreationalEvents");
			oDialog._oControl.setBindingContext(context, "RecreationalEvents");

			oDialog.open();

		},

		_onButtonPress: function (oEvent) {
			var that = this;
			that._onItemPress(oEvent, "AddItem", "AddAttendance");
			console.log(oEvent.getSource().getBindingContext("RecreationalEvents"));
			// that.getView().byId("Attendacne_table").setBindingContext(oEvent.getSource().getBindingContext());

		},

		_onRowPress: function (oEvent) {
			var that = this;
			// that._onItemPress(oEvent, "AddItem", "AddAttendance");
			console.log(oEvent.getSource().getBindingContext("RecreationalEvents"));
			that.getView().byId("Attendacne_table").setBindingContext(oEvent.getSource().getBindingContext("RecreationalEvents"),
				"RecreationalEvents");
			that.getView().byId("Attendacne_table").setVisible(true);

		},

		onSave: function (oEvent) {
			var that = this,
				oView = this.getView(),
				bValidationError = false,
				oEntInd, Form,
				ConfirmSubmit = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Confirm'),
				oBusy = new sap.m.BusyDialog(),
				oEntry = {},
				path, currentdata,
				FieldInfo = that._getRequiredFields2();

			FieldInfo.forEach(function (item, index, arr) {
				oEntInd = item.id;

				if (item.type === "text") {
					oEntry[oEntInd] = that.byId(item.id).getValue();

				} else if (item.type === "select") {
					oEntry[oEntInd] = that.byId(item.id).getSelectedKey();
				}
				if (oEntry[oEntInd] === "" && item.required === true) {
					bValidationError = true;
					that.byId(item.id).setValueState("Error");
				} else if (oEntry[oEntInd] !== "" && item.required === true) {
					that.byId(item.id).setValueState("None");
				} else {
					that.byId(item.id).setValueState("None");
				}
			});

			path = oEvent.getSource().getBindingContext("RecreationalEvents").sPath;
			currentdata = this.getView().getModel("RecreationalEvents").getProperty(path).id;
			console.log(currentdata);

			// oEntry["age_groups"] = that.byId("age_groups").getValue();
			// oEntry["male_attendance"] = that.byId("male_attendance").getValue();
			// oEntry["female_attendance"] = that.byId("female_attendance").getValue();
			oEntry["recreational_id"] = currentdata;
			oEntry["total_attendance"] = that.byId("male_attendance").getValue() + that.byId("female_attendance").getValue();

			//oEntry["created_by"] = sap.ushell.Container.getService("UserInfo").getId();
			oEntry["created_by"] = "P00003";

			console.log(oEntry);

			ConfirmSubmit = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Confirm');
			Form = "AddItem";
			if (!bValidationError) {
				sap.m.MessageBox.show(ConfirmSubmit, {
					icon: sap.m.MessageBox.Icon.QUESTION,
					title: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Confirm'),
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === "YES") {

							return new Promise(function (fnResolve, fnReject) {
								that._oODataModel.create("/RECREA", oEntry, {
									success: function (oData) {
										fnResolve();
										// that._onButtonPress1(oEvent);
										sap.m.MessageToast.show(that.getOwnerComponent().getModel("i18n").getResourceBundle().getText('Create'), {
											onClose: that._onClose(),
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

		_onItemPress: function (oEvent, FormType, FormID) {
			var that = this,
				dialog = that.byId(FormID),
				item = oEvent.getSource();
			dialog.setBindingContext(item.getBindingContext("RecreationalEvents"), "RecreationalEvents");
			dialog.open();
			console.log(item.getBindingContext("RecreationalEvents"));
		},

		_onClose: function () {
			var that = this,
				FieldInfo = that._getRequiredFields2();

			FieldInfo.forEach(function (item, index, arr) {
				that.byId(item.id).setValueState("None");
				that.byId(item.id).setValue("");
			});
			that.byId("AddAttendance").close();

		},
		_getRequiredFields2: function () {
			return [{
				"id": "age_groups",
				"type": "select",
				"required": true
			}, {
				"id": "male_attendance",
				"type": "text",
				"required": true
			}, {
				"id": "female_attendance",
				"type": "text",
				"required": true
			}];

		},
		doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel("RecreationalEvents") : null;

			var sEntityNameSet;
			if (sPath !== null && sPath !== "") {
				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				sEntityNameSet = sPath.split("(")[0];
			}
			var sNavigationPropertyName;
			var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

			if (sEntityNameSet !== null) {
				sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet,
					sRouteName);
			}
			if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
				if (sNavigationPropertyName === "") {
					this.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function (bindingContext) {
						if (bindingContext) {
							sPath = bindingContext.getPath();
							if (sPath.substring(0, 1) === "/") {
								sPath = sPath.substring(1);
							}
						} else {
							sPath = "undefined";
						}

						// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
						if (sPath === "undefined") {
							this.oRouter.navTo(sRouteName);
						} else {
							this.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					}.bind(this));
				}
			} else {
				this.oRouter.navTo(sRouteName);
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		},

		_onRowPress1: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext("RecreationalEvents");

			return new Promise(function (fnResolve) {

				this.doNavigate("events", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			// this.oRouter.getTarget("events").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			this._oODataModel = this.getOwnerComponent().getModel("RecreationalEvents");

		},
		openlink: function (oEvent) {
			var sLink = '';
			var filename = oEvent.getSource().getText();
			RepoService.getRepoId().then(function (ReposId) {
				sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + filename;
				window.open(sLink);
			});
		},

		myFormatterDate: function (value) {

			var d = new Date(value),
				month = '' + (d.getMonth() + 1),
				day = '' + d.getDate(),
				year = d.getFullYear();

			if (month.length < 2) month = '0' + month;

			if (day.length < 2) day = '0' + day;

			return [year, month, day].join('-');

		},

		myFormatterAge: function (value) {

			if (value == 1) {
				return "18-25"
			} else if (value == 2) {
				return "26-39"
			} else if (value == 3) {
				return "40-59"
			} else {
				return "60 and above"
			}
		}

	});
}, /* bExport= */ true);
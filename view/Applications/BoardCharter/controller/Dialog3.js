sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService"

], function (ManagedObject, MessageBox, Utilities, History, RepoService) {

	return ManagedObject.extend("pwc.portal.eval.ClubEvaluations.view.Applications.BoardCharter.controller.Dialog3", {
		club_dms_id: '',
		constructor: function (oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "pwc.portal.eval.ClubEvaluations.view.Applications.BoardCharter.view.Dialog3",
				this);
			this._bInit = false;
		},

		exit: function () {
			delete this._oView;
		},

		getView: function () {
			return this._oView;
		},

		getControl: function () {
			return this._oControl;
		},

		getOwnerComponent: function () {
			return this._oView.getController().getOwnerComponent();
		},

		open: function () {
			var oView = this._oView;
			var oControl = this._oControl;

			if (!this._bInit) {

				// Initialize our fragment
				this.onInit();

				this._bInit = true;

				// connect fragment to the root view of this component (models, lifecycle)
				oView.addDependent(oControl);
			}

			var args = Array.prototype.slice.call(arguments);
			if (oControl.open) {
				oControl.open.apply(oControl, args);
			} else if (oControl.openBy) {
				oControl.openBy.apply(oControl, args);
			}
		},

		close: function () {
			this._oControl.close();
		},

		setRouter: function (oRouter) {
			this.oRouter = oRouter;

		},
		getBindingParameters: function () {
			return {};

		},
		_onButtonPress: function () {

			var oView = this.getView(),
				that = this,
				oEntry2 = {},
				oController = this,
				status = true,
				requiredFieldInfo = [{
					"id": "document_name",
					"type": "text",
					"required": true
				}, {
					"id": "priority",
					"type": "text",
					"required": true
				}, {
					"id": "risk_level",
					"type": "select",
					"required": true
				}, {
					"id": "migration_method",
					"type": "text",
					"required": true
				}, {
					"id": "storage_method",
					"type": "text",
					"required": true
				}];

			if (requiredFieldInfo.length) {
				status = this.handleChangeValuestate(requiredFieldInfo, oView);
			}
			requiredFieldInfo.forEach(function (item, index, arr) {
				if (item.type === 'text') {
					oEntry2[item.id] = oView.byId(item.id).getValue();

				} else {
					oEntry2[item.id] = oView.byId(item.id).getSelectedKey();
				}
			});

			if (status) {
				var self = this;
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
				var oModel = this.oModel;
				if (oModel.getPendingChanges()) {
					return new Promise(function (fnResolve) {
						sap.m.MessageBox.confirm(oResourceBundle.getText('ConfirmEditSubmit'), {
							title: oResourceBundle.getText('Confirm'),
							actions: [oResourceBundle.getText('Confirm'), oResourceBundle.getText('cancel')],
							onClose: function (sActionClicked) {
								if (sActionClicked === oResourceBundle.getText('Confirm')) {
									oModel.submitChanges({
										success: function (param) {
											sap.m.MessageToast.show(oResourceBundle.getText('Success'));
										},
										error: function (param) {

										}
									});
									self._oDialog.close();
								}
							}
						});
					}).catch(function (err) {
						if (err !== undefined) {
							MessageBox.error(err);
						}
					});
				}
			}
		},
		_onButtonPress1: function (oEvent) {

			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			var that = this,
				oModel = that.getView().getModel("BoardCharter"),
				sDialogID = oEvent.getSource().getParent().getId().split("-");
			sDialogID = sDialogID[sDialogID.length - 1];
			if (oModel.hasPendingChanges()) {
				MessageBox.confirm(oResourceBundle.getText('ConfirmCancel'), {
					onClose: function (oAction) {
						if (oAction === sap.m.MessageBox.Action.OK) {
							that.getView().getModel("BoardCharter").resetChanges();
							that.getView().getModel("BoardCharter").refresh();
							// that._aDialogs[sDialogID].close();
							that.close();
							that.getView().getModel("BoardCharter").refresh();
						}
					}
				});
			} else {
				this.getView().getModel("BoardCharter").resetChanges();

				//this.byId("createDialog").close();

				// that._aDialogs[sDialogID].close();

				that.close();

			}
		},
		onInit: function () {
			var that = this;
			this.getOwnerComponent().getModel("User").read("/UserClub", {
				success: function (oData) {
					that.club_dms_id = oData.results[0].club_dms_id;
				},
				error: function (oError) {}
			});

			this._oDialog = this.getControl();
			this.oModel = this.getOwnerComponent().getModel("BoardCharter");

		},
		handleChangeValuestate: function (requiredFieldInfo, oView) {
			var status = true;
			if (requiredFieldInfo) {
				requiredFieldInfo.forEach(function (requiredinfo) {
					var input = oView.byId(requiredinfo.id);
					if (input) {
						input.setValueState("None"); //initially set ValueState to None
						if (input.getValue() === '') {
							input.setValueState("Error"); //input is blank set ValueState to error
							status = false;
						} else if (input.getDateValue && !input._bValid) { //since 1.64 ui5 will be providing a function 'isValidValue' that can be used here.
							input.setValueState("Error"); //Invalid Date set ValueState to error
							status = false;
						}
					}
				});
			}
			return status;

		},
		onExit: function () {
			this._oDialog.destroy();

		},

		handleUploadPress: function (oEvent) {
			var that = this;

			var oModel = this._oControl.getModel("BoardCharter");

			var file = oEvent.getParameter("files")[0];
			var sBindingPath = oEvent.getSource().getBindingContext("BoardCharter").getPath(); // oEvent.get
			var sPath = 'proof_cmis_id';
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

		handleCreateChange: function (oEvent) {
			var oDateTimePickerStart = this.getView().byId("start_date_time1"),
				oDateTimePickerEnd = this.getView().byId("end_date_time1");
			this._validateDateTimePicker(oDateTimePickerStart, oDateTimePickerEnd);
		},

		_validateDateTimePicker: function (oDateTimePickerStart, oDateTimePickerEnd) {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			var oStartDate = oDateTimePickerStart.getDateValue(),
				oEndDate = oDateTimePickerEnd.getDateValue(),
				sValueStateText = oResourceBundle.getText('dateDifferenceValidation');

			if (oStartDate && oEndDate && oEndDate.getTime() <= oStartDate.getTime()) {
				oDateTimePickerStart.setValueState(sap.ui.core.ValueState.Error);
				oDateTimePickerEnd.setValueState(sap.ui.core.ValueState.Error);
				oDateTimePickerStart.setValueStateText(sValueStateText);
				oDateTimePickerEnd.setValueStateText(sValueStateText);

			} else {
				oDateTimePickerStart.setValueState(sap.ui.core.ValueState.None);
				oDateTimePickerEnd.setValueState(sap.ui.core.ValueState.None);

			}
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

	});
}, /* bExport= */ true);
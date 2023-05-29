sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService",
	"sap/ui/model/json/JSONModel"
], function (ManagedObject, MessageBox, Utilities, History, RepoService, JSONModel) {

	return ManagedObject.extend("pwc.portal.eval.ClubEvaluations.view.Applications.plansSPO.controller.plansSPOcreate", {
		club_dms_id: '',
		constructor: function (oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "pwc.portal.eval.ClubEvaluations.view.Applications.plansSPO.view.plansSPOcreate",
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
		_onDialogAfterClose: function () {

			this.close();

		},
		_onSubmit: function (oEvent) {
			var oView = this.getView(),
				that = this,
				oEntry = {},
				oController = this,
				status = true,
				requiredFieldInfo = [{
					"id": "activity_name",
					"type": "text",
					"required": true
				}, {
					"id": "activity_description",
					"type": "text",
					"required": true
				}, {
					"id": "strategic_goal",
					"type": "select",
					"required": true
				}, {
					"id": "related_department",
					"type": "select",
					"required": true
				}, {
					"id": "finance_resource",
					"type": "number",
					"required": true
				}, {
					"id": "expense_allocation",
					"type": "number",
					"required": true
				}, {
					"id": "human_resources_number",
					"type": "number",
					"required": true
				}, {
					"id": "kpi_id",
					"type": "select",
					"required": true
				}, {
					"id": "target_percentage",
					"type": "number",
					"required": true
				}, {
					"id": "start_date_time",
					"type": "text",
					"required": true
				}, {
					"id": "end_date_time",
					"type": "text",
					"required": true
				}];

			if (requiredFieldInfo.length) {
				status = this.handleChangeValuestate(requiredFieldInfo, oView);
			}
			requiredFieldInfo.forEach(function (item, index, arr) {
				if (item.type === 'text') {
					oEntry[item.id] = oView.byId(item.id).getValue();

				} else {
					oEntry[item.id] = oView.byId(item.id).getSelectedKey();
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

		_onCancel: function () {
			var self = this;
			var sPath;
			sPath = this._oControl.getBindingContext("plansSPO").getPath();
			sPath = sPath.replace('/', '');
			if (this._oControl.getModel("plansSPO").getPendingChanges()[sPath]) {
				this._oControl.getModel("plansSPO").resetChanges([this._oControl.getBindingContext("plansSPO").getPath()], undefined, /*bDeleteCreatedEntities*/
					true);
			}
			var requiredFieldInfo = this.getView().getControlsByFieldGroupId("uploader");
			requiredFieldInfo.forEach(function (RequiredInfo) {

				RequiredInfo.setValueState(sap.ui.core.ValueState.None);

			});
			this.close();

		},
		handleUploadPress: function (oEvent) {
			var that = this;

			var oModel = this._oControl.getModel("plansSPO");

			var file = oEvent.getParameter("files")[0];
			var sBindingPath = oEvent.getSource().getBindingContext("plansSPO").getPath(); // oEvent.get
			var sPath = "signed_doc_cmis_id";
			// var sPath = oEvent.getSource().getParent().getFields()[1].mBindingInfos.text.binding.sPath;
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
		onInit: function () {

			this._oDialog = this.getControl();
			this.oModel = this.getOwnerComponent().getModel("plansSPO");
			var that = this;
			this.getOwnerComponent().getModel("User").read("/UserClub", {
				success: function (oData) {
					that.club_dms_id = oData.results[0].club_dms_id;
				},
				error: function (oError) {}
			});

		},
		onExit: function () {
			this._oDialog.destroy();

		},
		_getRequiredFields: function () {

			return [{
				"id": "activity_name",
				"type": "text",
				"required": true
			}, {
				"id": "activity_type",
				"type": "select",
				"required": true
			}, {
				"id": "activity_description",
				"type": "text",
				"required": true
			}, {
				"id": "strategic_goal",
				"type": "select",
				"required": true
			}, {
				"id": "related_department",
				"type": "select",
				"required": true
			}, {
				"id": "finance_resource",
				"type": "number",
				"required": true
			}, {
				"id": "expense_allocation",
				"type": "number",
				"required": true
			}, {
				"id": "human_resources_number",
				"type": "number",
				"required": true
			}, {
				"id": "kpi_id",
				"type": "select",
				"required": true
			}, {
				"id": "target_percentage",
				"type": "number",
				"required": true
			}, {
				"id": "start_date_time",
				"type": "text",
				"required": true
			}, {
				"id": "end_date_time",
				"type": "text",
				"required": true
			}];
		},

		handleChangeValuestate: function (requiredFieldInfo, oView) {
			var status = true;
			if (requiredFieldInfo) {
				requiredFieldInfo.forEach(function (requiredinfo) {
					var input = oView.byId(requiredinfo.id);
					if (input) {
						input.setValueState("None"); //initially set ValueState to None
						if (requiredinfo.type === 'text') {

							if (input.getValue() === '') {
								input.setValueState("Error"); //input is blank set ValueState to error
								status = false;
							} else if (input.getDateValue && !input._bValid) { //since 1.64 ui5 will be providing a function 'isValidValue' that can be used here.
								input.setValueState("Error"); //Invalid Date set ValueState to error
								status = false;
							}
						} else if (requiredinfo.type === 'select') {

							if (input.getSelectedKey() === '') {
								input.setValueState("Error"); //input is blank set ValueState to error
								status = false;
							}

						}
					}
				});
			}
			return status;

		},

		handleCreateChange: function (oEvent) {
			var oDateTimePickerStart = this.getView().byId("start_date_time"),
				oDateTimePickerEnd = this.getView().byId("end_date_time");
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
		}
	});
}, /* bExport= */ true);
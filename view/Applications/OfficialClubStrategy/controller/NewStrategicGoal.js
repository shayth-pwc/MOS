sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
		"pwc/portal/eval/ClubEvaluations/service/RepoService"
], function (ManagedObject, MessageBox, History, JSONModel, Fragment, Filter, FilterOperator,RepoService) {

	return ManagedObject.extend("pwc.portal.eval.ClubEvaluations.view.Applications.OfficialClubStrategy.controller.NewStrategicGoal", {
				club_dms_id: '',

		constructor: function (oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "pwc.portal.eval.ClubEvaluations.view.Applications.OfficialClubStrategy.view.NewStrategicGoal", this);
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
		urlformatter: function (url) {

			if (!url) {
				return "No File Uploaded";
			} else if (url == 'null') {

				return "No File Uploaded";
			} else {
				var ret = url.split('/').pop();
				return ret;
			}
		},

		open: function () {
			var oView = this._oView;
			var oControl = this._oControl;
			var goalType = oControl.getBindingContext("OfficialClub").getObject("goal_type");

			if (!this._bInit) {

				// Initialize our fragment
				this.onInit();

				this._bInit = true;

				// connect fragment to the root view of this component (models, lifecycle)
				oView.addDependent(oControl);
			}

			if (goalType === "1" || !goalType) {
				oView.byId("EmpDepLabel").setVisible(false);
				oView.byId("EmpDepSelect").setVisible(false);
			} else {
				oView.byId("EmpDepLabel").setVisible(true);
				oView.byId("EmpDepSelect").setVisible(true);
				this.onSelectGoalType();

			}

			if (this._Event.includes("item")) {
				this.setEnabled(false);
			} else {
				this.setEnabled(true);
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

		_onSubmit: function (oEvent) {
			var oView = this.getView(),
				oController = this,
				status = true,
				requiredFieldInfo = oController._getRequiredFields();

			if (requiredFieldInfo.length) {
				status = this.handleChangeValuestate(requiredFieldInfo, oView);
			}
			if (status) {
				var self = this;
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
				return new Promise(function (fnResolve, fnReject) {
					var oModel = oController.oModel;
					var fnResetChangesAndReject = function (sMessage) {
						oModel.resetChanges();
						fnReject(new Error(sMessage));
					};

					if (oModel && oModel.hasPendingChanges()) {
						sap.m.MessageBox.confirm(oResourceBundle.getText('confirmationmsg'), {
							title: oResourceBundle.getText('confirmation'),
							actions: [oResourceBundle.getText('confirm'), oResourceBundle.getText('cancel')],
							onClose: function (sActionClicked) {
								if (sActionClicked === oResourceBundle.getText('confirm')) {
									oModel.submitChanges({
										success: function (oResponse) {
											var oBatchResponse = oResponse.__batchResponses[0];
											var oChangeResponse = oBatchResponse.__changeResponses && oBatchResponse.__changeResponses[0];
											if (oChangeResponse && oChangeResponse.data) {
												var sNewContext = oModel.getKey(oChangeResponse.data);
												oView.unbindObject();
												oView.bindObject({
													path: "/" + sNewContext
												});
												if (window.history && window.history.replaceState) {
													window.history.replaceState(undefined, undefined, window.location.hash.replace(encodeURIComponent(oController.sContext),
														encodeURIComponent(sNewContext)));
												}
												oModel.refresh();
												fnResolve();
											} else if (oChangeResponse && oChangeResponse.response) {
												fnResetChangesAndReject(oChangeResponse.message);
											} else if (!oChangeResponse && oBatchResponse.response) {
												fnResetChangesAndReject(oBatchResponse.message);
											} else {
												oModel.refresh();
												fnResolve();
											}
										},
										error: function (oError) {
											fnReject(new Error(oError.message));
										}
									});
									self._oDialog.close();
								}
							}
						});

					} else {
						fnResolve();
					}
				}).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
			}
		},
		handleChangeValuestate: function (requiredFieldInfo, oView) {
			var status = true;
			if (requiredFieldInfo) {
				requiredFieldInfo.forEach(function (requiredinfo) {
					var input = oView.byId(requiredinfo.id);
					if (input && requiredinfo.type === "Value") {
						input.setValueState("None"); //initially set ValueState to None
						if (input.getValue() === '') {
							input.setValueState("Error"); //input is blank set ValueState to error
							status = false;
						} else if (input.getDateValue && !input._bValid) { //since 1.64 ui5 will be providing a function 'isValidValue' that can be used here.
							input.setValueState("Error"); //Invalid Date set ValueState to error
							status = false;
						}
					} else {
						input.setValueState("None"); //initially set ValueState to None
						if (input.getSelectedKey() === '') {
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
		_onCancel: function (oEvent) {
		var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			var that = this,
				oModel = that.getView().getModel("OfficialClub"),
				sDialogID = oEvent.getSource().getParent().getId().split("-");
			sDialogID = sDialogID[sDialogID.length - 1];
			if (oModel.hasPendingChanges()) {
				MessageBox.confirm(oResourceBundle.getText('ConfirmCancel'), {
					onClose: function (oAction) {
						if (oAction === sap.m.MessageBox.Action.OK) {
							that.getView().getModel("OfficialClub").resetChanges();
							that.getView().getModel("OfficialClub").refresh();
							// that._aDialogs[sDialogID].close();
							that.close();
							that.getView().getModel("OfficialClub").refresh();
						}
					}
				});
			} else {
				this.getView().getModel("OfficialClub").resetChanges();
				

				//this.byId("createDialog").close();
				
				// that._aDialogs[sDialogID].close();

					

							that.close();

			}
		},


		onInit: function () {
			var oViewModel = new JSONModel({
				enabled: true
			});
			this.getView().setModel(oViewModel, "appView");
			this._oDialog = this.getControl();

			this.oModel = this.getOwnerComponent().getModel("OfficialClub");
			var that = this;
			this.getOwnerComponent().getModel("User").read("/UserClub", {
				success: function (oData) {
					that.club_dms_id = oData.results[0].club_dms_id;
				},
				error: function (oError) {}
			});

		},
		setEnabled: function (bEnabled) {
			var oModel = this.getView().getModel("appView");
			oModel.setProperty("/enabled", bEnabled);
		},
		onExit: function () {
			this._oDialog.destroy();

		},
		onSelectGoalType: function (oEvent) {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var GoalType = this.getView().byId("GoalType").getSelectedKey();

			var SelectButton = this.getView().byId("EmpDepSelect");

			switch (GoalType) {
			case '0':

				SelectButton.setVisible(true);
				this.getView().byId("EmpDepLabel").setVisible(true);

				this.getView().byId("EmpDepLabel").setText(oResourceBundle.getText('DepartmentTypeKey'));

				SelectButton.bindAggregation("suggestionItems", "OfficialClub>/CLUB_ORG_STRUC_DEP", new sap.ui.core.Item({
					key: "{OfficialClub>id}",
					text: "{OfficialClub>club_dept_name}"
				}));
				break;
			case '1':
				SelectButton.setVisible(false);
				this.getView().byId("EmpDepLabel").setVisible(false);
				break;

			case '2':
				SelectButton.setVisible(true);
				this.getView().byId("EmpDepLabel").setVisible(true);

				this.getView().byId("EmpDepLabel").setText(oResourceBundle.getText('EmployeeTypeKey'));

				SelectButton.bindAggregation("suggestionItems", "OfficialClub>/CLUB_ORG_STRUC_EMP", new sap.ui.core.Item({
					key: "{OfficialClub>id}",
					text: "{OfficialClub>emp_name}"
				}));

				break;

			}
		},
		onValueHelpRequest: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue(),
				oView = this.getView();

			if (!this._pValueHelpDialog) {
				this._pValueHelpDialog = Fragment.load({
					id: oView.getId(),
					name: "pwc.portal.eval.ClubEvaluations.view.Applications.OfficialClubStrategy.view.ValueHelpDialog3",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);

					return oDialog;
				});
			}
			this._pValueHelpDialog.then(function (oDialog) {
				var GoalType = oView.byId("GoalType").getSelectedKey();
				switch (GoalType) {
				case '0':
					oView.byId("selectDialog3").bindAggregation("items", "OfficialClub>/CLUB_ORG_STRUC_DEP", new sap.m.StandardListItem({
						 description:"{OfficialClub>id}",
						title: "{OfficialClub>club_dept_name}"
					}));
					oDialog.getBinding("items").filter([new Filter("club_dept_name", FilterOperator.Contains, sInputValue)]);

					break;
				case '2':

					oView.byId("selectDialog3").bindAggregation("items", "OfficialClub>/CLUB_ORG_STRUC_EMP", new sap.m.StandardListItem({
						description: "{OfficialClub>id}",
						title: "{OfficialClub>emp_name}",
												info: "{OfficialClub>club_dept_name}"

					}));
					oDialog.getBinding("items").filter([new Filter("emp_name", FilterOperator.Contains, sInputValue)]);

					break;

				}

				// Create a filter for the binding
				// Open ValueHelpDialog filtered by the input's value
				oDialog.open(sInputValue);
			});
		},
		onValueHelpDialogSearch: function (oEvent) {
			var GoalType = this.getView().byId("GoalType").getSelectedKey();

			var sValue = oEvent.getParameter("value");
			switch (GoalType) {
			case '0':
				oEvent.getSource().getBinding("items").filter([new Filter("club_dept_name", FilterOperator.Contains, sValue)]);

				break;
			case '2':

				oEvent.getSource().getBinding("items").filter([new Filter("emp_name", FilterOperator.Contains, sValue)]);

				break;

			}

		},
		onValueHelpDialogClose: function (oEvent) {
			var sDescription,
				oSelectedItem = oEvent.getParameter("selectedItem");
			oEvent.getSource().getBinding("items").filter([]);

			if (!oSelectedItem) {
				return;
			}

			sDescription = oSelectedItem.getDescription();

			this.getView().byId("EmpDepSelect").setSelectedKey(sDescription);

		},

		_getRequiredFields: function () {

			return [{
				"id": "GoalNameInput",
				"type": "Value"
			}, {
				"id": "GoalDescriptionText",
				"type": "Value"
			}, {
				"id": "GoalStartDatePicker",
				"type": "Value"
			}, {
				"id": "GoalEndDatePicker",
				"type": "Value"
			}, {
				"id": "GoalType",
				"type": "Selected"
			}];
		},
		handleCreateChange: function (oEvent) {
			var oDateTimePickerStart = this.getView().byId("GoalStartDatePicker"),
				oDateTimePickerEnd = this.getView().byId("GoalEndDatePicker");
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
		handleUploadPress: function (oEvent) {
			var that = this;

			var oModel = this._oControl.getModel("OfficialClub");

			var file = oEvent.getParameter("files")[0];
			var sBindingPath = oEvent.getSource().getBindingContext("OfficialClub").getPath(); // oEvent.get
			var sPath = 'proof_cmis_id';
			if (file !== '') {
				if (file !== "") {
					var sendpath = that.club_dms_id;
					RepoService.uploadFile(file, sendpath).then(function (param1, param2) {

						// RepoService.uploadFile(file).then(function (param1, param2) {
						var filename = param1.properties['cmis:name'].value;
						oModel.setProperty(sBindingPath + "/" + sPath, sendpath + "/Evaluation/" +   filename);
					});

				}
			}
		}
		
		

	});
}, /* bExport= */ true);
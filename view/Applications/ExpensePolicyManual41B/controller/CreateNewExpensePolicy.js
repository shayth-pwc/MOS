sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"

], function (ManagedObject, MessageBox, Utilities, History, RepoService, JSONModel, Fragment, Filter, FilterOperator) {

	return ManagedObject.extend("pwc.portal.eval.ClubEvaluations.view.Applications.ExpensePolicyManual41B.controller.CreateNewExpensePolicy", {
		club_dms_id: '',
		id: "",

		constructor: function (oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(),
				"pwc.portal.eval.ClubEvaluations.view.Applications.ExpensePolicyManual41B.view.CreateNewExpensePolicy", this);
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
		_onSubmit: function () {
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
			sPath = this._oControl.getBindingContext("ExpenseManual").getPath();
			sPath = sPath.replace('/', '');
			if (self.oModel.getPendingChanges()[sPath]) {
				self.oModel.resetChanges([this._oControl.getBindingContext("ExpenseManual").getPath()], undefined, /*bDeleteCreatedEntities*/
					true);
			}

			// self._getRequiredFields().forEach(function (RequiredInfo) {

			// 	self.getView().byId(RequiredInfo.id).setValueState(sap.ui.core.ValueState.None);

			// });
			this.close();

		},
		handleUploadPress: function (oEvent) {
			var that = this;

			var oModel = this._oControl.getModel("ExpenseManual");
			var file = oEvent.getParameter("files")[0];
			var sBindingPath = oEvent.getSource().getBindingContext("ExpenseManual").getPath(); // oEvent.get
			var sPath = oEvent.getSource().oFilePath.oParent.sId.split('--')[2];
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
			var sLink = '';
			var filename = oEvent.getSource().getText();
			RepoService.getRepoId().then(function (ReposId) {
				sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + filename;
				window.open(sLink);
			});
		},

		onInit: function () {

			this._oDialog = this.getControl();
			this.oModel = this.getOwnerComponent().getModel("ExpenseManual");

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
				"id": "attachmentuploader",
				"type": "input"
			}, {
				"id": "PaymentTypeCombo",
				"type": "select"
			}, {
				"id": "DeterminerCombo",
				"type": "select"
			}, {
				"id": "SignerCombo",
				"type": "select"
			}, {
				"id": "SecondSignerCombo"
			}, {
				"id": "ExecuterCombo",
				"type": "select"
			}];
		},
		handleChangeValuestate: function (requiredFieldInfo, oView) {
			var status = true;
			if (requiredFieldInfo) {
				requiredFieldInfo.forEach(function (requiredinfo) {
					var input = oView.byId(requiredinfo.id);
					if (input) {
						input.setValueState("None"); //initially set ValueState to None
						if (requiredinfo.type !== "select") {
							if (input.getValue() === '') {
								input.setValueState("Error"); //input is blank set ValueState to error
								status = false;
							} else if (input.getDateValue && !input._bValid) { //since 1.64 ui5 will be providing a function 'isValidValue' that can be used here.
								input.setValueState("Error"); //Invalid Date set ValueState to error
								status = false;
							}
						} else {
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
		onValueHelpRequest: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue(),
				oView = this.getView(),
				FirstSignerKey = oView.byId("SignerCombo").getSelectedKey(),
				FirstSignerName = oView.byId("SignerCombo").getValue();

			this.id = oEvent.getParameter("id");

			if (!this._pValueHelpDialog) {
				this._pValueHelpDialog = Fragment.load({
					id: oView.getId(),
					name: "pwc.portal.eval.ClubEvaluations.view.Applications.ExpensePolicyManual41B.view.ValueHelpDialog",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);

					return oDialog;
				});
			}
			this._pValueHelpDialog.then(function (oDialog) {

				oView.byId("selectDialog").bindAggregation("items", "ExpenseManual>/CLUB_ORG_STRUC_EMP", new sap.m.StandardListItem({
					description: "{ExpenseManual>id}",
					title: "{ExpenseManual>emp_name}",
					info: "{ExpenseManual>emp_job_title}"

				}));
				oDialog.getBinding("items").filter(new Filter("emp_name", FilterOperator.Contains, sInputValue));
				oDialog.open(sInputValue);
			});
		},
		onValueHelpRequestSecondSigner: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue(),
				oView = this.getView(),
				FirstSignerKey = oView.byId("SignerCombo").getSelectedKey(),
				FirstSignerName = oView.byId("SignerCombo").getValue();
			this.id = oEvent.getParameter("id");

			if (!this._pValueHelpDialog) {
				this._pValueHelpDialog = Fragment.load({
					id: oView.getId(),
					name: "pwc.portal.eval.ClubEvaluations.view.Applications.ExpensePolicyManual41B.view.ValueHelpDialog",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);

					return oDialog;
				});
			}
			this._pValueHelpDialog.then(function (oDialog) {

				oView.byId("selectDialog").bindAggregation("items", "ExpenseManual>/CLUB_ORG_STRUC_EMP", new sap.m.StandardListItem({
					description: "{ExpenseManual>id}",
					title: "{ExpenseManual>emp_name}",
					info: "{ExpenseManual>emp_job_title}"

				}));
				if (FirstSignerKey === "") {
					var oFilter = new Filter({

						filters: [

							new sap.ui.model.Filter("emp_name", FilterOperator.NotContains, FirstSignerName),
							new sap.ui.model.Filter("emp_name", FilterOperator.Contains, sInputValue)

						],
						and: true

					});

				} else {
					oFilter = new Filter({

						filters: [

							new sap.ui.model.Filter("id", FilterOperator.NE, FirstSignerKey),
							new sap.ui.model.Filter("emp_name", FilterOperator.Contains, sInputValue)

						],
						and: true

					});

				}
				oDialog.getBinding("items").filter(oFilter);

				oDialog.open(sInputValue);
			});
		},

		onValueHelpDialogSearch: function (oEvent) {

			var sValue = oEvent.getParameter("value");

			oEvent.getSource().getBinding("items").filter([new Filter("emp_name", FilterOperator.Contains, sValue)]);

		},
		onValueHelpDialogSearchSecondSigner: function (oEvent) {
			var FirstSignerKey = this.getView().byId("SignerCombo").getSelectedKey(),
				FirstSignerName = this.getView().byId("SignerCombo").getValue();

			var sValue = oEvent.getParameter("value");
			if (FirstSignerKey == "") {
				var oFilter = new Filter({

					filters: [

						new sap.ui.model.Filter("emp_name", FilterOperator.NotContains, FirstSignerName),
						new sap.ui.model.Filter("emp_name", FilterOperator.Contains, sValue)

					],
					and: true

				});

			} else {
				oFilter = new Filter({

					filters: [

						new sap.ui.model.Filter("id", FilterOperator.NE, FirstSignerKey),
						new sap.ui.model.Filter("emp_name", FilterOperator.Contains, sValue)

					],
					and: true

				});

			}
			oEvent.getSource().getBinding("items").getBinding("items").filter(oFilter);

		},
		onFirstSignerChange: function (oEvent) {
			var FirstSignerKey = this.getView().byId("SignerCombo").getSelectedKey(),
				SecondSignerKey = this.getView().byId("SecondSignerCombo").getSelectedKey();
			if (FirstSignerKey === SecondSignerKey) {
				this.getView().byId("SecondSignerCombo").setValue("");
			}
		},
		onSecondSignerChange: function (oEvent) {
			var FirstSignerKey = this.getView().byId("SignerCombo").getSelectedKey(),
				SecondSignerKey = this.getView().byId("SecondSignerCombo").getSelectedKey();
			if (FirstSignerKey === SecondSignerKey) {
				this.getView().byId("SecondSignerCombo").setValue("");
			}
		},
		onValueHelpDialogClose: function (oEvent) {
			var sDescription,
				inputId = this.id.split("--").slice(-1),
				oSelectedItem = oEvent.getParameter("selectedItem");
			oEvent.getSource().getBinding("items").filter([]);
			if (!oSelectedItem) {
				return;
			}

			sDescription = oSelectedItem.getDescription();

			this.getView().byId(inputId).setSelectedKey(sDescription);

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
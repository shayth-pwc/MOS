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

	return ManagedObject.extend("pwc.portal.eval.ClubEvaluations.view.Applications.44c.controller.Create44c", {
		club_dms_id: '',
		constructor: function (oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "pwc.portal.eval.ClubEvaluations.view.Applications.44c.view.Create44c", this);
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
		_onDialogAfterClose44c: function () {

			this.close();

		},
		_onSubmit44c: function () {
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
												sap.m.MessageToast.show(oResourceBundle.getText("changeitemmsg"), {
													onClose: fnResolve,
													duration: 0 || 3000
												});
											} else if (oChangeResponse && oChangeResponse.response) {
												fnResetChangesAndReject(oChangeResponse.message);
											} else if (!oChangeResponse && oBatchResponse.response) {
												fnResetChangesAndReject(oBatchResponse.message);
											} else {
												oModel.refresh();
												sap.m.MessageToast.show(oResourceBundle.getText("changeitemmsg"), {
													onClose: fnResolve,
													duration: 0 || 3000
												});

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

		_onCancel44c: function () {
			var self = this;
			var sPath;
			sPath = this._oControl.getBindingContext("payment").getPath();
			sPath = sPath.replace('/', '');
			if (this._oControl.getModel("payment").getPendingChanges()[sPath]) {
				this._oControl.getModel("payment").resetChanges([this._oControl.getBindingContext("payment").getPath()], undefined, /*bDeleteCreatedEntities*/
					true);
			}
			var requiredFieldInfo = this.getView().getControlsByFieldGroupId("uploader");
			requiredFieldInfo.forEach(function (RequiredInfo) {

				RequiredInfo.setValueState(sap.ui.core.ValueState.None);

			});
			this.close();

		},
		handleChangeValuestate: function (requiredFieldInfo, oView) {
			var status = true;
			if (requiredFieldInfo) {
				requiredFieldInfo.forEach(function (requiredinfo) {
					var input = oView.byId(requiredinfo.id);
					if (requiredinfo.type === 'text') {
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
					}
				});
			}
			return status;

		},

		onInit: function () {

			this._oDialog = this.getControl();
			this.oModel = this.getOwnerComponent().getModel("payment");

			var that = this;
			this.getOwnerComponent().getModel("User").read("/UserClub", {
				success: function (oData) {
					that.club_dms_id = oData.results[0].club_dms_id;
				},
				error: function (oError) {}
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
		onExit: function () {
			this._oDialog.destroy();

		},
		_getRequiredFields: function () {

			return [{
				"id": "salary",
				"type": "text",
				"required": "true"
			}, {
				"id": "revenue_leftover",
				"type": "text",
				"required": "true"
			}, {
				"id": "emp_category",
				"type": "text",
				"required": "true"
			}, {
				"id": "LastPaymentMonth",
				"type": "text",
				"required": "true"
			}, {
				"id": "Audituploader",
				"type": "text",
				"required": "true"
			}];
		},

		onValueHelpRequest: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue(),
				oView = this.getView();

			if (!this._pValueHelpDialog) {
				this._pValueHelpDialog = Fragment.load({
					id: oView.getId(),
					name: "pwc.portal.eval.ClubEvaluations.view.Applications.44c.view.ValueHelpDialog3",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);

					return oDialog;
				});
			}
			this._pValueHelpDialog.then(function (oDialog) {

				oView.byId("selectDialog3").bindAggregation("items", "payment>/CLUB_ORG_STRUC_EMP", new sap.m.StandardListItem({
					description: "{payment>id}",
					title: "{payment>emp_name}",
					info: "{payment>emp_job_title}"

				}));
				oDialog.getBinding("items").filter([new Filter("emp_name", FilterOperator.Contains, sInputValue)]);

				// Create a filter for the binding
				// Open ValueHelpDialog filtered by the input's value
				oDialog.open(sInputValue);
			});
		},
		onValueHelpDialogClose: function (oEvent) {
			var sDescription,
				oSelectedItem = oEvent.getParameter("selectedItem");
			oEvent.getSource().getBinding("items").filter([]);

			if (!oSelectedItem) {
				return;
			}

			sDescription = oSelectedItem.getDescription();
			this.getView().byId("employee_name").setSelectedKey(sDescription);

		},
		handleUploadPress1: function (oEvent) {
			var that = this;

			var oModel = this._oControl.getModel("payment");

			var file = oEvent.getParameter("files")[0];
			var sBindingPath = oEvent.getSource().getBindingContext("payment").getPath(); // oEvent.get
			var sPath = "bank_statement_cmis_id";
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

		handleUploadPress: function (oEvent) {
			var that = this;

			var oModel = this._oControl.getModel("payment");

			var file = oEvent.getParameter("files")[0];
			var sBindingPath = oEvent.getSource().getBindingContext("payment").getPath(); // oEvent.get
			var sPath = "proof_cmis_id_models";
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
	});
}, /* bExport= */ true);
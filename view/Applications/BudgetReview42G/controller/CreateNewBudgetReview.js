sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService",
	"sap/ui/model/json/JSONModel"
], function (ManagedObject, MessageBox, Utilities, History, RepoService, JSONModel) {

	return ManagedObject.extend("pwc.portal.eval.ClubEvaluations.view.Applications.BudgetReview42G.controller.CreateNewBudgetReview", {
		club_dms_id: '',
		constructor: function (oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "pwc.portal.eval.ClubEvaluations.view.Applications.BudgetReview42G.view.CreateNewBudgetReview", this);
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

		_onCancel: function () {
			var self = this;
			var sPath;
			sPath = this._oControl.getBindingContext("EstimatedBudget").getPath();
			sPath = sPath.replace('/', '');
			if (this._oControl.getModel("EstimatedBudget").getPendingChanges()[sPath]) {
				this._oControl.getModel("EstimatedBudget").resetChanges([this._oControl.getBindingContext("EstimatedBudget").getPath()], undefined, /*bDeleteCreatedEntities*/
					true);
			}
			
			var	requiredFieldInfo = this._getRequiredFields();
					requiredFieldInfo.forEach(function (requiredinfo) {
					var input = self.getView().byId(requiredinfo.id);

				input.setValueState(sap.ui.core.ValueState.None);

			});			this.close();

		},
	handleUploadPress: function (oEvent) {
			var that = this;
			//debugger;;
			var oModel = this._oControl.getModel("EstimatedBudget");

			var file = oEvent.getParameter("files")[0];
			var sBindingPath = oEvent.getSource().getBindingContext("EstimatedBudget").getPath(); // oEvent.get
			var sPath = oEvent.getSource().getParent().getFields()[0].mBindingInfos.value.binding.sPath;
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

		// openlink: function (oEvent) {
		// 	var sLink = '';
		// 	var filename = oEvent.getSource().getText();
		// 	RepoService.getRepoId().then(function (ReposId) {
		// 		sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + filename;
		// 		window.open(sLink);
		// 	});
		// },

		onInit: function () {
				var that = this;
				this.getOwnerComponent().getModel("User").read("/UserClub", {
				success: function (oData) {
						that.club_dms_id = oData.results[0].club_dms_id;
				},
				error: function (oError) {}
			});

			this._oDialog = this.getControl();
			this.oModel = this.getOwnerComponent().getModel("EstimatedBudget");

		},
		onExit: function () {
			this._oDialog.destroy();

		},
		_getRequiredFields: function () {

			return [{
				"id": "createsystemdevuploader"
			}, {
				"id": "createStakeholderuploader"
			}, {
				"id": "createreviewuploader"
			}];
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
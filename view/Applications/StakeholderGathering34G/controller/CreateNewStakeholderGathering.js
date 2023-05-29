sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService",
	"sap/ui/model/json/JSONModel"
], function (ManagedObject, MessageBox, Utilities, History, RepoService, JSONModel) {

	return ManagedObject.extend(
		"pwc.portal.eval.ClubEvaluations.view.Applications.StakeholderGathering34G.controller.CreateNewStakeholderGathering", {
			club_dms_id: '',
			constructor: function (oView) {
				this._oView = oView;
				this._oControl = sap.ui.xmlfragment(oView.getId(),
					"pwc.portal.eval.ClubEvaluations.view.Applications.StakeholderGathering34G.view.CreateNewStakeholderGathering", this);
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
						"id": "fans_impressions_proof_cmis_id",
						"type": "text",
						"required": true
					}, {
						"id": "staff_impressions_proof_cmis_id",
						"type": "text",
						"required": true
					}, {
						"id": "general_impressions_proof_cmis_id",
						"type": "text",
						"required": true
					}, {
						"id": "players_impressions_proof_cmis_id",
						"type": "text",
						"required": true
					}, {
						"id": "coaches_impressions_proof_cmis_id",
						"type": "text",
						"required": true
					}, {
						"id": "visitors_impressions_proof_cmis_id",
						"type": "text",
						"required": true
					}, {
						"id": "fans_impressions_proof_cmis_id2",
						"type": "text",
						"required": true
					}, {
						"id": "staff_impressions_proof_cmis_id2",
						"type": "text",
						"required": true
					}, {
						"id": "general_impressions_proof_cmis_id2",
						"type": "text",
						"required": true
					}, {
						"id": "players_impressions_proof_cmis_id2",
						"type": "text",
						"required": true
					}, {
						"id": "coaches_impressions_proof_cmis_id2",
						"type": "text",
						"required": true
					}, {
						"id": "visitors_impressions_proof_cmis_id2",
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

			_onCancel: function (oEvent) {
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

				var that = this,
					oModel = that.getView().getModel("stakeholdergathering"),
					sDialogID = oEvent.getSource().getParent().getId().split("-");
				sDialogID = sDialogID[sDialogID.length - 1];
				if (oModel.hasPendingChanges()) {
					MessageBox.confirm(oResourceBundle.getText('ConfirmCancel'), {
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.OK) {
								that.getView().getModel("stakeholdergathering").resetChanges();
								that.getView().getModel("stakeholdergathering").refresh();
								// that._aDialogs[sDialogID].close();
								that.close();
								that.getView().getModel("stakeholdergathering").refresh();
							}
						}
					});
				} else {
					this.getView().getModel("stakeholdergathering").resetChanges();

					//this.byId("createDialog").close();

					// that._aDialogs[sDialogID].close();

					that.close();

				}
			},

			handleUploadPress: function (oEvent) {
				var that = this;

				var oModel = this._oControl.getModel("stakeholdergathering");

				var file = oEvent.getParameter("files")[0];
				var sBindingPath = oEvent.getSource().getBindingContext("stakeholdergathering").getPath(); // oEvent.get
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
				this.oModel = this.getOwnerComponent().getModel("stakeholdergathering");
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
						"id": "systemdevuploader"
					}, {
						"id": "Stakeholderuploader"
					}, {
						"id": "reviewuploader"
					}, {
						"id": "Audituploader"
					}, {
						"id": "Conductuploader"
					}, {
						"id": "Awarnesuploader"
					}, {
						"id": "Secondsystemdevuploader"
					}, {
						"id": "SecondStakeholderuploader"
					}, {
						"id": "Secondreviewuploader"
					}, {
						"id": "SecondAudituploader"
					}, {
						"id": "SecondConductuploader"
					}, {
						"id": "SecondAwarnesuploader"
					}

				];
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
		});
}, /* bExport= */ true);
sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"pwc/portal/eval/ClubEvaluations/service/RepoService"

], function (ManagedObject, MessageBox, Utilities, History, JSONModel, RepoService) {

	return ManagedObject.extend(
		"pwc.portal.eval.ClubEvaluations.view.Applications.PerformanceIndicatores13G.controller.CreateNewPerformanceIndicator", {
			club_dms_id: '',

			constructor: function (oView) {

				this._oView = oView;
				this._oControl = sap.ui.xmlfragment(oView.getId(),
					"pwc.portal.eval.ClubEvaluations.view.Applications.PerformanceIndicatores13G.view.CreateNewPerformanceIndicator", this);
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
				// if(this._Event.includes("item")){
				// 	this.setEnabled(false);
				// }else{
				// 		this.setEnabled(true);
				// }

				var args = Array.prototype.slice.call(arguments);
				if (oControl.open) {
					oControl.open.apply(oControl, args);
				} else if (oControl.openBy) {
					oControl.openBy.apply(oControl, args);
				}
			},
			setEnabled: function (bEnabled) {
				var oModel = this.getView().getModel("appView");
				oModel.setProperty("/enabled", bEnabled);
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
			handleRadioButtonGroupsSelectedIndex: function () {
				var that = this;
				this.aRadioButtonGroupIds.forEach(function (sRadioButtonGroupId) {
					var oRadioButtonGroup = that.byId(sRadioButtonGroupId);
					var oButtonsBinding = oRadioButtonGroup ? oRadioButtonGroup.getBinding("buttons") : undefined;
					if (oButtonsBinding) {
						var oSelectedIndexBinding = oRadioButtonGroup.getBinding("selectedIndex");
						var iSelectedIndex = oRadioButtonGroup.getSelectedIndex();
						oButtonsBinding.attachEventOnce("change", function () {
							if (oSelectedIndexBinding) {
								oSelectedIndexBinding.refresh(true);
							} else {
								oRadioButtonGroup.setSelectedIndex(iSelectedIndex);
							}
						});
					}
				});

			},
			convertTextToIndexFormatter: function (sTextValue) {
				var oRadioButtonGroup = this.byId("KPITypeRadio");
				var oButtonsBindingInfo = oRadioButtonGroup.getBindingInfo("buttons");
				if (oButtonsBindingInfo && oButtonsBindingInfo.binding) {
					// look up index in bound context
					var sTextBindingPath = oButtonsBindingInfo.template.getBindingPath("text");
					return oButtonsBindingInfo.binding.getContexts(oButtonsBindingInfo.startIndex, oButtonsBindingInfo.length).findIndex(function (
						oButtonContext) {
						return oButtonContext.getProperty(sTextBindingPath) === sTextValue;
					});
				} else {
					// look up index in static items
					return oRadioButtonGroup.getButtons().findIndex(function (oButton) {
						return oButton.getText() === sTextValue;
					});
				}

			},
			_onRadioButtonGroupSelect: function () {

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
													fnResolve();
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
				sPath = this._oControl.getBindingContext("performanceindicator").getPath();
				sPath = sPath.replace('/', '');
				if (this.oModel.getPendingChanges()[sPath]) {
					this.oModel.resetChanges([this._oControl.getBindingContext("performanceindicator").getPath()], undefined, /*bDeleteCreatedEntities*/
						true);
				}
				var requiredFieldInfo = this._getRequiredFields();
				requiredFieldInfo.forEach(function (RequiredInfo) {
					var input = self.getView().byId(RequiredInfo.id);
					input.setValueState(sap.ui.core.ValueState.None);

				});

				this.close();

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

				this.oModel = this.getOwnerComponent().getModel("performanceindicator");

			},
			onExit: function () {
				this._oDialog.destroy();

			},
			handleUploadPress: function (oEvent) {
				var that = this;

				var oModel = this._oControl.getModel("performanceindicator");

				var file = oEvent.getParameter("files")[0];
				var sBindingPath = oEvent.getSource().getBindingContext("performanceindicator").getPath(); // oEvent.get
				var sPath = 'proof_cmis_id_kpi';
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
			_getRequiredFields: function () {

				return [{
					"id": "KPITypeCombo",
					"type": "select"
				}, {
					"id": "KPITitleInput",
					"type": "input"
				}, {
					"id": "KPIDescriptionInput",
					"type": "input"

				}, {
					"id": "MethodOfMeasureInput",
					"type": "input"
				}, {
					"id": "relatedinitiativeCombo",
					"type": "select"
				}, {
					"id": "KPIFrequencyOfMeasureCombo",
					"type": "select"
				}, {
					"id": "KPIOwnerCombo",
					"type": "select"
				}, {
					"id": "KPITargetInput",
					"type": "input"
				}, {
					"id": "RelationToStrategicGoalInput",
					"type": "input"
				}, {
					"id": "KPIActualAchievmentInput",
					"type": "input"

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

							// 
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
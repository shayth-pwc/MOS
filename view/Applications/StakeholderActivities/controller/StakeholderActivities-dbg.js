sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function(ManagedObject, MessageBox, Utilities, History) {

	return ManagedObject.extend("pwc.portal.eval.ClubEvaluations.view.Applications.StakeholderActivities.controller.StakeholderActivities", {
		constructor: function(oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "pwc.portal.eval.ClubEvaluations.view.Applications.StakeholderActivities.view.StakeholderActivities", this);
			this._bInit = false;
		},

		exit: function() {
			delete this._oView;
		},

		getView: function() {
			return this._oView;
		},

		getControl: function() {
			return this._oControl;
		},

		getOwnerComponent: function() {
			return this._oView.getController().getOwnerComponent();
		},

		open: function() {
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

		close: function() {
			this._oControl.close();
		},

		setRouter: function(oRouter) {
			this.oRouter = oRouter;

		},
		getBindingParameters: function() {
			return {};

		},
		_onButtonPress: function (e) {
			var oView = this.getView(),
				that = this,
				oEntry2 = {},
				oController = this,
				status = true,
				requiredFieldInfo = [{
					"id": "activity_description",
					"type": "text",
					"required" :true
				}, {
					"id": "activity_name",
					"type": "text",
					"required" :true
				}, {
					"id": "communication_type",
					"type": "text",
					"required" :true
				}, {
					"id": "future_developments",
					"type": "text",
					"required" :true
				},{
					"id": "frequency_of_communication",
					"type": "select",
					"required" :true
				},{
					"id": "activity_start_date",
					"type": "text",
					"required" :true
				},{
					"id": "activity_end_date",
					"type": "text",
					"required" :true
				}/*,{
				"id": "stakeholder_name",
					"type": "select",
					"required" :true
				}*/
				];
	
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
		handleChangeValuestate: function(requiredFieldInfo, oView) {
			var status = true;
			if (requiredFieldInfo) {
				requiredFieldInfo.forEach(function(requiredinfo) {
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
		_onButtonPress1: function (oEvent) {
		var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			var that = this,
				oModel = that.getView().getModel("StakeholderActivities"),
				sDialogID = oEvent.getSource().getParent().getId().split("-");
			sDialogID = sDialogID[sDialogID.length - 1];
			if (oModel.hasPendingChanges()) {
				MessageBox.confirm(oResourceBundle.getText('ConfirmCancel'), {
					onClose: function (oAction) {
						if (oAction === sap.m.MessageBox.Action.OK) {
							that.getView().getModel("StakeholderActivities").resetChanges();
							that.getView().getModel("StakeholderActivities").refresh();
							// that._aDialogs[sDialogID].close();
							that.close();
							that.getView().getModel("StakeholderActivities").refresh();
						}
					}
				});
			} else {
				this.getView().getModel("StakeholderActivities").resetChanges();
				

				//this.byId("createDialog").close();
				
				// that._aDialogs[sDialogID].close();

					

							that.close();

			}
		},
		onInit: function () {
			this._oDialog = this.getControl();
			this.oModel = this.getOwnerComponent().getModel("StakeholderActivities")
		},
		onExit: function() {
			this._oDialog.destroy();

		},
		handleUploadPress: function (oEvent) {

			var oModel = this._oControl.getModel("StakeholderActivities");

			var file = oEvent.getParameter("files")[0];
			var sBindingPath = oEvent.getSource().getBindingContext("StakeholderActivities").getPath(); // oEvent.get
			var sPath='proof_cmis_id';
			if (file !== '') {
				if (file !== "") {
					RepoService.uploadFile(file).then(function (param1, param2) {
						var filename = param1.properties['cmis:name'].value;
						oModel.setProperty(sBindingPath + "/" + sPath, filename);
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
		}

	});
}, /* bExport= */ true);

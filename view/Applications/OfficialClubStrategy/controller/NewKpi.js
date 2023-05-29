sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(ManagedObject, MessageBox,  History,JSONModel,Fragment,Filter,FilterOperator) {

	return ManagedObject.extend("pwc.portal.eval.ClubEvaluations.view.Applications.OfficialClubStrategy.controller.NewKpi", {
		constructor: function(oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "pwc.portal.eval.ClubEvaluations.view.Applications.OfficialClubStrategy.view.NewKpi", this);
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
			if(this._Event.includes("item")){
				this.setEnabled(false);
			}else{
					this.setEnabled(true);
			}


			var args = Array.prototype.slice.call(arguments);
			if (oControl.open) {
				oControl.open.apply(oControl, args);
			} else if (oControl.openBy) {
				oControl.openBy.apply(oControl, args);
			}
		},
		setEnabled : function (bEnabled) {
			var oModel = this.getView().getModel("appView");
			oModel.setProperty("/enabled", bEnabled);
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
		handleRadioButtonGroupsSelectedIndex: function() {
			var that = this;
			this.aRadioButtonGroupIds.forEach(function(sRadioButtonGroupId) {
				var oRadioButtonGroup = that.byId(sRadioButtonGroupId);
				var oButtonsBinding = oRadioButtonGroup ? oRadioButtonGroup.getBinding("buttons") : undefined;
				if (oButtonsBinding) {
					var oSelectedIndexBinding = oRadioButtonGroup.getBinding("selectedIndex");
					var iSelectedIndex = oRadioButtonGroup.getSelectedIndex();
					oButtonsBinding.attachEventOnce("change", function() {
						if (oSelectedIndexBinding) {
							oSelectedIndexBinding.refresh(true);
						} else {
							oRadioButtonGroup.setSelectedIndex(iSelectedIndex);
						}
					});
				}
			});

		},
		convertTextToIndexFormatter: function(sTextValue) {
			var oRadioButtonGroup = this.byId("KPITypeRadio");
			var oButtonsBindingInfo = oRadioButtonGroup.getBindingInfo("buttons");
			if (oButtonsBindingInfo && oButtonsBindingInfo.binding) {
				// look up index in bound context
				var sTextBindingPath = oButtonsBindingInfo.template.getBindingPath("text");
				return oButtonsBindingInfo.binding.getContexts(oButtonsBindingInfo.startIndex, oButtonsBindingInfo.length).findIndex(function(oButtonContext) {
					return oButtonContext.getProperty(sTextBindingPath) === sTextValue;
				});
			} else {
				// look up index in static items
				return oRadioButtonGroup.getButtons().findIndex(function(oButton) {
					return oButton.getText() === sTextValue;
				});
			}

		},
		_onRadioButtonGroupSelect: function() {

		},
		_onSubmit: function() {
			var oView = this.getView(),
				oController = this,
				status = true,
				requiredFieldInfo =	oController._getRequiredFields();
			if (requiredFieldInfo.length) {
				status = this.handleChangeValuestate(requiredFieldInfo, oView);
			}
			if (status) {
			var self = this;
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
				return new Promise(function(fnResolve, fnReject) {
					var oModel = oController.oModel;
					var fnResetChangesAndReject = function(sMessage) {
						oModel.resetChanges();
						fnReject(new Error(sMessage));
					};
					if (oModel && oModel.hasPendingChanges()) {
						sap.m.MessageBox.confirm(oResourceBundle.getText('confirmationmsg'), {
						title: oResourceBundle.getText('confirmation'),
						actions: [oResourceBundle.getText('confirm'), oResourceBundle.getText('cancel')],
						onClose: function (sActionClicked){
					if (sActionClicked === oResourceBundle.getText('confirm')) {
						oModel.submitChanges({
							success: function(oResponse) {
								var oBatchResponse = oResponse.__batchResponses[0];
								var oChangeResponse = oBatchResponse.__changeResponses && oBatchResponse.__changeResponses[0];
								if (oChangeResponse && oChangeResponse.data) {
									var sNewContext = oModel.getKey(oChangeResponse.data);
									oView.unbindObject();
									oView.bindObject({
										path: "/" + sNewContext
									});
									if (window.history && window.history.replaceState) {
										window.history.replaceState(undefined, undefined, window.location.hash.replace(encodeURIComponent(oController.sContext), encodeURIComponent(sNewContext)));
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
							error: function(oError) {
								fnReject(new Error(oError.message));
							}
						});
						self._oDialog.close();
					}}
					});
						
					}else {
						fnResolve();
					}
				}).catch(function(err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
			}
		},
			handleChangeValuestate: function(requiredFieldInfo, oView) {
			var status = true;
			if (requiredFieldInfo) {
				requiredFieldInfo.forEach(function(requiredinfo) {
					var input = oView.byId(requiredinfo.id);
					if (requiredinfo.type==='text' ) {
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
			_onCancel: function (oEvent) {
			var oResourceBundle = this.getView().getModel("OfficialClubStrategyi18n").getResourceBundle();

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
		onInit: function() {
			var oViewModel = new JSONModel({
						enabled: true
				});
			this.getView().setModel(oViewModel, "appView");

			this._oDialog = this.getControl();

			this.oModel = this.getOwnerComponent().getModel("OfficialClub");

		},
		onExit: function() {
			this._oDialog.destroy();

		},
		_getRequiredFields:function(){
			
			return	[{
					"id": "KPITypeCombo"
				}, {
					"id": "KPITitleInput"
				}, {
					"id": "KPIDescriptionInput"
				}, {
					"id": "MethodOfMeasureInput"
				},{
					"id":"KPIFrequencyOfMeasureCombo"
					
				},{
					"id":"KPIOwnerCombo"
				},{
					"id":"KPITargetInput"
				},{
					"id":"RelationToStrategicGoalInput"
				}];
		},
		onValueHelpRequest: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue(),
				oView = this.getView();

			if (!this._pValueHelpDialog) {
				this._pValueHelpDialog = Fragment.load({
					id: oView.getId(),
					name: "pwc.portal.eval.ClubEvaluations.view.Applications.OfficialClubStrategy.view.ValueHelpDialog2",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);

					return oDialog;
				});
			}
			this._pValueHelpDialog.then(function (oDialog) {

				oView.byId("selectDialog2").bindAggregation("items", "OfficialClub>/CLUB_ORG_STRUC_DEP", new sap.m.StandardListItem({
					description:"{OfficialClub>id}",
						title: "{OfficialClub>club_dept_name}"

				}));
				oDialog.getBinding("items").filter([new Filter("club_dept_name", FilterOperator.Contains, sInputValue)]);

				// Create a filter for the binding
				// Open ValueHelpDialog filtered by the input's value
				oDialog.open(sInputValue);
			});
		},
		onValueHelpDialogSearch: function (oEvent) {

			var sValue = oEvent.getParameter("value");

			oEvent.getSource().getBinding("items").filter([new Filter("club_dept_name", FilterOperator.Contains, sValue)]);

		},
		onValueHelpDialogClose: function (oEvent) {
			var sDescription,
				oSelectedItem = oEvent.getParameter("selectedItem");
			oEvent.getSource().getBinding("items").filter([]);

			if (!oSelectedItem) {
				return;
			}

			sDescription = oSelectedItem.getDescription();

			this.getView().byId("KPIOwnerCombo").setSelectedKey(sDescription);

		}

	});
}, /* bExport= */ true);

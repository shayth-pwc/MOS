sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function(ManagedObject, MessageBox, Utilities, History) {

	return ManagedObject.extend("pwc.portal.eval.ClubEvaluations.view.Applications.StakeholderActivities.controller.StakeholderIdentification", {
		constructor: function(oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "pwc.portal.eval.ClubEvaluations.view.Applications.StakeholderActivities.view.StakeholderIdentification", this);
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
		_onButtonPress: function () {
			var oView = this.getView(),
				that = this,
				oEntry = {},
				oController = this,
				status = true,
				requiredFieldInfo = [{
					"id": "stakeholder_type",
					"type": "select",
					"required" :true
				}, {
					"id": "stakeholder_name",
					"type": "text",
					"required" :true
				}, {
					"id": "level_of_impact",
					"type": "text",
					"required" :true
				}, {
					"id": "impact_description",
					"type": "select",
					"required" :true
				}/*,
				{
					"id": "STAKEHOLDER_TYPE_NAME",
					"type": "text",
					"required" :true
				}*/
				];
	
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
		/*onDialogadd:function(){
				var oModel=this.getView().getModel("StakeholderActivities");
				var mNewEntry={};

				mNewEntry.entity_name=sap.ui.getCore().byId("entity_name").getValue();
				mNewEntry.level_of_impact=sap.ui.getCore().byId("level_of_impact").getValue();
				mNewEntry.impact_description=sap.ui.getCore().byId("impact_description").getValue();

				oModel.create("/STAKEHOLDERS",mNewEntry,null,function(oData){
						MessageBox.show(
						"Record Created Successfully.",{
						icon:sap.m.MessageBox.Icon.SUCCESS,
						title:"Dear User",
						styleClass:"sapUiSizeCompact"
	}
);
		},
		function(err){

				MessageBox.show(
				"Please Check Record Again.",{
				icon:sap.m.MessageBox.Icon.ERROR	,
				title:"Dear User",
				styleClass:"sapUiSizeCompact"
	}
);
});
	oModel.refresh();
	this.getDialog().close();
		},*/

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
		_onButtonPress1: function(oEvent) {

			oEvent = jQuery.extend(true, {}, oEvent);
			return new Promise(function(fnResolve) {
					fnResolve(true);
				})
				.then(function(result) {
					return new Promise(function(fnResolve) {
						var aChangedEntitiesPath, oChangedBindingContext;
						var oModel = this.oModel;
						if (oModel && oModel.hasPendingChanges()) {
							aChangedEntitiesPath = Object.keys(oModel.mChangedEntities);

							for (var j = 0; j < aChangedEntitiesPath.length; j++) {
								oChangedBindingContext = oModel.getContext("/" + aChangedEntitiesPath[j]);
								if (oChangedBindingContext && oChangedBindingContext.bCreated) {
									oModel.deleteCreatedEntry(oChangedBindingContext);
								}
							}
							oModel.resetChanges();
						}
						fnResolve();
					}.bind(this));

				}.bind(this))
				.then(function(result) {
					if (result === false) {
						return false;
					} else {

						this.close();

					}
				}.bind(this)).catch(function(err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
		},
		onInit: function() {

			this._oDialog = this.getControl();

			this.oModel = this.getOwnerComponent().getModel("StakeholderActivities");

		},
		onExit: function() {
			this._oDialog.destroy();

		}

	});
}, /* bExport= */ true);

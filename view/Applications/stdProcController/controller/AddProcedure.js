sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"

], function(ManagedObject, MessageBox, Utilities, History,RepoService,Fragment, Filter, FilterOperator) {

	return ManagedObject.extend("pwc.portal.eval.ClubEvaluations.view.Applications.stdProcController.controller.AddProcedure", {
		constructor: function(oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "pwc.portal.eval.ClubEvaluations.view.Applications.stdProcController.view.AddProcedure", this);
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

		close: function() {
			this._oControl.close();
		},

		setRouter: function(oRouter) {
			this.oRouter = oRouter;

		},
		getBindingParameters: function() {
			return {};

		},
		_onFileUploaderUploadComplete: function() {
			// Please implement

		},
		_onFileUploaderChange: function() {
			// Please implement

		},
		_onFileUploaderTypeMissmatch: function() {
			// Please implement

		},
		_onFileUploaderFileSizeExceed: function() {
			// Please implement

		},
		_onButtonPress: function(oEvent) {
var oView = this.getView(),
				that = this,
				oEntry = {},
				oController = this,
				status = true,
				requiredFieldInfo = [{
					"id": "procedure_name",
					"type": "select",
					"required" :true
				}, {
					"id": "procedure_description",
					"type": "text",
					"required" :true
				},
				
				{
					"id": "start_date_time1",
					"type": "text",
					"required" :true
				}
			
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






















			/*oEvent = jQuery.extend(true, {}, oEvent);
			return new Promise(function(fnResolve) {
					fnResolve(true);
				})
				.then(function(result) {

					this.close();

				}.bind(this))
				.then(function(result) {
					if (result === false) {
						return false;
					} else {
						var oView = this.getView(),
							oController = this,
							status = true,
							requiredFieldInfo = [];
						if (requiredFieldInfo.length) {
							status = this.handleChangeValuestate(requiredFieldInfo, oView);
						}
						if (status) {
							return new Promise(function(fnResolve, fnReject) {
								var oModel = oController.oModel;

								var fnResetChangesAndReject = function(sMessage) {
									oModel.resetChanges();
									fnReject(new Error(sMessage));
								};
								if (oModel && oModel.hasPendingChanges()) {
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
								} else {
									fnResolve();
								}
							});
						}
					}
				}.bind(this)).catch(function(err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});*/
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
		_onButtonPress1: function(oEvent) {

			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			var that = this,
				oModel = that.getView().getModel("standardProcedure"),
				sDialogID = oEvent.getSource().getParent().getId().split("-");
			sDialogID = sDialogID[sDialogID.length - 1];
			if (oModel.hasPendingChanges()) {
				MessageBox.confirm(oResourceBundle.getText('ConfirmCancel'), {
					onClose: function (oAction) {
						if (oAction === sap.m.MessageBox.Action.OK) {
							that.getView().getModel("standardProcedure").resetChanges();
							that.getView().getModel("standardProcedure").refresh();
							// that._aDialogs[sDialogID].close();
							that.close();
							that.getView().getModel("standardProcedure").refresh();
						}
					}
				});
			} else {
				this.getView().getModel("standardProcedure").resetChanges();
				

				//this.byId("createDialog").close();
				
				// that._aDialogs[sDialogID].close();

					

							that.close();

			}
		},

		onInit: function() {

			this._oDialog = this.getControl();

			this.oModel = this.getOwnerComponent().getModel("standardProcedure");
			
				var that=this;
				this.getOwnerComponent().getModel("User").read("/UserClub", {
				success: function (oData) {
						that.club_dms_id = oData.results[0].club_dms_id;
				},
				error: function (oError) {}
			});

		},
		onExit: function() {
			this._oDialog.destroy();

		},
		
						handleUploadPress: function (oEvent) {
			var that = this;

			var oModel = this._oControl.getModel("standardProcedure");

			var file = oEvent.getParameter("files")[0];
			var sBindingPath = oEvent.getSource().getBindingContext("standardProcedure").getPath(); // oEvent.get
			var sPath = "/proof_cmis_id1";
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
		// 	handleUploadPress: function (oEvent) {
		// 	var DomRef = this.getView().byId('myFileUploadprocedure').getFocusDomRef();
		// 	var sModel = this._oControl.getModel("standardProcedure");
		// 	var sBindingPath = this.getView().byId('myFileUploadprocedure').getBindingContext("standardProcedure").getPath();
		// 	var file = DomRef.files[0] || '';
		// 	if (file != '') {
		// 		RepoService.uploadFile(file).then(function (param1, param2) {
		// 			var filename = param1.properties['cmis:name'].value;
		// 			sModel.setProperty(sBindingPath + '/proof_cmis_id1', filename);
		// 		});
		// 	}
		// },
		openlink: function (oEvent) {
			var sLink = '';
			var filename = this.getView().byId('myFileUploadprocedure').getBindingContext("standardProcedure").getProperty('proof_cmis_id1');
			RepoService.getRepoId().then(function (ReposId) {
				sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + filename;
				window.open(sLink);
			});
		},

		
			onValueHelpRequest: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue(),
				oView = this.getView();

			if (!this._pValueHelpDialog) {
				this._pValueHelpDialog = Fragment.load({
					id: oView.getId(),
					name: "pwc.portal.eval.ClubEvaluations.view.Applications.stdProcController.view.ValueHelpDialog",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);

					return oDialog;
				});
			}
			this._pValueHelpDialog.then(function (oDialog) {

					oView.byId("selectDialog").bindAggregation("items", "standardProcedure>/ProcedureNames", new sap.m.StandardListItem({
					// description:"{standardProcedure>club_com_name}",
							title: "{standardProcedure>value}"
					}));
					oDialog.getBinding("items").filter([new Filter("value", FilterOperator.Contains, sInputValue)]);
				

				// Create a filter for the binding
				// Open ValueHelpDialog filtered by the input's value
				oDialog.open(sInputValue);
			});
		},
		onValueHelpDialogSearch: function (oEvent) {

			var sValue = oEvent.getParameter("value");

				oEvent.getSource().getBinding("items").filter([new Filter("value", FilterOperator.Contains, sValue)]);



		},
		onValueHelpDialogClose: function (oEvent) {
			var sDescription,
				oSelectedItem = oEvent.getParameter("selectedItem");
			oEvent.getSource().getBinding("items").filter([]);

			if (!oSelectedItem) {
				return;
			}

			sDescription = oSelectedItem.getTitle();
			
			this.getView().byId("procedure_name").setSelectedKey(sDescription);

		}
		
		
		
		
		
		
		
		
		
		
		
		
		

	});
}, /* bExport= */ true);

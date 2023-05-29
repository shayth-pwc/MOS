sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
		"pwc/portal/eval/ClubEvaluations/service/RepoService",
		"sap/ui/model/json/JSONModel"
], function(ManagedObject, MessageBox,  History,RepoService,JSONModel) {

	return ManagedObject.extend("pwc.portal.eval.ClubEvaluations.view.Applications.OfficialClubStrategy.controller.SwotAnalysis", {
	club_dms_id:'',
		constructor: function(oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "pwc.portal.eval.ClubEvaluations.view.Applications.OfficialClubStrategy.view.SwotAnalysis", this);
			this._bInit = false;
			
		},
		onInit: function() {
			var that=this;
				this.getOwnerComponent().getModel("User").read("/UserClub", {
				success: function (oData) {
						that.club_dms_id = oData.results[0].club_dms_id;
				},
				error: function (oError) {}
			});
			
			var oViewModel = new JSONModel({
						enabled: true
				});
			this.getView().setModel(oViewModel, "appView");

			this._oDialog = this.getControl();
			this.oModel = this.getOwnerComponent().getModel("OfficialClub");

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
					if (input) {
						input.setValueState("None"); //initially set ValueState to None
						if (input.getValue() === "") {
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

		onExit: function() {
			this._oDialog.destroy();

		},
		_getRequiredFields:function(){
			
			return	[{
					"id": "SwotSeasonCombo"
				}, {
					"id": "StrengthText"
				}, {
					"id": "weaknessText"
				}, {
					"id": "opportunitiesText"
				},{
					"id":"threatsText"
				}];
		},
	
	handleUploadPress: function (oEvent) {
			var that = this;

			var oModel = this._oControl.getModel("OfficialClub");

			var file = oEvent.getParameter("files")[0];
			var sBindingPath = oEvent.getSource().getBindingContext("OfficialClub").getPath(); // oEvent.get
			var sPath = 'swot_cmis_id';
			if (file !== '') {
				if (file !== "") {
					var sendpath = that.club_dms_id;
					RepoService.uploadFile(file, sendpath).then(function (param1, param2) {

						
						var filename = param1.properties['cmis:name'].value;
						oModel.setProperty(sBindingPath + "/" + sPath, sendpath + "/Evaluation/" +   filename);
					});

				}
			}
		},
	openlink: function (oEvent) {
				var that=this;
		var sLink = '';
			var filename = oEvent.getSource().getText();
			RepoService.getRepoId().then(function (ReposId) {
				// sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + filename;
				sLink = that.club_dms_id + "/Evaluation/" + filename;

				window.open(sLink);
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


		

	});
}, /* bExport= */ true);

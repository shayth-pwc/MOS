sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService",
	"sap/ui/model/json/JSONModel"
], function (ManagedObject, MessageBox, Utilities, History, RepoService, JSONModel) {

	return ManagedObject.extend("pwc.portal.eval.ClubEvaluations.view.Applications.InvestmentMeeting.controller.secondcreate", {
		club_dms_id:'',
		constructor: function (oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "pwc.portal.eval.ClubEvaluations.view.Applications.InvestmentMeeting.view.secondcreate", this);
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
/*_validateSaveEnablement: function () {
			var aInputControls = this._getFormFields(this.getElement().byId("activityForm")),
				oControl,
				sValue;
			for (var m = 0; m < aInputControls.length; m++) {
				oControl = aInputControls[m].control;
				if (aInputControls[m].required) {
					sValue = oControl.getValue();
					if (!sValue) {
						oControl.setValueState("Error");
					} else {
						oControl.setValueState("None");
					}
				}
			}
		},
		_getFormFields: function (oSimpleForm) {
			var aControls = [],
				aFormContent = oSimpleForm.getContent(),
				sControlType;
			for (var i = 0; i < aFormContent.length; i++) {
				sControlType = aFormContent[i].getMetadata().getName();
				if (sControlType === "sap.m.Input" || sControlType === "sap.m.DateTimeInput" ||
					sControlType === "sap.m.CheckBox") {
					aControls.push({
						control: aFormContent[i],
						required: aFormContent[i - 1].getRequired && aFormContent[i - 1].getRequired()
					});
				}
			}
			return aControls;
		},*/
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
		_onDialogAfterClose17c: function () {

			this.close();

		},
		_onSubmit17c: function () {
			var oView = this.getView(),
				that = this,
				oEntry = {},
				oController = this,
				status = true,
				requiredFieldInfo = [{
					"id": "newmeeting_title",
					"type": "text",
					"required" :true
				}, {
					"id": "newmeeting_description",
					"type": "text",
					"required" :true
				},{
					"id": "newmeeting_start_date",
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
																that.getView().getModel().refresh();

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
/*
		_onCancel17c: function () {
		console.log(this._oControl);
			var self = this;
			var sPath;
			sPath = this._oControl.getBindingContext("Investmentmeeting").getPath();
			sPath = sPath.replace('/', '');
			if (this._oControl.getModel("Investmentmeeting").getPendingChanges()[sPath]) {
				this._oControl.getModel("Investmentmeeting").resetChanges([this._oControl.getBindingContext("Investmentmeeting").getPath()], undefined,
					true);
			}
			var requiredFieldInfo = this.getView().getControlsByFieldGroupId("uploader");
			requiredFieldInfo.forEach(function (RequiredInfo) {

				RequiredInfo.setValueState(sap.ui.core.ValueState.None);

			});
			this.close();

		},
		*/
		
		_onCancel17c: function (oEvent) {
		var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			var that = this,
				oModel = that.getView().getModel("Investmentmeeting"),
				sDialogID = oEvent.getSource().getParent().getId().split("-");
			sDialogID = sDialogID[sDialogID.length - 1];
			if (oModel.hasPendingChanges()) {
				MessageBox.confirm(oResourceBundle.getText('ConfirmCancel'), {
					onClose: function (oAction) {
						if (oAction === sap.m.MessageBox.Action.OK) {
							that.getView().getModel("Investmentmeeting").resetChanges();
							that.getView().getModel("Investmentmeeting").refresh();
							// that._aDialogs[sDialogID].close();
							that.close();
							that.getView().getModel("Investmentmeeting").refresh();
						}
					}
				});
			} else {
				this.getView().getModel("Investmentmeeting").resetChanges();
				

				//this.byId("createDialog").close();
				
				// that._aDialogs[sDialogID].close();

					

							that.close();

			}
		},
		
		
		
		
		handleUploadPress: function (oEvent) {
			var that = this;

			var oModel = this._oControl.getModel("Investmentmeeting");

			var file = oEvent.getParameter("files")[0];
			var sBindingPath = oEvent.getSource().getBindingContext("Investmentmeeting").getPath(); // oEvent.get
			var sPath = 'regularity_proof_cmis_id';
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
		handleUploadPress1: function (oEvent) {
			var that = this;

			var oModel = this._oControl.getModel("Investmentmeeting");

			var file = oEvent.getParameter("files")[0];
			var sBindingPath = oEvent.getSource().getBindingContext("Investmentmeeting").getPath(); // oEvent.get
			var sPath = 'achievements_evidence_proof_cmis_id';
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
		handleUploadPress2: function (oEvent) {
			var that = this;

			var oModel = this._oControl.getModel("Investmentmeeting");

			var file = oEvent.getParameter("files")[0];
			var sBindingPath = oEvent.getSource().getBindingContext("Investmentmeeting").getPath(); // oEvent.get
			var sPath = 'quarterly_review_proof_cmis_id';
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
		handleUploadPress3: function (oEvent) {
			var that = this;

			var oModel = this._oControl.getModel("Investmentmeeting");

			var file = oEvent.getParameter("files")[0];
			var sBindingPath = oEvent.getSource().getBindingContext("Investmentmeeting").getPath(); // oEvent.get
			var sPath = 'impressions_evidence_proof_cmis_id';
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
		handleUploadPress4: function (oEvent) {
			var that = this;

			var oModel = this._oControl.getModel("Investmentmeeting");

			var file = oEvent.getParameter("files")[0];
			var sBindingPath = oEvent.getSource().getBindingContext("Investmentmeeting").getPath(); // oEvent.get
			var sPath = 'improvements_evidence_proof_cmis_id';
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
			handleUploadPress5: function (oEvent) {
			var that = this;

			var oModel = this._oControl.getModel("Investmentmeeting");

			var file = oEvent.getParameter("files")[0];
			var sBindingPath = oEvent.getSource().getBindingContext("Investmentmeeting").getPath(); // oEvent.get
			var sPath = 'other_evidence_proof_cmis_id';
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

		Openlink: function (oEvent) {
			var sLink = '';
			var filename = oEvent.getSource().getText();
			RepoService.getRepoId().then(function (ReposId) {
				sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + filename;
				window.open(sLink);
			});
		},
		/*Openlink: function (oEvent) {
			var sLink = '';
			var filename = oEvent.getSource().mProperties.text;
			RepoService.getRepoId().then(function (ReposId) {
				sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + filename;
				window.open(sLink);
			});
		},
*/
		onInit: function () {
var that=this;
				this.getOwnerComponent().getModel("User").read("/UserClub", {
				success: function (oData) {
						that.club_dms_id = oData.results[0].club_dms_id;
				},
				error: function (oError) {}
			});
			this._oDialog = this.getControl();
			this.oModel = this.getOwnerComponent().getModel("Investmentmeeting");

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
			handleCreateChange: function (oEvent) {
			var oDateTimePickerStart = this.getView().byId("newmeeting_start_date"),
				oDateTimePickerEnd = this.getView().byId("newmeeting_end_date");
			this._validateDateTimePicker(oDateTimePickerStart, oDateTimePickerEnd);
		},


_validateDateTimePicker: function (oDateTimePickerStart, oDateTimePickerEnd) {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			var oStartDate = oDateTimePickerStart.getDateValue(),
				oEndDate = oDateTimePickerEnd.getDateValue(),
				sValueStateText = oResourceBundle.getText('dateDifferenceValidation');

			if (oStartDate && oEndDate && oEndDate.getTime() <= oStartDate.getTime()) {
				oDateTimePickerStart.setValueState(sap.ui.core.ValueState.Error);
				oDateTimePickerEnd.setValueState(sap.ui.core.ValueState.Error);
				oDateTimePickerStart.setValueStateText(sValueStateText);
				oDateTimePickerEnd.setValueStateText(sValueStateText);

			} else {
				oDateTimePickerStart.setValueState(sap.ui.core.ValueState.None);
				oDateTimePickerEnd.setValueState(sap.ui.core.ValueState.None);

			}
		}
	
	
	});
}, /* bExport= */ true);
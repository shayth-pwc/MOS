sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService"

], function(ManagedObject, MessageBox, Utilities, History,RepoService) {

	return ManagedObject.extend("pwc.portal.eval.ClubEvaluations.view.Applications.RecreationalActivitiesGuide.controller.AddAccount", {
				club_dms_id: '',

		constructor: function(oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "pwc.portal.eval.ClubEvaluations.view.Applications.RecreationalActivitiesGuide.view.AddAccount", this);
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
					"id": "document_type",
					"type": "select",
					"required" :true
				}, {
					"id": "document_description",
					"type": "text",
					"required" :true
				},
				{
					"id": "plan_start_date",
					"type": "text",
					"required" :false
				},
				{
					"id": "plan_end_date",
					"type": "text",
					"required" :false
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

			this.oModel = this.getOwnerComponent().getModel("RecreationalEvents");
			
			var that = this
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
		handleUploadPress: function (oEvent) {
			console.log(DomRef);
			var DomRef = this.getView().byId('myFileUploadbusinessplan').getFocusDomRef();
			var sModel = this._oControl.getModel("RecreationalEvents");
			var sBindingPath = this.getView().byId('myFileUploadbusinessplan').getBindingContext("RecreationalEvents").getPath();
			var file = DomRef.files[0] || '';
			if (file != '') {
				RepoService.uploadFile(file, that.club_dms_id).then(function (param1, param2) {
					var filename = param1.properties['cmis:name'].value;
					sModel.setProperty(sBindingPath + '/proof_cmis_id', that.club_dms_id + "/Evaluation/" + filename);
				});
			}
		},
		openlink: function (oEvent) {
			var sLink = '';
			var filename = this.getView().byId('myFileUploadbusinessplan').getBindingContext("RecreationalEvents").getProperty('proof_cmis_id');
			RepoService.getRepoId().then(function (ReposId) {
				sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + filename;
				window.open(sLink);
			});
		}

	});
}, /* bExport= */ true);

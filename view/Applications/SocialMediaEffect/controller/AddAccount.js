sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService"

], function (ManagedObject, MessageBox, Utilities, History, RepoService) {

	return ManagedObject.extend("pwc.portal.eval.ClubEvaluations.view.Applications.SocialMediaEffect.controller.AddAccount", {
		club_dms_id: '',
		account_verficiation_proof_cmis_id: '',
		constructor: function (oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(),
				"pwc.portal.eval.ClubEvaluations.view.Applications.SocialMediaEffect.view.AddAccount", this);
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
		_onFileUploaderUploadComplete: function () {
			// Please implement

		},
		_onFileUploaderChange: function () {
			// Please implement

		},
		_onFileUploaderTypeMissmatch: function () {
			// Please implement

		},
		_onFileUploaderFileSizeExceed: function () {
			// Please implement

		},

		onpress_Addaccount: function (oEvent) {
			var that = this,
				oView = this.getView(),
				bValidationError = false,
				oEntInd, Form,
				oBusy = new sap.m.BusyDialog(),
				oEntry = {},
				FieldInfo = that._getRequiredFields();

			FieldInfo.forEach(function (item, index, arr) {
				oEntInd = item.id;

				if (item.type === "text") {
					oEntry[oEntInd] = oView.byId(item.id).getValue();

				} else if (item.type === "select") {
					oEntry[oEntInd] = oView.byId(item.id).getSelectedKey();
				}
				if (oEntry[oEntInd] === "" && item.required === true) {
					bValidationError = true;
					oView.byId(item.id).setValueState("Error");
				} else if (oEntry[oEntInd] !== "" && item.required === true) {
					oView.byId(item.id).setValueState("None");
				} else {
					oView.byId(item.id).setValueState("None");
				}
			});

			oEntry['club_id'] = '1';
			oEntry['created_by'] = "12";
			
			oEntry['account_verficiation_proof_cmis_id'] = that.account_verficiation_proof_cmis_id;

			console.log(oEntry);
			if (!bValidationError) {
				ConfirmSubmit = "Confirm";
				Form = "AddItem";

				sap.m.MessageBox.show(ConfirmSubmit, {
					icon: sap.m.MessageBox.Icon.QUESTION,
					title: "Confirm",
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === "YES") {

							return new Promise(function (fnResolve, fnReject) {
								that.getOwnerComponent().getModel("SocialMediaEff").create("/SMACC", oEntry, {
									success: function (oData) {
										that.account_verficiation_proof_cmis_id = "null";

										fnResolve();
										sap.m.MessageToast.show("Confirm", {
											onClose: that._onButtonPress1(oEvent),
											duration: 0 || 3000
										});
										oBusy.close();
										return;
									},
									error: function (oError) {
										sap.m.MessageBox.show(oError.message.value, {
											icon: sap.m.MessageBox.Icon.ERROR,
											title: "oError"
										});
										return;
									}
								});
							}).catch(function (err) {
								if (err !== undefined) {
									MessageBox.error(err.message);
								}
							});
						} else {
							oEntry = {};
							oBusy.close();
							return;
						}
					}
				});

			}
		},

		_getRequiredFields: function () {
			return [{
				"id": "social_media_account_status",
				"type": "select",
				"required": true
			}, {
				"id": "social_media_account_name",
				"type": "text",
				"required": true
			}, {
				"id": "social_media_account_type",
				"type": "select",
				"required": true
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
		_onButtonPress1: function (oEvent) {

			oEvent = jQuery.extend(true, {}, oEvent);
			return new Promise(function (fnResolve) {
					fnResolve(true);
				})
				.then(function (result) {
					return new Promise(function (fnResolve) {
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
				.then(function (result) {
					if (result === false) {
						return false;
					} else {

						this.close();

					}
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
		},
		onInit: function () {

			this._oDialog = this.getControl();

			this.oModel = this.getOwnerComponent().getModel("SocialMediaEff");
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
		handleUploadPress: function (oEvent) {
			var that = this;

			var oModel = this._oControl.getModel("SocialMediaEff");

			var file = oEvent.getParameter("files")[0];
			var sBindingPath = oEvent.getSource().getBindingContext("SocialMediaEff").getPath(); // oEvent.get
			var sPath = "account_verficiation_proof_cmis_id";
		//	var sPath = oEvent.getSource().getParent().getFields()[1].mBindingInfos.text.binding.sPath;
			if (file !== '') {
				if (file !== "") {
					var sendpath = that.club_dms_id;
					RepoService.uploadFile(file, sendpath).then(function (param1, param2) {

						var filename = param1.properties['cmis:name'].value;
						oModel.setProperty(sBindingPath + "/" + sPath, sendpath + "/Evaluation/" + filename);
						that.account_verficiation_proof_cmis_id = sendpath + "/Evaluation/" + filename;
						
					});

				}
			}
		},
		openlink: function (oEvent) {
			var sLink = '';
			var filename = this.getView().byId('myFileUploadbusinessplan').getBindingContext("SocialMediaEff").getProperty(
				'account_verficiation_proof_cmis_id');
			RepoService.getRepoId().then(function (ReposId) {
				sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + filename;
				window.open(sLink);
			});
		}

	});
}, /* bExport= */ true);
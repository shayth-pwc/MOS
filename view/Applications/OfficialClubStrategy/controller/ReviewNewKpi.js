sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService"
], function (ManagedObject, MessageBox, History, RepoService) {

	return ManagedObject.extend("pwc.portal.eval.ClubEvaluations.view.Applications.OfficialClubStrategy.controller.ReviewNewKPI", {
		constructor: function (oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(),
				"pwc.portal.eval.ClubEvaluations.view.Applications.OfficialClubStrategy.view.ReviewNewKPI", this);
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
		// _onButtonPress: function() {
		// 	var oView = this.getView(),
		// 		oController = this,
		// 		status = true,
		// 		requiredFieldInfo = [];
		// 	if (requiredFieldInfo.length) {
		// 		status = this.handleChangeValuestate(requiredFieldInfo, oView);
		// 	}
		// 	if (status) {
		// 		return new Promise(function(fnResolve, fnReject) {
		// 			var oModel = oController.oModel;

		// 			var fnResetChangesAndReject = function(sMessage) {
		// 				oModel.resetChanges();
		// 				fnReject(new Error(sMessage));
		// 			};
		// 			if (oModel && oModel.hasPendingChanges()) {
		// 				oModel.submitChanges({
		// 					success: function(oResponse) {
		// 						var oBatchResponse = oResponse.__batchResponses[0];
		// 						var oChangeResponse = oBatchResponse.__changeResponses && oBatchResponse.__changeResponses[0];
		// 						if (oChangeResponse && oChangeResponse.data) {
		// 							var sNewContext = oModel.getKey(oChangeResponse.data);
		// 							oView.unbindObject();
		// 							oView.bindObject({
		// 								path: "/" + sNewContext
		// 							});
		// 							if (window.history && window.history.replaceState) {
		// 								window.history.replaceState(undefined, undefined, window.location.hash.replace(encodeURIComponent(oController.sContext), encodeURIComponent(sNewContext)));
		// 							}
		// 							oModel.refresh();
		// 							fnResolve();
		// 						} else if (oChangeResponse && oChangeResponse.response) {
		// 							fnResetChangesAndReject(oChangeResponse.message);
		// 						} else if (!oChangeResponse && oBatchResponse.response) {
		// 							fnResetChangesAndReject(oBatchResponse.message);
		// 						} else {
		// 							oModel.refresh();
		// 							fnResolve();
		// 						}
		// 					},
		// 					error: function(oError) {
		// 						fnReject(new Error(oError.message));
		// 					}
		// 				});
		// 			} else {
		// 				fnResolve();
		// 			}
		// 		}).catch(function(err) {
		// 			if (err !== undefined) {
		// 				MessageBox.error(err.message);
		// 			}
		// 		});
		// 	}
		// },
		// handleChangeValuestate: function(requiredFieldInfo, oView) {
		// 	var status = true;
		// 	if (requiredFieldInfo) {
		// 		requiredFieldInfo.forEach(function(requiredinfo) {
		// 			var input = oView.byId(requiredinfo.id);
		// 			if (input) {
		// 				input.setValueState("None"); //initially set ValueState to None
		// 				if (input.getValue() === '') {
		// 					input.setValueState("Error"); //input is blank set ValueState to error
		// 					status = false;
		// 				} else if (input.getDateValue && !input._bValid) { //since 1.64 ui5 will be providing a function 'isValidValue' that can be used here.
		// 					input.setValueState("Error"); //Invalid Date set ValueState to error
		// 					status = false;
		// 				}
		// 			}
		// 		});
		// 	}
		// 	return status;

		// },
		Openlink: function (oEvent) {
			var sLink = '';
			var filename = oEvent.getSource().getText();
			RepoService.getRepoId().then(function (ReposId) {
				sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + filename;
				window.open(sLink);
			});
		},

		_onButtonPress1: function () {

			this.close();

		},
		onInit: function () {

			this._oDialog = this.getControl();

			this.oModel = this.getOwnerComponent().getModel();

		},
		onExit: function () {
			this._oDialog.destroy();

		},

		myFormatterDate: function (value) {

			var d = new Date(value),
				month = '' + (d.getMonth() + 1),
				day = '' + d.getDate(),
				year = d.getFullYear();

			if (month.length < 2) month = '0' + month;

			if (day.length < 2) day = '0' + day;

			return [year, month, day].join('-');

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
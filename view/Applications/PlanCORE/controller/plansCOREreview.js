sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService"
], function (ManagedObject, MessageBox, Utilities, History, RepoService) {

	return ManagedObject.extend("pwc.portal.eval.ClubEvaluations.view.Applications.PlanCORE.controller.plansCOREreview", {
		constructor: function (oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(),
				"pwc.portal.eval.ClubEvaluations.view.Applications.PlanCORE.view.plansCOREreview", this);
			this._bInit = false;
		},
		renderPDF: function (oEvent) {
			//Generate the token
			var modeldata = this.getView().byId("plans").getParent().mObjectBindingInfos.plansCORE.path;

			var data = this.getOwnerComponent().getModel("plansCORE").getProperty(modeldata);
			console.log(data);
			// 			 var x = "saif";
			// conslog.log(`hello  ${x} `);

			//Build the xml data with the data from the model
			console.log(data.activity_name);
		

				// var xmldata =	 "<?xml version=\"1.0\" encoding=\"UTF-8\"?>< topmostSubform >	< TextField1 > " +data.activity_name +"< /TextField1>	< TextField2 >" + data.activity_description  +"< /TextField2>	< TextField3 >" + data.goal_title  +"< /TextField3>	< TextField4 >" + data.start_date_time  +"< /TextField4>		< TextField5 >" + data.end_date_time  +"< /TextField5>	< TextField6 >" + data.finance_resource  +"< /TextField6>		< TextField7 > " +data.expense_allocation  +"< /TextField7>	< TextField8 >" + data.human_resources_number  +"< /TextField8>		< TextField9 >" + data.kpi_title  +"< /TextField9>	< TextField10 >" + data.kpi_frequency_of_measure  +"< /TextField10>	< TextField11 >" + data.kpi_description  +"< /TextField11>	< TextField12 >"+ data.kpi_owner+"< /TextField12>	< TextField13 >"+ data.target_percentage  +"< /TextField13>	< TextField14 >" + data.target_date  +"< /TextField14> < /topmostSubform>";

var xmldata ="<?xml version=\"1.0\" encoding=\"UTF-8\"?><topmostSubform><TextField3>"+data.activity_name+"</TextField3><TextField2>"+data.activity_description+"</TextField2><TextField1>"+data.goal_title+"</TextField1><TextField5>"+data.start_date_time+"</TextField5><TextField4>"+data.end_date_time+"</TextField4><TextField8>"+data.finance_resource+"</TextField8><TextField7>"+data.expense_allocation+"</TextField7><TextField6>"+data.human_resources_number+"</TextField6><TextField10>"+data.kpi_title+"</TextField10><TextField9>"+data.kpi_frequency_of_measure+"</TextField9><TextField14>"+data.kpi_description+"</TextField14><TextField13>"+data.kpi_owner+"</TextField13><TextField12>"+data.target_percentage+"</TextField12><TextField11>"+data.target_date+"</TextField11></topmostSubform>";

			var encdata = 			btoa(unescape(encodeURIComponent(xmldata)));
			//prepare the render API call. Pick up the template from template store
			var jsondata = "{  " + "\"xdpTemplate\": \"" + "22b/22b" + "\", " + "\"xmlData\": \"" + encdata + "\"}";
			var url_render = "/render/v1/adsRender/pdf?templateSource=storageName";
			//make the API call
			$.ajax({
				url: url_render,
				type: "post",
				contentType: "application/json",
				data: jsondata,
				success: function (data, textStatus, jqXHR) {
					//once the API call is successfull, Display PDF on screen
					var decodedPdfContent = atob(data.fileContent);
					var byteArray = new Uint8Array(decodedPdfContent.length);
					for (var i = 0; i < decodedPdfContent.length; i++) {
						byteArray[i] = decodedPdfContent.charCodeAt(i);
					}
					var blob = new Blob([byteArray.buffer], {
						type: 'application/pdf'
					});
					var _pdfurl = URL.createObjectURL(blob);

					if (!this._PDFViewer) {
						this._PDFViewer = new sap.m.PDFViewer({
							width: "auto",
							source: _pdfurl
						});
						jQuery.sap.addUrlWhitelist("blob"); // register blob url as whitelist
					}

					this._PDFViewer.open();

				},
				error: function (data) {

				}
			});

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

			this.oModel = this.getOwnerComponent().getModel("plansCORE");
			
			var that=this;
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

		myFormatterDate: function (value) {

			var d = new Date(value),
				month = '' + (d.getMonth() + 1),
				day = '' + d.getDate(),
				year = d.getFullYear();

			if (month.length < 2) month = '0' + month;

			if (day.length < 2) day = '0' + day;

			return [year, month, day].join('-');

		}

	});
}, /* bExport= */ true);
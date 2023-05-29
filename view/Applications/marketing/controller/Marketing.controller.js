sap.ui.define([
		"pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"sap/m/MessageBox",
	"./AddMatchdayPolicy",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"pwc/portal/eval/ClubEvaluations/service/RepoService"

], function(BaseController, MessageBox, AddMatchdayPolicy, Utilities, History,JSONModel,RepoService) {
	"use strict";

	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.marketing.controller.Marketing", {
	club_dms_id:'',
		handleRouteMatched: function(oEvent) {
			var sAppId = "App624d33171cfbfb01d2ea7327";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function(oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype" && prop.includes("Set")) {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

				}
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
							// onAfterRendering: function () {
       //         if (typeof sap.ui.getCore().AppContext === 'undefined') {
       //             this.getOwnerComponent().getRouter().navTo("home");
       //             this.destroy();
       //         }
       //     },

		_onButtonPress1: function(oEvent) {

			var sDialogName = "AddMatchdayPolicy";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new AddMatchdayPolicy(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext("ProcedureGuides");
			oDialog._oControl.setBindingContext(context, "ProcedureGuides");

			oDialog.open();

		},

		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oODataModel = this.getOwnerComponent().getModel("Marketing");

			// this.oRouter.getTarget("Marketing").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			var omodel=this.getView().getModel("ProcedureGuides");
			var oviewmodel=new JSONModel();
			
			var that=this;
				this.getOwnerComponent().getModel("User").read("/UserClub", {
				success: function (oData) {
						that.club_dms_id = oData.results[0].club_dms_id;
				},
				error: function (oError) {}
			});
			
		},
		addmatchdaypolicy: function(oEvent) {

			var sDialogName = "AddMatchdayPolicy";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new AddMatchdayPolicy(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
	var oContext = this.getView().getModel("ProcedureGuides").createEntry("/MATCHPOLICIES"
	// , {
	// 			properties: {
	// 				id: '-1',
	// 				club_id:Math.floor(Math.random() * 1000) + "" ,
	// 				club_matchpolicy_id:Math.floor(Math.random() * 1000) + "",
	// 				document_type: "",
	// 				document_description: "",
	// 				creation_date_time: new Date(),
	// 				changed_date_time: new Date(),
	// 				created_by:"P000007",
	// 				chnaged_by:"P000007",
	// 				// created_by: sap.ushell.Container.getService("UserInfo").getId(),
	// 				// changed_by: sap.ushell.Container.getService("UserInfo").getId(),
	// 				// CREATED_BY_NAME: sap.ushell.Container.getService("UserInfo").getId(),
	// 				// CHANGED_BY_NAME: sap.ushell.Container.getService("UserInfo").getId(),
	// 				proof_cmis_id: "",
	// 				match_date:""
	// 			}
	// 		}
			);

			oDialog._oControl.setBindingContext(oContext, "ProcedureGuides");
			oDialog.open();

		},
		editmatchdaypolicy: function (e) {
			var t = "AddMatchdayPolicy";
			this.mDialogs = this.mDialogs || {};
			var i = this.mDialogs[t];
			if (!i) {
				i = new AddMatchdayPolicy(this.getView());
				this.mDialogs[t] = i;
				i.setRouter(this.oRouter)
			}
			var o = e.getSource().getBindingContext("ProcedureGuides");
			i._oControl.setBindingContext(o, "ProcedureGuides");
			i.open()
		},
		
		deletematchdaypolicy: function (oEvent) {
			 var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
           var that = this,
				sPath =	oEvent.getSource().getParent().getBindingContext("ProcedureGuides").getPath(),
				oModel = that.getView().getModel("ProcedureGuides");
			MessageBox.confirm(oResourceBundle.getText('ConfirmEditSubmit'), {
				onClose: function (oAction) {
					if (oAction === sap.m.MessageBox.Action.OK) {
						oModel.remove(sPath, {
							success: function (oData) {
							sap.m.MessageToast.show(oResourceBundle.getText('Success'));
								oModel.refresh();
							},
							error: function (oError) {
								sap.m.MessageToast.show(oResourceBundle.getText('err'));
							}
						});
					}
				}
			});

	
	},

	// 	deletematchdaypolicy: function (oEvent) {
	// 		var sPath = oEvent.getSource().getParent().getBindingContext("ProcedureGuides").getPath();
	// 		if (sPath) {
	// 			return new Promise(function (fnResolve, fnReject) {
	// 			oEvent.getSource().getParent().getModel("ProcedureGuides").remove(sPath,{
	// 					success: function (oData) {
	// 							fnResolve();
	// 						sap.m.MessageToast.show("Entry Has been Deleted!", {
	// 							onClose: fnResolve,
	// 							duration: 0 || 3000
	// 						});
							
	// 						return;
	// 					},
	// 					error: function (oError) {
	// 						sap.m.MessageBox.show(oError.message.value, {
	// 							icon: sap.m.MessageBox.Icon.ERROR,
	// 							title: "oError"
	// 						});
	// 						return;
	// 					}
	// 				});
	// 			oEvent.getSource().getParent().getModel("ProcedureGuides").refresh();
	// 		}).catch(function (err) {
	// 				if (err !== undefined) {
	// 					MessageBox.error(err.message);
	// 				}});
	// 	}
	// },
		
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

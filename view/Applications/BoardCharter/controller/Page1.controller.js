sap.ui.define([
		"pwc/portal/eval/ClubEvaluations/controller/BaseController",
		"sap/m/library",
		"sap/m/MessageBox",
		"./AddPolicy",
		"./AddProcedure",
		"./Dialog3",
		"./EditPolicy",
		"./EditProcedure",
		"./EditData",
		"./utilities",
		"sap/ui/core/routing/History",
		"pwc/portal/eval/ClubEvaluations/service/RepoService"
	], function (BaseController, MLibrary, MessageBox, AddPolicy, AddProcedure, Dialog3, EditPolicy, EditProcedure, EditData, Utilities,
		History, RepoService) {
		"use strict";
		var URLHelper = MLibrary.URLHelper;
		return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.BoardCharter.controller.Page1", {
						club_dms_id:'',
			handleRouteMatched: function (oEvent) {
				var sAppId = "App6295ad13f6b3d701d1d08208";
				var oParams = {};
				if (oEvent.mParameters.data.context) {
					this.sContext = oEvent.mParameters.data.context;
				} else {
					if (this.getOwnerComponent().getComponentData()) {
						var patternConvert = function (oParam) {
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
			addPolicy: function (oEvent) {
				var sDialogName = "AddPolicy";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new AddPolicy(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// var oContext = this.getView().getModel("BoardCharter").createEntry("BOARDCHARTERPOLICY");
				var oContext = this.getView().getModel("BoardCharter").createEntry("BOARDCHARTERPOLICY", {
					properties: {
						related_department: ""
					}
				});
				oDialog._oControl.setBindingContext(oContext, "BoardCharter");
				oDialog.open();
			},
			editPolicy: function (oEvent) {
				var sDialogName = "AddPolicy";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new AddPolicy(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("BoardCharter");
				oDialog._oControl.setBindingContext(context, "BoardCharter");
				oDialog.open();
			},
			deleteRow: function (oEvent) {
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
				var that = this,
					sPath = oEvent.getSource().getParent().getBindingContext("BoardCharter").getPath(),
					oModel = that.getView().getModel("BoardCharter");
				MessageBox.confirm(oResourceBundle.getText("ConfirmEditSubmit"), {
					onClose: function (oAction) {
						if (oAction === sap.m.MessageBox.Action.OK) {
							oModel.remove(sPath, {
								success: function (oData) {
									sap.m.MessageToast.show(oResourceBundle.getText("Success"));
									oModel.refresh();
								},
								error: function (oError) {
									sap.m.MessageToast.show(oResourceBundle.getText("err"));
								}
							});
						}
					}
				});
			},
			AddProcedure: function (oEvent) {
				var sDialogName = "AddProcedure";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new AddProcedure(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// var oContext = this.getView().getModel("BoardCharter").createEntry("BOARDCHARTERPOLICY");
				var oContext = this.getView().getModel("BoardCharter").createEntry("BOARDCHARTERPROCEDURES", {
					properties: {
						related_department: ""
					}
				});
				oDialog._oControl.setBindingContext(oContext, "BoardCharter");
				oDialog.open();
			},
			editProcedure: function (oEvent) {
				var sDialogName = "AddProcedure";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new AddProcedure(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("BoardCharter");
				oDialog._oControl.setBindingContext(context, "BoardCharter");
				oDialog.open();
			},
			addCharterData: function (oEvent) {
				var sDialogName = "Dialog3";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new Dialog3(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				var oContext = this.getView().getModel("BoardCharter").createEntry("/BOARDCHARTERDATA");
				oDialog._oControl.setBindingContext(oContext, "BoardCharter");
				oDialog.open();
			},
			editCharterData: function (oEvent) {
				var sDialogName = "Dialog3";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new Dialog3(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("BoardCharter");
				oDialog._oControl.setBindingContext(context, "BoardCharter");
				oDialog.open();
			},
			onInit: function () {
				var that = this;
				this.getOwnerComponent().getModel("User").read("/UserClub", {
				success: function (oData) {
						that.club_dms_id = oData.results[0].club_dms_id;
				},
				error: function (oError) {}
			});
				this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				this.getOwnerComponent().getModel("BoardCharter").read("/BOARDCHARTERCONFLICT", {
					success: function (oData) {
						// console.log(oData.results.slice(-1).pop().id);
						that.getView().byId("conflictupload").bindElement("BoardCharter>/BOARDCHARTERCONFLICT(" + oData.results.slice(-1).pop().id +
							"l)");
						that.getView().byId("conflictattach").bindElement("BoardCharter>/BOARDCHARTERCONFLICT(" + oData.results.slice(-1).pop().id +
							"l)");
					},
					error: function (oError) {}
				}); // this.oRouter.getTarget("Page1").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			},
			// Openlink: function (oEvent) {
			// var sLink = '';
			//          var filename = oEvent.getSource().mProperties.text;
			//          RepoService.getRepoId().then(function (ReposId) {
			//              // sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + filename;
			//              window.open(filename);
			//          });
			//      },
			Openlink: function (oEvent) {
				var that = this;
				var sLink = '';
				var filename = oEvent.getSource().getText();
				RepoService.getRepoId().then(function (ReposId) {
					// sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + filename;
					sLink = that.club_dms_id + "/Evaluation/" + filename;

					window.open(sLink);
				});
			},
			// handleUploadPress: function (oEvent) {
			// 	var that = this;
			// 	var sModel = oEvent.getSource().getModel("BoardCharter");
			// 	var file = oEvent.getParameter("files")[0];
			// 	console.log(oEvent.getSource().getBindingContext("BoardCharter"));
			// 	var sBindingPath = oEvent.getSource().getBindingContext("BoardCharter").getPath(); // oEvent.get
			// 	var sPath = "proof_cmis_id";
			// 	// var sPath = oEvent.getSource().getParent().getFields()[1].mBindingInfos.text.binding.sPath;
			// 	if (file !== '') {
			// 		if (file !== "") {
			// 			var sendpath = that.club_dms_id;
			// 			RepoService.uploadFile(file, sendpath).then(function (param1, param2) {

			// 				var filename = param1.properties['cmis:name'].value;
			// 				sModel.setProperty(sBindingPath + "/" + sPath, sendpath + "/Evaluation/" + filename);
			// 			});

			// 		}
			// 	}
			// },

			handleUploadPress: function (oEvent) {

				var that=this;
				var sPath = 'proof_cmis_id';
				var sModel = oEvent.getSource().getModel("BoardCharter");
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
				var sBindingPath = oEvent.getSource().getBindingContext("BoardCharter").sPath;
				// console.log(sBindingPath);
				var file = oEvent.getParameter("files")[0];
				// console.log(file);
				if (file != "") {

					var sendpath = that.club_dms_id;
					RepoService.uploadFile(file, sendpath).then(function (param1, param2) {
						var filename = param1.properties["cmis:name"].value;
					console.log(filename);
						// sModel.setProperty(sBindingPath + "/proof_cmis_id1", filename);
						sModel.setProperty(sBindingPath + "/" + sPath, sendpath + "/Evaluation/" +   filename);

						if (sModel.getPendingChanges()) {
							return new Promise(function (fnResolve) {
								sap.m.MessageBox.confirm(oResourceBundle.getText("ConfirmEditSubmit"), {
									title: oResourceBundle.getText("Confirm"),
									actions: [
										oResourceBundle.getText("Confirm"),
										oResourceBundle.getText("cancel")
									],
									onClose: function (sActionClicked) {
										if (sActionClicked === oResourceBundle.getText("Confirm")) {
											sModel.submitChanges({
												success: function (param) {
													sap.m.MessageToast.show(oResourceBundle.getText("Success"));
												},
												error: function (param) {}
											});
											self._oDialog.close();
										} else {
											sModel.resetChanges(); // oBusy.close();
										}
									}
								});
							}).catch(function (err) {
								if (err !== undefined) {
									MessageBox.error(err);
								}
							});
						}
					});
				}
			},
			formaturllist: function (url) {
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
			
			/**
			 *@memberOf pwc.portal.eval.ClubEvaluations.view.Applications.BoardCharter.controller.Page1
			 */
			onPress1: function (oEvent) {
				var sDialogName = "EditPolicy";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new EditPolicy(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("BoardCharter");
				oDialog._oControl.setBindingContext(context, "BoardCharter");
				oDialog.open();
			},
			/**
			 *@memberOf pwc.portal.eval.ClubEvaluations.view.Applications.BoardCharter.controller.Page1
			 */
			onPress2: function (oEvent) {
				var sDialogName = "EditProcedure";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new EditProcedure(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("BoardCharter");
				oDialog._oControl.setBindingContext(context, "BoardCharter");
				oDialog.open();

			},
			onPress3: function (oEvent) {
				var sDialogName = "EditData";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new EditData(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("BoardCharter");
				oDialog._oControl.setBindingContext(context, "BoardCharter");
				oDialog.open();

			}
		});
	}, /* bExport= */
	true);
sap.ui.define([
		"../../../../controller/BaseController",
		"sap/m/MessageBox",
		"./Dialog1",
		"./Dialog2",
		"./Dialog2b",
		"./Dialog3b",
		"./Dialog4b",
		"./Dialog3",
		"./Dialog4",
		"./utilities",
		"sap/ui/core/routing/History",
		"pwc/portal/eval/ClubEvaluations/service/RepoService",
		"sap/m/library"
	], function (BaseController, MessageBox, Dialog1, Dialog2, Dialog2b, Dialog3b, Dialog4b, Dialog3, Dialog4, Utilities, History,
		RepoService, MLibrary) {
		"use strict";
		var URLHelper = MLibrary.URLHelper;
		return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.CommercialBusinessPlan.controller.Page1", {
			club_dms_id: '',
			handleRouteMatched: function (oEvent) {
				var sAppId = "App624c064f1cfbfb01d2bf6b0d";
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
			editCommercial: function (oEvent) {
				var sDialogName = "Dialog1";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new Dialog1(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("CommercialPlan");
				oDialog._oControl.setBindingContext(context, "CommercialPlan");
				oDialog.open();
			},
			// editCommercial: function (oEvent) {
			// var sDialogName = "Dialog1";
			// this.mDialogs = this.mDialogs || {};
			// var oDialog = this.mDialogs[sDialogName];
			// if (!oDialog) {
			// 	oDialog = new Dialog1(this.getView());
			// 	this.mDialogs[sDialogName] = oDialog;
			// 	// For navigation.
			// 	oDialog.setRouter(this.oRouter);
			// }
			// var oContext = this.getView().getModel("CommercialPlan").createEntry("COMMERCIALSITUATION");
			// oDialog._oControl.setBindingContext(oContext, "CommercialPlan");
			// oDialog.open();
			// },

			addServices: function (oEvent) {
				var sDialogName = "Dialog2";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new Dialog2(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				var oContext = this.getView().getModel("CommercialPlan").createEntry("COMMERCIALSERVICES");
				oDialog._oControl.setBindingContext(oContext, "CommercialPlan");
				oDialog.open();
			},
			onPress2: function (oEvent) {
				var sDialogName = "Dialog2b";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new Dialog2b(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("CommercialPlan");
				oDialog._oControl.setBindingContext(context, "CommercialPlan");
				oDialog.open();
			},
			editServices: function (oEvent) {
				var sDialogName = "Dialog2";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new Dialog2(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("CommercialPlan");
				oDialog._oControl.setBindingContext(context, "CommercialPlan");
				oDialog.open();
			},
			// deleteServices: function (oEvent) {
			//     var sPath = oEvent.getSource().getParent().getBindingContext("CommercialPlan").getPath();
			//     if (sPath) {
			//         return new Promise(function (fnResolve, fnReject) {
			//             oEvent.getSource().getParent().getModel("CommercialPlan").remove(sPath, {
			//                 success: function (oData) {
			//                     fnResolve();
			//                     sap.m.MessageToast.show("Entry Has been Deleted!", {
			//                         onClose: fnResolve,
			//                         duration: 0 || 3000
			//                     });
			//                     return;
			//                 },
			//                 error: function (oError) {
			//                     sap.m.MessageBox.show(oError.message.value, {
			//                         icon: sap.m.MessageBox.Icon.ERROR,
			//                         title: "oError"
			//                     });
			//                     return;
			//                 }
			//             });
			//             oEvent.getSource().getParent().getModel("CommercialPlan").refresh();
			//         }).catch(function (err) {
			//             if (err !== undefined) {
			//                 MessageBox.error(err.message);
			//             }
			//         });
			//     }
			// },
			deleteServices: function (oEvent) {
				var that = this,
					sPath = oEvent.getSource().getParent().getBindingContext("CommercialPlan").getPath(),
					oModel = that.getView().getModel("CommercialPlan");
				MessageBox.confirm("Do you want to delete the selected item?", {
					onClose: function (oAction) {
						if (oAction === sap.m.MessageBox.Action.OK) {
							oModel.remove(sPath, {
								success: function (oData) {
									sap.m.MessageToast.show("Selected Item has been deleted");
									oModel.refresh();
								},
								error: function (oError) {
									sap.m.MessageToast.show("cannot be deleted");
								}
							});
						}
					}
				});
			},
			addGoals: function (oEvent) {
				var sDialogName = "Dialog3";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new Dialog3(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				var oContext = this.getView().getModel("CommercialPlan").createEntry("COMMERCIALGOALS");
				oDialog._oControl.setBindingContext(oContext, "CommercialPlan");
				oDialog.open();
			},
			editGoals: function (oEvent) {
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
				var context = oEvent.getSource().getBindingContext("CommercialPlan");
				oDialog._oControl.setBindingContext(context, "CommercialPlan");
				oDialog.open();
			},
			deleteGoals: function (oEvent) {
				var that = this,
					sPath = oEvent.getSource().getParent().getBindingContext("CommercialPlan").getPath(),
					oModel = that.getView().getModel("CommercialPlan");
				MessageBox.confirm("Do you want to delete the selected item?", {
					onClose: function (oAction) {
						if (oAction === sap.m.MessageBox.Action.OK) {
							oModel.remove(sPath, {
								success: function (oData) {
									sap.m.MessageToast.show("Selected Item has been deleted");
									oModel.refresh();
								},
								error: function (oError) {
									sap.m.MessageToast.show("cannot be deleted");
								}
							});
						}
					}
				});
			},
			addRisks: function (oEvent) {
				var sDialogName = "Dialog4";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new Dialog4(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				var oContext = this.getView().getModel("CommercialPlan").createEntry("COMMERCIALRISKS");
				oDialog._oControl.setBindingContext(oContext, "CommercialPlan");
				oDialog.open();
			},
			editRisks: function (oEvent) {
				var sDialogName = "Dialog4";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new Dialog4(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("CommercialPlan");
				oDialog._oControl.setBindingContext(context, "CommercialPlan");
				oDialog.open();
			},
			deleteentry: function (oEvent) {
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
				var that = this,
					sPath = oEvent.getSource().getParent().getBindingContext("CommercialPlan").getPath(),
					oModel = that.getView().getModel("CommercialPlan");
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
			handleUploadPress1: function (oEvent) {
				var that = this;
				var sPath = 'proof_cmis_id1';
				var DomRef = this.getView().byId("Fiveyearupload").getFocusDomRef();
				var sModel = oEvent.getSource().getModel("CommercialPlan");
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
				var sBindingPath = oEvent.getSource().getBindingContext("CommercialPlan").sPath;
				// console.log(sBindingPath);
				var file = oEvent.getParameter("files")[0];
				// console.log(file);
				if (file != "") {

					var sendpath = that.club_dms_id;
					RepoService.uploadFile(file, sendpath).then(function (param1, param2) {
						var filename = param1.properties["cmis:name"].value;
						console.log(filename);
						// sModel.setProperty(sBindingPath + "/proof_cmis_id1", filename);
						sModel.setProperty(sBindingPath + "/" + sPath, sendpath + "/Evaluation/" + filename);
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

			openlink1: function (oEvent) {
				var that = this;
				var sLink = '';
				var filename = oEvent.getSource().getText();
				RepoService.getRepoId().then(function (ReposId) {
					// sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + filename;
					sLink = that.club_dms_id + "/Evaluation/" + filename;

					window.open(sLink);
				});
			},
			previewbutton1: function (oEvent) {
				var sLink = "";
				var filename = this.byId("Investmentcompupload").getValue();
				console.log(filename);
				RepoService.getRepoId().then(function (ReposId) {
					sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + filename;
					window.open(sLink);
				});
			},

			handleUploadPress2: function (oEvent) {
				var that = this;
				var sPath = 'proof_cmis_id2';
				// var DomRef = this.getView().byId("Fiveyearupload").getFocusDomRef();
				var sModel = oEvent.getSource().getModel("CommercialPlan");
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
				var sBindingPath = oEvent.getSource().getBindingContext("CommercialPlan").sPath;
				// console.log(sBindingPath);
				var file = oEvent.getParameter("files")[0];
				// console.log(file);
				if (file != "") {

					var sendpath = that.club_dms_id;
					RepoService.uploadFile(file, sendpath).then(function (param1, param2) {
						var filename = param1.properties["cmis:name"].value;
						console.log(filename);
						// sModel.setProperty(sBindingPath + "/proof_cmis_id1", filename);
						sModel.setProperty(sBindingPath + "/" + sPath, sendpath + "/Evaluation/" + filename);
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
			handleUploadPressCOMMERCIAL: function (oEvent) {
				debugger;

				var that = this;
				var sPath = 'board_proof_cmis';

				var DomRef = this.getView().byId("Exceluploadcommercial").getFocusDomRef();
				var sModel = oEvent.getSource().getModel("CommercialPlan");
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

				try {
					var sBindingPath = oEvent.getSource().getBindingContext("CommercialPlan").sPath;
				} catch (err) {
					sap.m.MessageBox.error(oResourceBundle.getText("Error"))
				}

				var file = oEvent.getParameter("files")[0];
				// console.log(file);
				if (file != "") {

					var sendpath = that.club_dms_id;
					RepoService.uploadFile(file, sendpath).then(function (param1, param2) {
						var filename = param1.properties["cmis:name"].value;

						sModel.setProperty(sBindingPath + "/" + sPath, sendpath + "/Evaluation/" + filename);
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
			openlink2: function (oEvent) {
				var sLink = "";
				var filename = oEvent.getSource().mProperties.text;
				RepoService.getRepoId().then(function (ReposId) {
					sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + filename;
					window.open(sLink);
				});
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
			onInit: function () {
				var that = this;
				this.getOwnerComponent().getModel("User").read("/UserClub", {
					success: function (oData) {
						that.club_dms_id = oData.results[0].club_dms_id;
					},
					error: function (oError) {}
				});
				this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				this.getOwnerComponent().getModel("CommercialPlan").read("/COMMERCIALSITUATION", {
					success: function (oData) {
						console.log(oData.results.slice(-1).pop().id);
						that.getView().byId("commercialsit").bindElement("CommercialPlan>/COMMERCIALSITUATION(" + oData.results.slice(-1).pop().id +
							"l)");
						that.getView().byId("commercialdisting").bindElement("CommercialPlan>/COMMERCIALSITUATION(" + oData.results.slice(-1).pop().id +
							"l)");
						that.getView().byId("Fiveyearupload").bindElement("CommercialPlan>/COMMERCIALSITUATION(" + oData.results.slice(-1).pop().id +
							"l)");
						that.getView().byId("openfiveyear").bindElement("CommercialPlan>/COMMERCIALSITUATION(" + oData.results.slice(-1).pop().id +
							"l)");
						that.getView().byId("Investmentcompupload").bindElement("CommercialPlan>/COMMERCIALSITUATION(" + oData.results.slice(-1).pop()
							.id + "l)");
						that.getView().byId("investopenlink").bindElement("CommercialPlan>/COMMERCIALSITUATION(" + oData.results.slice(-1).pop().id +
							"l)");
					},
					error: function (oError) {}
				}); // this.oRouter.getTarget("Page1").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

				this.getOwnerComponent().getModel("CommercialPlan").read("/COMMERCIALRANK", {
					success: function (oData) {

						console.log(oData.results.slice(-1).pop().id);

						that.getView().byId("Exceluploadcommercial").bindElement("CommercialPlan>/COMMERCIALRANK(" + oData.results.slice(-1).pop()
							.id + "l)");
						that.getView().byId("Exceluploadlinkcommercial").bindElement("CommercialPlan>/COMMERCIALRANK(" + oData.results.slice(-1).pop()
							.id +
							"l)");
						that.getView().byId("Exceluploadlink2commercial").bindElement("CommercialPlan>/COMMERCIALRANK(" + oData.results.slice(-1).pop()
							.id +
							"l)");
					},
					error: function (oError) {}

				});

			},
			/**
			 *@memberOf pwc.portal.eval.ClubEvaluations.view.Applications.CommercialBusinessPlan.controller.Page1
			 */
			rowpress3: function (oEvent) {
				var sDialogName = "Dialog3b";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new Dialog3b(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("CommercialPlan");
				oDialog._oControl.setBindingContext(context, "CommercialPlan");
				oDialog.open();
			},
			/**
			 *@memberOf pwc.portal.eval.ClubEvaluations.view.Applications.CommercialBusinessPlan.controller.Page1
			 */
			onpress4: function (oEvent) {
				var sDialogName = "Dialog4b";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new Dialog4b(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("CommercialPlan");
				oDialog._oControl.setBindingContext(context, "CommercialPlan");
				oDialog.open();
			}
		});
	}, /* bExport= */
	true);
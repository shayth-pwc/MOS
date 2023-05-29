sap.ui.define([
		'pwc/portal/eval/ClubEvaluations/controller/BaseController',
		"./NewStrategicGoal",
		"./NewInitiative",
		"./NewKpi",
		"./NewCompetitionAnalysis",
		"./SwotAnalysis",
		"./ReviewNewGoal",
		"./ReviewNewInitiative",
		"./ReviewNewKpi",
		"./ReviewSwotAnalysis",
		"./ReviewCompetitionAnalysis",

		"sap/ui/core/routing/History",
		"../model/formatter",
		"pwc/portal/eval/ClubEvaluations/service/RepoService",
		"sap/m/MessageBox"
	], function (BaseController, NewStrategicGoal, NewInitiative, NewKpi, NewCompetitionAnalysis, SwotAnalysis, ReviewNewGoal,
		ReviewNewInitiative, ReviewNewKpi, ReviewSwotAnalysis, ReviewCompetitionAnalysis,
		History, formatter, RepoService, MessageBox) {
		"use strict";
		return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.OfficialClubStrategy.controller.WizardPage", {
			club_dms_id: '',

			formatter: formatter,
			onInit: async function () {
				this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				this.getRouter().getRoute("OfficialClubStrategy").attachPatternMatched(await this.evaluationStart, this);
				debugger;

				this.getOwnerComponent().getModel("OfficialClub").read("/ClubBasicInfo2", {
					success: function (oData) {
						console.log(oData.results.slice(-1).pop().id);

						that.getView().byId("textvision").bindElement("OfficialClub>/ClubBasicInfo2(" + oData.results.slice(-1).pop().id + "l)");
						that.getView().byId("textmessage").bindElement("OfficialClub>/ClubBasicInfo2(" + oData.results.slice(-1).pop().id + "l)");

					},
					error: function (oError) {}

				});

				this.getOwnerComponent().getModel("OfficialClub").read("/ClubStrategyRank", {
					success: function (oData) {
						console.log(oData);

						console.log(oData.results.slice(-1).pop().id);

						that.getView().byId("Excelupload").bindElement("OfficialClub>/ClubStrategyRank(" + oData.results.slice(-1).pop().id + "l)");
						that.getView().byId("Exceluploadlink").bindElement("OfficialClub>/ClubStrategyRank(" + oData.results.slice(-1).pop().id +
							"l)");
						that.getView().byId("Exceluploadlink2").bindElement("OfficialClub>/ClubStrategyRank(" + oData.results.slice(-1).pop().id +
							"l)");
					},
					error: function (oError) {}

				});

				var that = this;
				this.getOwnerComponent().getModel("User").read("/UserClub", {
					success: function (oData) {
						that.club_dms_id = oData.results[0].club_dms_id;
					},
					error: function (oError) {}
				});
			},
			renderPDF: function (oEvent) {
				//Generate the token
				var modeldata = oEvent.getSource().getBindingContext("OfficialClub").sPath;

				var data = this.getOwnerComponent().getModel("OfficialClub").getProperty(modeldata);
				console.log(data);

				//Build the xml data with the data from the model
				// console.log(data.activity_name);

				var xmldata = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><topmostSubform><TextField1>" + data.INITIATIVE_OWNER_NAME +
					"</TextField1><TextField3>" + data.initiative_title + "</TextField3><TextField2>" + data.RELATED_GOAL_TITLE +
					"</TextField2><DateField1>" + data.initiative_start_date + "</DateField1><DateField2>" + data.initiative_end_date +
					"</DateField2><TextField6>" + data.initiative_resources_needed + "</TextField6><TextField5>" + data.initiative_budget_amount +
					"</TextField5><TextField4>" + data.initiative_description + "</TextField4></topmostSubform>";

				var encdata = btoa(unescape(encodeURIComponent(xmldata)));
				//prepare the render API call. Pick up the template from template store
				var jsondata = "{  " + "\"xdpTemplate\": \"" + "11a/11a" + "\", " + "\"xmlData\": \"" + encdata + "\"}";
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
			handleRouteMatched: function (oEvent) {
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
			_onWizardComplete: function (oEvent) {},

			openlink: function (oEvent) {
				var that = this;
				var sLink = '';
				var filename = oEvent.getSource().getText();
				RepoService.getRepoId().then(function (ReposId) {
					// sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + filename;
					sLink = that.club_dms_id + "/ClubProfile/" + filename;

					window.open(sLink);
				});
			},

			_onaddstrgoal: function (oEvent) {
				var sDialogName = "NewStrategicGoal";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new NewStrategicGoal(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var oContext = this.getView().getModel("OfficialClub").createEntry("/ClubStrategyGoals");
				oDialog._oControl.setBindingContext(oContext, "OfficialClub");
				oDialog._Event = oEvent.getSource().getId();
				oDialog.open();
			},
			//========================================================
			//========<< Add Str Initiatives >>========================
			//=======================================================
			addstrategicinit: function (oEvent) {
				var sDialogName = "NewInitiative";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new NewInitiative(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var oContext = this.getView().getModel("OfficialClub").createEntry("/clubstrategyinitiatives");
				oDialog._oControl.setBindingContext(oContext, "OfficialClub");
				oDialog._Event = oEvent.getSource().getId();
				oDialog.open();
			},
			//========================================================
			//========<< Add DialogStrKpi >>========================
			//=======================================================
			addstrategickpi: function (oEvent) {
				var sDialogName = "NewKpi";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new NewKpi(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var oContext = this.getView().getModel("OfficialClub").createEntry("/clubstrategykpi");
				oDialog._oControl.setBindingContext(oContext, "OfficialClub");
				oDialog._Event = oEvent.getSource().getId();
				oDialog.open();
			},
			//========================================================
			//========<< Add DialogStrAnalysis >>========================
			//=======================================================
			addcompetana: function (oEvent) {
				var sDialogName = "NewCompetitionAnalysis";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new NewCompetitionAnalysis(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var oContext = this.getView().getModel("OfficialClub").createEntry("/clubstrategycomp", {
					properties: {
						competition_cmis_id: ""
					}
				});
				oDialog._oControl.setBindingContext(oContext, "OfficialClub");
				oDialog._Event = oEvent.getSource().getId();
				oDialog.open();
			},
			//========================================================
			//========<< Add DialogStrSwot >>========================
			//=======================================================
			addswotana: function (oEvent) {
				var sDialogName = "SwotAnalysis";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new SwotAnalysis(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var oContext = this.getView().getModel("OfficialClub").createEntry("/clubstrategyswot", {
					properties: {
						id: "0",
						club_id: "0",
						season: "",
						strength: "",
						weakness: "",
						opportunity: "",
						threat: "",
						creation_date_time: new Date(),
						changed_date_time: new Date(),
						swot_cmis_id: "",
						created_by: "hazem",
						//sap.ushell.Container.getService("UserInfo").getId()
						changed_by: ""
					}
				});
				oDialog._oControl.setBindingContext(oContext, "OfficialClub");
				oDialog._Event = oEvent.getSource().getId();
				oDialog.open();
			},
			//-------------------------------------------------------
			//========================================================
			//========<< Edit DialogStrGoal >>========================
			//=======================================================
			// onEditGoalRow: function (oEvent) {
			// 	var sDialogName = "NewStrategicGoal";
			// 	this.mDialogs = this.mDialogs || {};
			// 	var oDialog = this.mDialogs[sDialogName];
			// 	if (!oDialog) {
			// 		oDialog = new NewStrategicGoal(this.getView());
			// 		this.mDialogs[sDialogName] = oDialog;
			// 		// For navigation.
			// 		oDialog.setRouter(this.oRouter);
			// 	}
			// 	// Set the Binding Context to the Dialog
			// 	var context = oEvent.getSource().getParent().getBindingContext("OfficialClub");
			// 	oDialog._oControl.setBindingContext(context, "OfficialClub");
			// 	oDialog._Event = oEvent.getSource().getId();
			// 	oDialog.open();
			// },
			onEditGoalRow: function (oEvent) {
				var sDialogName = "NewStrategicGoal";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new NewStrategicGoal(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("OfficialClub");
				oDialog._oControl.setBindingContext(context, "OfficialClub");
				oDialog._Event = oEvent.getSource().getId();
				oDialog.open();
			},

			onViewGoalRow: function (oEvent) {
				var sDialogName = "NewStrategicGoal";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new NewStrategicGoal(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("OfficialClub");
				oDialog._oControl.setBindingContext(context, "OfficialClub");
				oDialog._Event = oEvent.getSource().getId();
				oDialog.open();
			},
			//========================================================
			//========<< Edit DialogStrSwot >>========================
			//=======================================================
			onEditSwotRow: function (oEvent) {
				var sDialogName = "SwotAnalysis";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new SwotAnalysis(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("OfficialClub");
				oDialog._oControl.setBindingContext(context, "OfficialClub");
				oDialog._Event = oEvent.getSource().getId();
				oDialog.open();
			},
			//========================================================
			//========<< Edit DialogStrComp >>========================
			//=======================================================
			onEditCompRow: function (oEvent) {
				var sDialogName = "NewCompetitionAnalysis";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new NewCompetitionAnalysis(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("OfficialClub");
				oDialog._Event = oEvent.getSource().getId();
				oDialog._oControl.setBindingContext(context, "OfficialClub");
				oDialog.open();
			},
			//========================================================
			//========<< Edit DialogStrComp >>========================
			//=======================================================
			onEditKPIRow: function (oEvent) {
				var sDialogName = "NewKpi";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new NewKpi(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("OfficialClub");
				oDialog._oControl.setBindingContext(context, "OfficialClub");
				oDialog._Event = oEvent.getSource().getId();
				oDialog.open();
			},
			//=======================================================
			//========<< Edit DialogStrInitiative >>=================
			//=======================================================
			onEditInitiativeRow: function (oEvent) {
				var sDialogName = "NewInitiative";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new NewInitiative(this.getView());
					this.mDialogs[sDialogName] = oDialog;
					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				// Set the Binding Context to the Dialog
				var context = oEvent.getSource().getBindingContext("OfficialClub");
				oDialog._oControl.setBindingContext(context, "OfficialClub");
				oDialog._Event = oEvent.getSource().getId();
				oDialog.open();
			},
			//-------------------------------------------------------
			//========================================================
			//========<< Remove Row >>================================
			//========================================================
			onRemoveRow: function (oEvent) {
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
				var that = this,
					sPath = oEvent.getSource().getParent().getBindingContext("OfficialClub").getPath(),
					oModel = that.getView().getModel("OfficialClub");
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

			/*	addclubinfo: function(oEvent) {

			var sDialogName = "Dialog9";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Dialog9(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
	var oContext = this.getView().getModel("OfficialClub").createEntry("/WEBSITEDETAILS", {
				properties: {
					id: '-1',
					club_id:Math.floor(Math.random() * 1000) + "" ,
					website_link: "",
					website_description: "",
					creation_date_time: new Date(),
					changed_date_time: new Date(),
					created_by: sap.ushell.Container.getService("UserInfo").getId(),
					changed_by: sap.ushell.Container.getService("UserInfo").getId(),
					CREATED_BY_NAME: sap.ushell.Container.getService("UserInfo").getId(),
					CHANGED_BY_NAME: sap.ushell.Container.getService("UserInfo").getId(),
				}
			});

			oDialog._oControl.setBindingContext(oContext, "OfficialClub");
			oDialog.open();

		},*/
			editclubinfo: function (e) {
				var t = "Dialog9";
				this.mDialogs = this.mDialogs || {};
				var i = this.mDialogs[t];
				if (!i) {
					i = new Dialog9(this.getView());
					this.mDialogs[t] = i;
					i.setRouter(this.oRouter)
				}
				var o = e.getSource().getBindingContext("OfficialClub");
				i._oControl.setBindingContext(o);
				i.open()
			},
			handleUploadPress2: function (oEvent) {
				debugger;

				var that = this;
				var sPath = 'board_proof_cmis';

				// var DomRef = this.getView().byId("Exceluploadcommercial").getFocusDomRef();
				var sModel = oEvent.getSource().getModel("OfficialClub");
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

				try {
					var sBindingPath = oEvent.getSource().getBindingContext("OfficialClub").sPath;
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
			_onRowSwotPress: function (oEvent) {

				var sDialogName = "ReviewSwotAnalysis";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new ReviewSwotAnalysis(this.getView());
					this.mDialogs[sDialogName] = oDialog;

					// For navigation.
					oDialog.setRouter(this.oRouter);
				}

				var context = oEvent.getSource().getBindingContext("OfficialClub");
				oDialog._oControl.setBindingContext(context, "OfficialClub");
				oDialog._Event = oEvent.getSource().getId();
				oDialog.open();

			},

			_onRowCompetitionPress: function (oEvent) {

				var sDialogName = "ReviewCompetitionAnalysis";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new ReviewCompetitionAnalysis(this.getView());
					this.mDialogs[sDialogName] = oDialog;

					// For navigation.
					oDialog.setRouter(this.oRouter);
				}

				var context = oEvent.getSource().getBindingContext("OfficialClub");
				oDialog._oControl.setBindingContext(context, "OfficialClub");
				oDialog._Event = oEvent.getSource().getId();
				oDialog.open();

			},

			_onRowKPIPress: function (oEvent) {

				var sDialogName = "ReviewNewKPI";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new ReviewNewKpi(this.getView());
					this.mDialogs[sDialogName] = oDialog;

					// For navigation.
					oDialog.setRouter(this.oRouter);
				}

				var context = oEvent.getSource().getBindingContext("OfficialClub");
				oDialog._oControl.setBindingContext(context, "OfficialClub");
				oDialog._Event = oEvent.getSource().getId();
				oDialog.open();

			},
			_onRowInitiativePress: function (oEvent) {

				var sDialogName = "ReviewNewInitiative";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new ReviewNewInitiative(this.getView());
					this.mDialogs[sDialogName] = oDialog;

					// For navigation.
					oDialog.setRouter(this.oRouter);
				}

				var context = oEvent.getSource().getBindingContext("OfficialClub");
				oDialog._oControl.setBindingContext(context, "OfficialClub");
				oDialog._Event = oEvent.getSource().getId();
				oDialog.open();

			},
			onViewGoalRow: function (oEvent) {

				var sDialogName = "ReviewNewGoal";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new ReviewNewGoal(this.getView());
					this.mDialogs[sDialogName] = oDialog;

					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				var context = oEvent.getSource().getBindingContext("OfficialClub");
				oDialog._oControl.setBindingContext(context, "OfficialClub");
				oDialog._Event = oEvent.getSource().getId();
				oDialog.open();

			},

		});
	}, /* bExport= */
	true);
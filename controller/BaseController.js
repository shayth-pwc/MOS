sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/core/routing/History",
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/core/Core",
	"sap/m/library",
	"pwc/portal/eval/ClubEvaluations/service/RepoService",
], function (Controller, UIComponent, History, Filter, FilterOperator, JSONModel, formatter, Core, mobileLibrary, RepoService) {
	"use strict";
	var URLHelper = mobileLibrary.URLHelper;
	return Controller.extend("pwc.portal.eval.ClubEvaluations.controller.BaseController", {
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		club_base_dms_id: '',
		formatter: formatter,
		onAddFilter: async function (oEvent) {

			if (typeof sap.ui.getCore().AppContext === 'undefined') {
				await this.evaluationStart();

			} else {

				var evaluation = sap.ui.getCore().AppContext.evaluation,
					club_id = evaluation.club_id;
				oEvent.getSource().getBinding("items").filter(
					[
						new sap.ui.model.Filter("creation_date_time", sap.ui.model.FilterOperator.BT, evaluation.period_start_date_time, evaluation.period_end_date_time),
						new sap.ui.model.Filter("club_id", sap.ui.model.FilterOperator.EQ, club_id)
					]
				);
			}
		},
		onClubFilter: async function (oEvent) {
			if (typeof sap.ui.getCore().AppContext === 'undefined') {
				await this.evaluationStart();

			} else {

				var evaluation = sap.ui.getCore().AppContext.evaluation,
					club_id = evaluation.club_id;
				oEvent.getSource().getBinding("items").filter(
					[
						new sap.ui.model.Filter("club_id", sap.ui.model.FilterOperator.EQ, club_id)
					]
				);
			}
		},
		SelectedItems: function (sStatus, sCriteria_score) {
			var sSelected,
				that = this,
				oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			if (sStatus === 'Success') {

				that.byId("CriteriaList").setHeaderText(oResourceBundle.getText("EvaluationCriteriaScore", sCriteria_score));
				sSelected = "Success";
			} else {
				sSelected = "None";
			}
			return sSelected;
		},

		evaluationStart: async function () {

			var that = this,
				oBusy = new sap.m.BusyDialog(),
				Editable;

			if (typeof sap.ui.getCore().AppContext === 'undefined') {
				oBusy.open();

				return new Promise(function (resolve) {
					that.getView().getModel().read("/Evaluations", {
						async: false,
						success: function (oData) {
							that.setEvaluation(oData.results[0]);
							this._oViewModel = new JSONModel(oData.results[0]);
							that.getView().setModel(this._oViewModel, "viewModel");

							Editable = oData.results[0].Editable;
							oBusy.close();
							if (Editable === "X") {
								that.getOwnerComponent().getRouter().navTo("noEvaluation");

							}
						},
						error: function (oError) {
							oBusy.close();
						}
					});
					resolve("");
				});

			}
		},
		setAppContext: function (sKey, sValue) {
			if (typeof sap.ui.getCore().AppContext === 'undefined') {
				sap.ui.getCore().AppContext = new Object();
				sap.ui.getCore().AppContext.Review = {};
			}
			sap.ui.getCore().AppContext.Review[sKey] = sValue;
		},
		setEvaluation: function (sEval) {
			this.evaluation = sEval;
			if (typeof sap.ui.getCore().AppContext === 'undefined') {
				sap.ui.getCore().AppContext = new Object();

			}
			sap.ui.getCore().AppContext.evaluation = sEval;
		},
		getEvaluation: function (sEval) {
			if (typeof sap.ui.getCore().AppContext === 'undefined') {
				this.evaluationStart();

			} else {
				return sap.ui.getCore().AppContext.evaluation;
			}
		},
		getAppContext: function (sKey) {
			if (typeof sap.ui.getCore().AppContext === 'undefined') {
				return false;
			}
			try {
				return sap.ui.getCore().AppContext.Review[sKey];
			} catch (e) {

			}

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
		onReviewPress: function () {
			this.getOwnerComponent().getRouter().navTo("Review");
		},
		_Hide_SideNavigation: function () {
			//this.byId("SideNavigation").setVisible(false);	
			//			$("#" + this.byId("SideNavigation").getId() ).css('display', 'none');

		},
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},
		onCriteria: function (oEvent) {
			//debugger;;

			var that = this,
				Hash = this.getRouter().oHashChanger.hash.split("/"), //this.oRouter.getHashChanger().hash.split("/"),
				oEntry = {},
				oListEvent = oEvent,
				oModel = that.getView().getModel(),
				selectedScore = 0,
				idf = Math.floor(Math.random() * 100) + Math.floor(Math.random() * 100),
				oBusy = new sap.m.BusyDialog(),
				oResourceBundle = this.getView().getModel("i18n").getResourceBundle(),
				oListCount = oListEvent.getSource().getAggregation("items").length,

				oListItems = oListEvent.getSource().getAggregation("items");
			if (!this.oSubmitDialog) {
				this.oSubmitDialog = new sap.m.Dialog({
					type: sap.m.DialogType.Message,
					title: oResourceBundle.getText("Confirm"),
					content: [
						new sap.m.Label({
							text: oResourceBundle.getText("scoreconfirmation"),
							labelFor: "submissionNote" + idf
						}),
						new sap.m.TextArea("submissionNote" + idf, {
							width: "100%",
							placeholder: oResourceBundle.getText("addComment"),
							liveChange: function (oEvent) {
								var sText = oEvent.getParameter("value");
								//this.oSubmitDialog.getBeginButton().setEnabled(sText.length > 0);
							}.bind(this)
						})
					],
					beginButton: new sap.m.Button({
						type: sap.m.ButtonType.Emphasized,
						text: oResourceBundle.getText("submit"),
						enabled: true,
						press: function () {
							var SelfReview_Comments = Core.byId("submissionNote" + idf).getValue();

							oBusy.open();
							try {

								for (var r = 0; r < oListCount; r++) {
									if (oListItems[r].getSelected()) {
										selectedScore = parseInt(oListItems[r].getTitle().charAt(0));
										oEntry = {
											Club_ID: '0',
											//		Item: '0',
											Evaluation_Type: sap.ui.getCore().AppContext.evaluation.period_type,
											Evaluation_Module: Hash[1],
											Evaluation_Form: Hash[3],
											Evaluation_Period: sap.ui.getCore().AppContext.evaluation.period_name,
											Evaluation_Season: sap.ui.getCore().AppContext.evaluation.season_id,
											id: sap.ui.getCore().AppContext.evaluation.id + "",
											SelfReview_Rating: selectedScore.toFixed(2),
											SelfReview_Comments: SelfReview_Comments,
											Reviewer1_Rating: parseInt(-1).toFixed(2),
											Reviewer1_Comments: '',
											Reviewer2_Rating: parseInt(-1).toFixed(2),
											Reviewer2_Comments: '',
											AddlReviewer_Rating: parseInt(-1).toFixed(2),
											AddlReviewer_Comments: '',
											FinalReviewer_Rating: parseInt(-1).toFixed(2),
											FinalReviewer_Comments: '',
											EXCEPTION_REQ: "0",
											LastChanged_by: '',
											LastChanged_Date: new Date(),
											Creation_Date: new Date(),
											Created_By: '',
											//	Header_ID: '0'
										};

										oListItems[r].setHighlight('Success');

										that.byId("CriteriaList").setHeaderText(oResourceBundle.getText("EvaluationCriteriaScore", oListItems[r]
											.getTitle().charAt(0)));

										oModel.create("/EvalItems", oEntry, {
											success: function (oData) {
												that.evaluationStart();
												sap.m.MessageToast.show(oResourceBundle.getText("SUCCESSMSG"));

												oModel.refresh();
												oBusy.close();

												return;
											},
											error: function (oError) {
												oBusy.close();
												sap.m.MessageBox.show(JSON.parse(oError.responseText).error.message.value, {
													icon: sap.m.MessageBox.Icon.ERROR,
													title: oResourceBundle.getText("Error")
												});
												return;
											}
										});

									} else {

										oListItems[r].setHighlight('None');
									}
								}
							} catch (e) {
								sap.m.MessageBox.show(oResourceBundle.getText("TryAgain"), {
									icon: sap.m.MessageBox.Icon.ERROR,
									title: oResourceBundle.getText("Error")
								});
								oBusy.close();
								this.evaluationStart();
							}

							this.oSubmitDialog.close();
						}.bind(this)
					}),
					endButton: new sap.m.Button({
						text: oResourceBundle.getText("cancel"),
						press: function () {
							this.oSubmitDialog.close();
						}.bind(this)
					})
				});
			}

			this.oSubmitDialog.open();

		},
		Evaluation_Criteria: function (oEvent) {
			try {

				var that = this,
					form_id = sap.ui.core.UIComponent.getRouterFor(this).getHashChanger().hash.split("/")[3];

				oEvent.getSource().getBinding("items").filter([new sap.ui.model.Filter("form_id", sap.ui.model.FilterOperator.EQ,
					form_id)]);
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
				var listOfitems = oEvent.getSource().getAggregation("items");

				listOfitems.forEach(function (Item, Index) {
					if (Item.getBindingContext().getObject().Selected === "Success") {
						oEvent.getSource().setHeaderText(oResourceBundle.getText("EvaluationCriteriaScore", Item.getBindingContext().getObject().criteria_score
							.charAt(0)));

					}
				});

				this.getView().getModel().refresh(true);
			} catch (e) {}

		},
		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler  for navigating back.
		 * It checks if there is a history entry. If yes, history.go(-1) will happen.
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				// The history contains a previous entry
				history.go(-1);
			} else {
				// Otherwise we go backwards with a forward history
				var bReplace = true;
				this.getRouter().navTo("master", {}, bReplace);
			}
		},
		onChange: function (oEvent) {

			if (this.byId("ExcepSwitch").getState() == true) {
				this.byId("FragmentUploader").setVisible(true);
				this.byId("Exceplink").setVisible(true);
				this.byId("CriteriaList").setVisible(false);

			} else {
				this.byId("FragmentUploader").setVisible(false);
				this.byId("Exceplink").setVisible(false);
				this.byId("CriteriaList").setVisible(true);

			}

		},
		handleExcepUploadPress: function (oEvent) {

			var oContext = this.getModel().createEntry("/EvalItems");

			var that = this,
				Hash = this.getRouter().oHashChanger.hash.split("/"), //this.oRouter.getHashChanger().hash.split("/"),
				oEntry = {},
				oListEvent = oEvent,
				oModel = that.getView().getModel(),
				selectedScore = 0,
				idf = Math.floor(Math.random() * 100) + Math.floor(Math.random() * 100),
				oBusy = new sap.m.BusyDialog(),
				oResourceBundle = this.getView().getModel("i18n").getResourceBundle(),
				file = oEvent.getParameter("files")[0],
				uploadpath;
			if (file !== '') {
				if (file !== "") {
					var sendpath = that.club_base_dms_id;
					RepoService.uploadFile(file, sendpath).then(function (param1, param2) {

						var filename = param1.properties['cmis:name'].value;
						if (filename != "") {
							//debugger;;
							uploadpath = sendpath + "/Evaluation/" + filename;
						}
					});

					sap.m.MessageBox.confirm(oResourceBundle.getText('confirmationmsg'), {
						title: oResourceBundle.getText('confirmation'),
						actions: [oResourceBundle.getText('confirm'), oResourceBundle.getText('cancel')],
						onClose: function (sActionClicked) {
							if (sActionClicked === oResourceBundle.getText('confirm')) {
								if (!this.oSubmitExcepDialog) {
									this.oSubmitExcepDialog = new sap.m.Dialog({
										type: sap.m.DialogType.Message,
										title: oResourceBundle.getText("Confirm"),
										content: [
											new sap.m.Label({
												text: oResourceBundle.getText("scoreconfirmation"),
												labelFor: "ExcepsubmissionNote" + idf
											}),
											new sap.m.TextArea("ExcepsubmissionNote" + idf, {
												width: "100%",
												placeholder: oResourceBundle.getText("addComment"),
												liveChange: function (oEvent) {
													var sText = oEvent.getParameter("value");
													//this.oSubmitDialog.getBeginButton().setEnabled(sText.length > 0);
												}.bind(this)
											})
										],
										beginButton: new sap.m.Button({
											type: sap.m.ButtonType.Emphasized,
											text: oResourceBundle.getText("submit"),
											enabled: true,
											press: function () {
												var SelfReview_Comments = Core.byId("ExcepsubmissionNote" + idf).getValue();

												oBusy.open();
												try {

													oEntry = {
														Club_ID: sap.ui.getCore().AppContext.evaluation.club_id,
														//		Item: '0',
														Evaluation_Type: sap.ui.getCore().AppContext.evaluation.period_type,
														Evaluation_Module: Hash[1],
														Evaluation_Form: Hash[3],
														Evaluation_Period: sap.ui.getCore().AppContext.evaluation.period_name,
														Evaluation_Season: sap.ui.getCore().AppContext.evaluation.season_id,
														id: sap.ui.getCore().AppContext.evaluation.id + "",
														SelfReview_Rating: "0",
														SelfReview_Comments: SelfReview_Comments,
														Reviewer1_Rating: "-1",
														Reviewer1_Comments: '',
														Reviewer2_Rating: "-1",
														Reviewer2_Comments: '',
														AddlReviewer_Rating: "-1",
														AddlReviewer_Comments: '',
														FinalReviewer_Rating: "-1",
														FinalReviewer_Comments: '',
														EXCEPTION_REQ: "1",
														LastChanged_by: '',
														LastChanged_Date: new Date(),
														Creation_Date: new Date(),
														Created_By: '',
														ATTACHMENT_PROOF_CMIS: uploadpath
															//	Header_ID: '0'
													};

													oModel.create("/EvalItems", oEntry, {
														success: function (oData) {

															//debugger;;
															that.evaluationStart();
															sap.m.MessageToast.show(oResourceBundle.getText("SUCCESSMSG"));
															// that.getView().byId("Exceplink").bindElement("/EvalItems(id="+oData.id+"l,Club_ID="+oData.Club_ID+"l,Evaluation_Form='"+oData.Evaluation_Form+"')");	
															// that.getView().byId("ExcepSwitch").bindElement("/EvalItems(id="+oData.id+"l,Club_ID="+oData.Club_ID+"l,Evaluation_Form='"+oData.Evaluation_Form+"')");
															that.Evaluation_Exception();
															// oModel.refresh();
															oBusy.close();

															return;
														},
														error: function (oError) {
															oBusy.close();
															sap.m.MessageBox.show(JSON.parse(oError.responseText).error.message.value, {
																icon: sap.m.MessageBox.Icon.ERROR,
																title: oResourceBundle.getText("Error")
															});
															return;
														}
													});

												} catch (e) {
													sap.m.MessageBox.show(oResourceBundle.getText("TryAgain"), {
														icon: sap.m.MessageBox.Icon.ERROR,
														title: oResourceBundle.getText("Error")
													});
													oBusy.close();
													that.evaluationStart();
												}

												this.oSubmitExcepDialog.close();
											}.bind(this)
										}),
										endButton: new sap.m.Button({
											text: oResourceBundle.getText("cancel"),
											press: function () {
												that.byId("ExcepSwitch").setState(false);
												that.onChange();
												this.oSubmitExcepDialog.close();
											}.bind(this)
										})
									});
								}

								this.oSubmitExcepDialog.open();

								oModel.refresh();
							} else {
								that.byId("ExcepSwitch").setState(false);

								that.onChange();
								oModel.resetChanges();
								oModel.refresh();
							}
						}
					});

					// if (!oModel.hasPendingChanges()) {
					// 	sap.m.MessageBox.information(oResourceBundle.getText("noChanges"));
					// 	return;
					// } else {

					// }

				}
			}
		},
		Evaluation_Exception: function (oEvent) {
			try {
				//debugger;;
				var that = this,
					form_id = that.getRouter().getHashChanger().hash.split("/")[3];
				var newFilter = [
					new sap.ui.model.Filter("Evaluation_Form", sap.ui.model.FilterOperator.EQ, form_id),
					new sap.ui.model.Filter("Evaluation_Period", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().AppContext.evaluation.period_name),
					new sap.ui.model.Filter("Club_ID", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().AppContext.evaluation.club_id)

				];
				that.getView().getModel().read("/EvalItems", {
					filters: newFilter,
					success: function (oData) {
						try {

							that.getView().byId("Exceplink").bindElement("/EvalItems(id=" + oData.results.slice(-1).pop().id + "l,Club_ID=" + oData.results
								.slice(-1).pop().Club_ID + "l,Evaluation_Form='" + oData.results.slice(-1).pop().Evaluation_Form + "')");
							if (oData.results.slice(-1).pop().EXCEPTION_REQ == 1) {
								that.getView().byId("CriteriaList").setVisible(false);
								that.getView().byId("Exceplink").setVisible(true);
							} else {
								that.getView().byId("CriteriaList").setVisible(true);
								that.getView().byId("Exceplink").setVisible(false);
							}

							that.getView().byId("ExcepSwitch").bindElement("/EvalItems(id=" + oData.results.slice(-1).pop().id + "l,Club_ID=" + oData.results
								.slice(-1).pop().Club_ID + "l,Evaluation_Form='" + oData.results.slice(-1).pop().Evaluation_Form + "')");

						} catch (err) {}
					},
					error: function (oError) {

					}
				});

				this.getView().getModel().refresh(true);
			} catch (e) {}

			this.getOwnerComponent().getModel("User").read("/UserClub", {
				success: function (oData) {
					that.club_base_dms_id = oData.results[0].club_dms_id;
				},
				error: function (oError) {}
			});

		},
		Newuploadcheck: function (oEvent) {
			var that = this;
			var form_id = sap.ui.core.UIComponent.getRouterFor(this).getHashChanger().hash.split("/")[3];

			var newFilter = [
				new sap.ui.model.Filter("Form", sap.ui.model.FilterOperator.EQ, form_id),
				new sap.ui.model.Filter("active", sap.ui.model.FilterOperator.EQ, "true"),

			];
			try {
				this.getOwnerComponent().getModel("hints").read("/NewForms", {

					filters: newFilter,

					success: function (oData) {
						console.log(oData);
						if (!oData.results.slice(-1).pop()) {

							that.getView().byId("labeltext").setVisible(false);
							that.getView().byId("UploadNewBoardReq").setVisible(false);
							that.getView().byId("UploadNewBoardReqLink").setVisible(false);

						} else {
							that.getView().byId("UploadNewBoardReq").bindElement("hints>/NewForms(" + oData.results.slice(-1).pop().id + "l)");
							that.getView().byId("UploadNewBoardReqLink").bindElement("hints>/NewForms(" + oData.results.slice(-1).pop().id + "l)");
						}

					},
					error: function (oError) {}
				});
			} catch (e) {
				// debugger;
			}

		},

		UploadNewBoardReq: function (oEvent) {
			var that = this;
			var sPath = 'attachment_link';
			var sModel = oEvent.getSource().getModel("hints");
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var sBindingPath = oEvent.getSource().getBindingContext("hints").sPath;
			var file = oEvent.getParameter("files")[0];
			if (file != "") {

				var sendpath = that.club_base_dms_id;
				RepoService.uploadFile(file, sendpath).then(function (param1, param2) {
					var filename = param1.properties["cmis:name"].value;
					console.log(filename);
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

		addHistoryEntry: (function () {
			var aHistoryEntries = [];

			return function (oEntry, bReset) {
				if (bReset) {
					aHistoryEntries = [];
				}

				var bInHistory = aHistoryEntries.some(function (oHistoryEntry) {
					return oHistoryEntry.intent === oEntry.intent;
				});

				if (!bInHistory) {
					aHistoryEntries.push(oEntry);
					this.getOwnerComponent().getService("ShellUIService").then(function (oService) {
						oService.setHierarchy(aHistoryEntries);
					});
				}
			};
		})()

	});

});
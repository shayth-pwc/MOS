sap.ui.define([
	"pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"sap/ui/core/Core",
	"sap/ui/layout/HorizontalLayout",
	"sap/ui/layout/VerticalLayout",
	"sap/m/Dialog"

], function (BaseController, Core, HorizontalLayout, VerticalLayout, Dialog) {
	"use strict";

	return BaseController.extend("pwc.portal.eval.ClubEvaluations.controller.Review", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf pwc.portal.eval.ClubEvaluations.view.Review
		 */

		onInit: function () {
			try {
				this.getRouter().getRoute("Review").attachPatternMatched(this.onMatched, this);
				this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				this._oRouter.attachRouteMatched(this.onMatched, this);

			} catch (e) {}
		},

		onMatched: async function (oEvent) {
			var that = this,
				oBusy = new sap.m.BusyDialog();
			oBusy.open();
			that.getView().getModel().read("/Evaluations", {
				async: false,
				success: function (oData) {
					that.setEvaluation(oData.results[0]);

					var period_type = oData.results[0].period_type;
					if (period_type === "M") {
						that.byId("list").getBinding("items").filter([new sap.ui.model.Filter("eval_type", sap.ui.model.FilterOperator.EQ,
							period_type)]);
					} else {
						that.byId("list").getBinding("items").filter([new sap.ui.model.Filter("eval_type", sap.ui.model.FilterOperator.NE,
							"M")]);
					}
					if (period_type === "Q") {
						if (oData.results[0].REMANING !== '0') {
							that.byId("submitEvaluation").setEnabled(false);
						} else {
							that.byId("submitEvaluation").setEnabled(true);
						}
					}

					that.byId("list").getModel().refresh();
					oBusy.close();
				},
				error: function (oError) {
					oBusy.close();
				}
			});

		},
		onMasterPressed: function (oEvent) {
			try {
				var that = this,
					oContext = oEvent.getParameter("listItem").getBindingContext();
				var sPath = oContext.getPath();
				//	oContext.getModel().setProperty(sPath, true);
				var sKey = oContext.getObject().app_name;
				this.getRouter().navTo(sKey, {
					CATEGORY_ID: oContext.getObject().category_id,
					MODULE_ID: oContext.getObject().module_id,
					form_id: oContext.getObject().FormIndex,
					AppName: sKey
				});
			} catch (e) {
				sap.m.MessageToast.show("الشاشة غير مفعلة", {
					duration: 0 || 3000
				});
				this.getRouter().navTo("notFound");
			}
		},
		onListFilter: function (oEvent) {
			try {
				var period_type = sap.ui.getCore().AppContext.evaluation.period_type;
				if (period_type === "M") {
					oEvent.getSource().getBinding("items").filter([new sap.ui.model.Filter("eval_type", sap.ui.model.FilterOperator.EQ,
						period_type)]);
				} else {
					oEvent.getSource().getBinding("items").filter([new sap.ui.model.Filter("eval_type", sap.ui.model.FilterOperator.NE,
						"M")]);
				}

				if (period_type === "Q") {
					if (sap.ui.getCore().AppContext.evaluation.REMANING !== '0') {
						this.byId("submitEvaluation").setEnabled(false);
					} else {
						this.byId("submitEvaluation").setEnabled(true);
					}
				}

			} catch (e) {}

		},

		onSubmitEvaluation: function (oEvent) {
				var that = this,
					oModel = that.getView().getModel(),
					oEval = sap.ui.getCore().AppContext.evaluation,
					oEntry = {};

				if (!this.oConfirmDialog) {
					this.oConfirmDialog = new Dialog({
						type: sap.m.DialogType.Message,
						width: '450px',
						title: "التأكيد",
						content: [

							new VerticalLayout({
								content: [
									new HorizontalLayout({
										content: [

											new sap.m.TextArea("confirmationNote", {
												width: "500px",
												height: "600px",
												editable: false,
												value: "أقر وأتعهد أنا الموضح بياناتي أدناه بصحة البيانات والمستندات التي تم ارفاقها. واتحمل المسؤولية في حال ثبوت عدم صحة البيانات المستندات المرفقة، وأكون بذلك عرضة للمسألة القانونية وفقاً للأنظمة واللوائح المتبعة."

											}),
										]
									}),
									new HorizontalLayout({
										content: [
											new sap.m.CheckBox("confirmationz", {
												select: function (oEvent) {
													var sText = oEvent.getParameter("selected");

													this.oConfirmDialog.getBeginButton().setEnabled(sText);
													// if (sap.ui.getCore().AppContext.evaluation.REMANING !== '0') {
													// 	this.oConfirmDialog.getBeginButton().setEnabled(false);
													// }
												}.bind(this)
											}),
											new sap.m.Label({
												width: "400px",
												text: "أوافق على الشروط ",
												labelFor: "confirmationz"
											}),
										]
									}),
								]
							})
						],

						beginButton: new sap.m.Button({
							type: sap.m.ButtonType.Emphasized,
							text: "إرسال التقييم",
							enabled: false,

							press: function () {
								var oBusy = new sap.m.BusyDialog();
								oEntry = {
									"id": '1',
									"Club_Id": '1',
									"Evaluation_Type": oEval.period_type,
									"Eval_Period": oEval.period_name,
									"Season": oEval.season_id,
									"Initiator": "X",
									"Creation_Date": new Date(),
									"Current_WF_Status": "X",
									"Completion_Date": new Date(),
									"Completed_By": "X",
									"eval_id": oEval.id.toString(),
									"eval_header_id": '1', //oEval.Header_ID
									"Disclaimer": 'X',
									"Editable": 'X',
									"SelfReview": 'X',
									"Club_Name": '',
									"Season_Name": '',
									"Initiator_Name": '',
									"Completed_By_Name": '',
									"Eval_Title": ''

								};

								oModel.create("/WFHeader", oEntry, {
									success: function (oData) {
										oBusy.close();
										sap.m.MessageBox.show(that.getResourceBundle().getText("SUCCESSMSG"), {
											icon: sap.m.MessageBox.Icon.SUCCESS,
											title: that.getResourceBundle().getText("SUCCESS")
										});
										return;
									},
									error: function (oError) {
										oBusy.close();
										sap.m.MessageBox.show(JSON.parse(oError.responseText).error.message.value, {
											icon: sap.m.MessageBox.Icon.ERROR,
											title: that.getResourceBundle().getText("Error")
										});
										return;
									}
								});
								this.oConfirmDialog.close();
							}.bind(this)
						}),
						endButton: new sap.m.Button({
							text: "إلغاء",
							press: function () {
								this.oConfirmDialog.close();
							}.bind(this)
						})
					});
				}

				this.oConfirmDialog.open();

			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf pwc.portal.eval.ClubEvaluations.view.Review
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf pwc.portal.eval.ClubEvaluations.view.Review
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf pwc.portal.eval.ClubEvaluations.view.Review
		 */
		//	onExit: function() {
		//
		//	}

	});

});
sap.ui.define([
	"pwc/portal/eval/ClubEvaluations/controller/BaseController",
	"sap/m/MessageBox"
], function (BaseController, MessageBox) {
	"use strict";
	var sController;
	return BaseController.extend("pwc.portal.eval.ClubEvaluations.view.Applications.PowerScales.controller.Main", {
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
		onInit: function () {

			var that = this;
			this.getOwnerComponent().getModel("RacyMatrix").read("/CLUB_ORG_STRUC_OrgUpload", {
				success: function (oData) {

					that.getView().byId("orgupload").bindElement("RacyMatrix>/CLUB_ORG_STRUC_OrgUpload(" + oData.results.slice(-1).pop().id + "l)");

				},
				error: function (oError) {}
			});

			// this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// this.oRouter.getTarget("evaluation").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			this._JsonModel = this.getOwnerComponent().getModel('JsonModel');
			this._JsonModel.setProperty("/EditMood", false);
			this._JsonModel.setProperty("/DisplayMood", true);
			this.oModel = this.getOwnerComponent().getModel("RacyMatrix");
			sController = this;
			//---------------------------------------------------------------
			//---------<< Evaluation_Module >>----------------------------
			var oProcTemplate = new sap.ui.core.Item({
				key: "{RacyMatrix>value}",
				text: "{RacyMatrix>value}"
			});
			var oProcedure = new sap.m.ComboBox({
				value: "{RacyMatrix>procedure_name}"
			});
			oProcedure.bindItems({
				path: "RacyMatrix>/Optional_Procedures",
				length: 5000,
				template: oProcTemplate,
				templateShareable: false
			});

			// var oDepartmentTemplate = new sap.ui.core.Item({
			// 	key: "{RacyMatrix>club_dept_name}",
			// 	text: "{RacyMatrix>club_dept_name}",
			// 	length: 5000
			// });
			// var oDepartment = new sap.m.ComboBox({
			// 	value: "{RacyMatrix>related_department}"
			// });
			// oDepartment.bindItems({
			// 	path: "RacyMatrix>/CLUB_ORG_STRUC_DEP",
			// 	length: 5000,

			// 	template: oDepartmentTemplate,
			// 	templateShareable: false
			// });

			///Responsible Person
			var oResponsiblePersonTemplate = new sap.ui.core.Item({
				key: "{RacyMatrix>emp_name}",
				text: "{RacyMatrix>emp_name}",
				length: 5000
			});
			var oResponsiblePerson = new sap.m.ComboBox({
				value: "{RacyMatrix>responsible_person}"
			});
			oResponsiblePerson.bindItems({
				path: "RacyMatrix>/DEPS_EMPS",
				length: 5000,

				template: oResponsiblePersonTemplate,
				templateShareable: false
			});
			///Accountable Person

			var oAccountablePersonTemplate = new sap.ui.core.Item({
				key: "{RacyMatrix>emp_name}",
				text: "{RacyMatrix>emp_name}",
				length: 5000
			});
			var oAccountablePerson = new sap.m.ComboBox({
				value: "{RacyMatrix>accountable_person}"
			});
			oAccountablePerson.bindItems({
				path: "RacyMatrix>/DEPS_EMPS",
				length: 5000,
				template: oAccountablePersonTemplate,
				templateShareable: false
			});
			///Consulted Person

			var oConsultedPersonTemplate = new sap.ui.core.Item({
				key: "{RacyMatrix>emp_name}",
				text: "{RacyMatrix>emp_name}",
				length: 5000
			});
			var oConsultedPerson = new sap.m.ComboBox({
				value: "{RacyMatrix>consulted_person}"
			});
			oConsultedPerson.bindItems({
				path: "RacyMatrix>/DEPS_EMPS",
				length: 5000,
				template: oConsultedPersonTemplate,
				templateShareable: false
			});
			///Informed Person
			var oInformedPersonTemplate = new sap.ui.core.Item({
				key: "{RacyMatrix>emp_name}",
				text: "{RacyMatrix>emp_name}",
				length: 5000
			});
			var oInformedPerson = new sap.m.ComboBox({
				value: "{RacyMatrix>informed_person}"
			});
			oInformedPerson.bindItems({
				path: "RacyMatrix>/DEPS_EMPS",
				template: oInformedPersonTemplate,
				length: 5000,
				templateShareable: false
			});
			this.oEditableTempRacyMatrix = new sap.m.ColumnListItem({
				cells: [
					oProcedure,
					// oDepartment,
					oResponsiblePerson,
					oAccountablePerson,
					oConsultedPerson,
					oInformedPerson,

					new sap.m.Button({
						press: function (oEvent) {
							var sPath = oEvent.getSource().getParent().getBindingContext("RacyMatrix").getPath();
							var sContext = oEvent.getSource().getParent().getBindingContext("RacyMatrix");
							var id = oEvent.getSource().getParent().getBindingContext("RacyMatrix").getProperty('id');
							var oResourceBundle = this.getModel("i18n").getResourceBundle();
							var oModel = sController.getOwnerComponent().getModel("RacyMatrix");
							if (sPath && id !== '-1') {
								sap.m.MessageBox.confirm(oResourceBundle.getText('confirmatiodeletenmsg'), {
									title: oResourceBundle.getText('confirmation'),
									actions: [oResourceBundle.getText('confirm'), oResourceBundle.getText('cancel')],
									onClose: function (sActionClicked) {
										// fnResolve(sActionClicked === oResourceBundle.getText('confirm'));
										if (sActionClicked === oResourceBundle.getText('confirm')) {
											oModel.remove(sPath, {
												success: function (param, param1) {
													sap.m.MessageToast.show(oResourceBundle.getText('removeitemmsg'));
												},
												error: function (oError) {

												}
											});
										}
									}
								});

							} else if (id === '-1') { // In Case this Item is just added and not saved yet
								sController.zdeleteCreatedEntry(oModel, sContext);
								this.getParent().getParent().removeItem(this.getParent());
							}
						},
						icon: "sap-icon://delete",
						type: "Reject",
						visible: "{JsonModel>/EditMood}",
						class: "DeleteButton"
					})
				]
			});

			this.oDisplayTempRacyMatrix = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Text({
						text: "{RacyMatrix>procedure_name}"
							// }), new sap.m.Text({
							// 	text: "{RacyMatrix>related_department}"
					}), new sap.m.Text({
						text: "{RacyMatrix>responsible_person}"
					}), new sap.m.Text({
						text: "{RacyMatrix>accountable_person}"
					}), new sap.m.Text({
						text: "{RacyMatrix>consulted_person}"
					}), new sap.m.Text({
						text: "{RacyMatrix>informed_person}"
					})
					// , new sap.m.Text({
					// 	text: "{path:'RacyMatrix>start_date_time',type: 'sap.ui.model.type.DateTime', formatOptions: { style: 'short', pattern: 'MMM dd,yyyy'}}"
					// }),
					// new sap.m.Text({
					// 	text: "{path:'RacyMatrix>end_date_time',type: 'sap.ui.model.type.DateTime', formatOptions: { style: 'short', pattern: 'MMM dd,yyyy'}}"
					// })
				]
			});
			this.RebindTable("racymatrixTable", "RacyMatrix>/RacyMatrix", this.oDisplayTempRacyMatrix, "Navigation");
		},
		//==================================================
		//===<< Rebinding Edit Mode >>======================
		//==================================================
		RebindTable: function (sTable, sPath, oTemplate, sKeyboardMode) {
			var Table = this.getView().byId(sTable);
			Table.bindItems({
				path: sPath,
				template: oTemplate,
				templateShareable: true
			}).setKeyboardMode(sKeyboardMode);
		},
		//==================================================
		//===<< Edit Mode >>================================
		//==================================================
		OnEditPress: function (oEvent) {
			this._JsonModel.setProperty("/EditMood", true);
			this._JsonModel.setProperty("/DisplayMood", false);
			this._JsonModel.refresh();
			this.RebindTable("racymatrixTable", "RacyMatrix>/RacyMatrix", this.oEditableTempRacyMatrix, "Edit");
		},
		//==================================================
		//===<< Save Mode >>================================
		//==================================================
		OnSavePress: function (oEvent) {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var oModel = this.oModel;
			var that = this;
			if (oModel.getPendingChanges()) {
				return new Promise(function (fnResolve) {
					sap.m.MessageBox.confirm(oResourceBundle.getText('confirmationmsg'), {
						title: oResourceBundle.getText('confirmation'),
						actions: [oResourceBundle.getText('confirm'), oResourceBundle.getText('cancel')],
						onClose: function (sActionClicked) {
							if (sActionClicked === oResourceBundle.getText('confirm')) {
								var checker = that._onSubmitCheck();
								if (checker == false) {
									oModel.submitChanges({
										success: function (param) {
											sap.m.MessageToast.show(oResourceBundle.getText('changeitemmsg'));
											that.onInit();
										},
										error: function (param) {}
									});
								}
							}
						}
					});
				}).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err);
					}
				});
			}
		},
		//==================================================
		//===<< Cancel Mode >>================================
		//==================================================
		OnCancelPress: function () {
			this._JsonModel.setProperty("/EditMood", false);
			this._JsonModel.setProperty("/DisplayMood", true);
			// this.RebindTable("racymatrixTable", "RacyMatrix>/RacyMatrix", this.oEditableTempRacyMatrix, "Edit");
			this.RebindTable("racymatrixTable", "RacyMatrix>/RacyMatrix", this.oDisplayTempRacyMatrix, "Navigation");

			this._JsonModel.refresh();
			this.oModel.resetChanges(); //([this._oControl.getBindingContext().getPath()], undefined, /*bDeleteCreatedEntities*/ true);
		},

		onAddRowRacyMatrix: function (oEvent) {
			var sItem;
			var oContext = this.oModel.createEntry("/RacyMatrix", {
				properties: {
					id: '-1',
					procedure_name: '',
					responsible_person: '',
					accountable_person: '',
					consulted_person: '',
					informed_person: '',
					creation_date_time: new Date(),
					// start_date_time: new Date(),
					// end_date_time: new Date(),
					changed_date_time: new Date(),
					created_by: sap.ushell.Container.getService("UserInfo").getId() || '',
					changed_by: sap.ushell.Container.getService("UserInfo").getId() || '',
					// language: sap.ui.getCore().getConfiguration().getLanguage() || 'en'
				}
			});
			sItem = this.oEditableTempRacyMatrix.clone();
			sItem.setBindingContext(oContext, 'RacyMatrix');
			this.byId('racymatrixTable').addItem(sItem);
		},
		//===========================================
		//=====<< Validation Handling >>=============
		//===========================================
		_onSubmitCheck: function () {
			var sError = false;
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var aControls = this.getView().getControlsByFieldGroupId("inputs");
			var aSelects = this.getView().getControlsByFieldGroupId("select");
			aControls.forEach(function (Field) {
				if (typeof Field.getRequired === "function") {
					if (Field.getRequired()) {
						if (typeof Field.getValue === "function") {
							if (!Field.getValue() || Field.getValue().length < 1) {
								Field.setValueState("Error");
								Field.setValueStateText(oResourceBundle.getText('errorfield'));
								sError = true;
							} else {
								Field.setValueState("None");
							}
						}
					}
				}
			});
			aSelects.forEach(function (Field) {
				if (typeof Field.getRequired === "function") {
					if (Field.getRequired()) {
						if (typeof Field.getSelectedKey === "function") {
							if (!Field.getSelectedKey() || Field.getSelectedKey().length < 1) {
								Field.setValueState("Error");
								Field.setValueStateText(oResourceBundle.getText('errorfield'));
								sError = true;
							} else {
								Field.setValueState("None");
							}
						}
					}
				}
			});
			return sError;
		},
		//====================================================
		//=======<< Delete Created Entry on Client Side>>=====
		//====================================================
		zdeleteCreatedEntry: function (oModel, oContext) {
			var sGroupId, sKey, sPath,
				that = oModel;
			if (oContext) {
				sPath = oContext.getPath();
				sKey = oContext.getPath().substr(1);
				sGroupId = that._resolveGroup(sKey).groupId;
				that.oMetadata.loaded().then(function () {
					that.abortInternalRequest(sGroupId, {
						requestKey: sKey
					});
				});
				that._removeEntity(sKey);
				//cleanup Messages for created Entry
				sap.ui.getCore().getMessageManager().removeMessages(
					that.getMessagesByEntity(oContext.getPath(), true));
				if (that.mDeferredRequests['changes']) {
					if (that.mDeferredRequests['changes'].changes) {
						if (that.mDeferredRequests['changes'].changes.undefined) {
							if (that.mDeferredRequests['changes'].changes.undefined.length > 0) {
								for (var i in that.mDeferredRequests['changes'].changes.undefined) {
									if (that.mDeferredRequests['changes'].changes.undefined[i].request.deepPath === sPath) {
										that.mDeferredRequests['changes'].changes.undefined.splice(i, 1);
									}
								}
							}
						}
					}
					if (oModel.mDeferredRequests['changes'].map[sKey]) {
						delete oModel.mDeferredRequests['changes'].map[sKey];
					}
				}

			}
		},

		// onPressImportTableData: function (oEvent) {
		// 	var oFile = oEvent.getParameter("files")[0];
		// 	var that = this;

		// 	if (oFile && window.FileReader) {
		// 		var reader = new FileReader();

		// 		try {
		// 			reader.onload = function (e) {
		// 				var data = e.target.result;
		// 				var excelsheet = XLSX.read(data, {
		// 					type: "binary"
		// 				});
		// 				excelsheet.SheetNames.forEach(function (sheetName) {
		// 					//this is the required data in Object format
		// 					var aExcelRow = XLSX.utils.sheet_to_row_object_array(excelsheet.Sheets[sheetName]);
		// 					var aItems = [],
		// 						oRow = {},
		// 						oItem, oField, sValue, sLabel;
		// 					var aDateFields = ["start_date_time", "end_date_time"];	

		// 					//debugger;;

		// 					for (oItem in aExcelRow) {
		// 						oRow["module_name"] = aExcelRow[oItem]["Module ID"];
		// 						oRow["category_name"] = aExcelRow[oItem]["Category ID"];
		// 						oRow["component"] = aExcelRow[oItem]["Component ID"];
		// 						oRow["fragment_name"] = aExcelRow[oItem]["Fragment Name"];
		// 						oRow["fragment_path"] = aExcelRow[oItem]["Fragment Path"];
		// 						oRow["entityset_name"] = aExcelRow[oItem]["Entity Set Name"];
		// 						oRow["eval_type"] = aExcelRow[oItem]["Evaluation Type"];
		// 						oRow["calc_method"] = aExcelRow[oItem]["Calculation Method"];
		// 						oRow["status"] = aExcelRow[oItem]["Status"];
		// 						oRow["xsodata"] = aExcelRow[oItem]["XS oData"];
		// 						oRow["start_date_time"] = that.formatDate(aExcelRow[oItem]["Start Date"]);
		// 						oRow["end_date_time"] = that.formatDate(aExcelRow[oItem]["End Date"]);
		// 						oRow["id"] = '-1';
		// 						oRow.creation_date_time = new Date();
		// 						oRow.changed_date_time = new Date();
		// 						oRow.created_by = sap.ushell ? sap.ushell.Container.getService("UserInfo").getId() : '';

		// 						aItems.push(jQuery.extend({}, oRow));
		// 					}

		// 					var sItem, oContext;

		// 					//debugger;;

		// 					for (var oItem in aItems) {
		// 						oContext = that.oModel.createEntry("/Evaluation_Mapping", {
		// 							properties: aItems[oItem]
		// 						});
		// 						// sItem.setBindingContext(oContext, 'Evaluation');
		// 					}

		// 					that.getView().byId("idSaveBtn").firePress();

		// 				});
		// 			};
		// 		} catch (e) {
		// 			sap.m.MessageToast.show("Error while importing data to table");
		// 		}

		// 		reader.readAsBinaryString(oFile);
		// 	}
		// },

		formatDate: function (sDate) {
			var oDate = null;

			if (sDate) {
				if (typeof sDate === "integer") {
					oDate = Date((sDate - (25567 + 1)) * 86400 * 1000)
				} else if (typeof sDate === "string" && sDate.indexOf("/") > -1) {
					oDate = new Date(parseInt(sDate.match(/\d+/)));
				} else {
					oDate = new Date(sDate);
				}
			}

			return oDate;
		}

		// onDeleteMappingTable: function (oEvent) {
		// 					var sPath = oEvent.getSource().getParent().getBindingContext('Evaluation').getPath();
		// 					var sContext = oEvent.getSource().getParent().getBindingContext('Evaluation');
		// 					var id = oEvent.getSource().getParent().getBindingContext('Evaluation').getProperty('id');
		// 					var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		// 					var oModel = this.getOwnerComponent().getModel('Evaluation');
		// 					if (sPath && id !== '-1') {
		// 						sap.m.MessageBox.confirm(oResourceBundle.getText('confirmatiodeletenmsg'), {
		// 							title: oResourceBundle.getText('confirmation'),
		// 							actions: [oResourceBundle.getText('confirm'), oResourceBundle.getText('cancel')],
		// 							onClose: function (sActionClicked) {
		// 								// fnResolve(sActionClicked === oResourceBundle.getText('confirm'));
		// 								if (sActionClicked === oResourceBundle.getText('confirm')) {
		// 									oModel.remove(sPath, {
		// 										success: function (param, param1) {
		// 											sap.m.MessageToast.show(oResourceBundle.getText('removeitemmsg'));
		// 										},
		// 										error: function (oError) {

		// 										}
		// 									});
		// 								}
		// 							}
		// 						});

		// 					} else if (id === '-1') { // In Case this Item is just added and not saved yet
		// 						sController.zdeleteCreatedEntry(oModel, sContext);
		// 						this.getParent().getParent().removeItem(this.getParent());
		// 					}
		// 				}
	});
});
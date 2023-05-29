sap.ui.define(["sap/ui/base/ManagedObject",
"sap/m/MessageBox",
"./utilities", 
"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService",
	

], function (e, t, n, i,RepoService,MessageBox) {
	return e.extend("pwc.portal.eval.ClubEvaluations.view.Applications.StakeholderMapping.controller.StakeholderActivities", {
		constructor: function (e) {
			this._oView = e;
			this._oControl = sap.ui.xmlfragment(e.getId(), "pwc.portal.eval.ClubEvaluations.view.Applications.StakeholderMapping.view.StakeholderActivities", this);
			this._bInit = false
		},
		exit: function () {
			delete this._oView
		},
		getView: function () {
			return this._oView
		},
		getControl: function () {
			return this._oControl
		},
		getOwnerComponent: function () {
			return this._oView.getController().getOwnerComponent()
		},
		open: function () {
			var e = this._oView;
			var t = this._oControl;
			if (!this._bInit) {
				this.onInit();
				this._bInit = true;
				e.addDependent(t)
			}
			var n = Array.prototype.slice.call(arguments);
			if (t.open) {
				t.open.apply(t, n)
			} else if (t.openBy) {
				t.openBy.apply(t, n)
			}
		},
		close: function () {
			this._oControl.close()
		},
		setRouter: function (e) {
			this.oRouter = e
		},
		getBindingParameters: function () {
			return {}
		},
		_onButtonPress: function (e) {
			var oView = this.getView(),
				that = this,
				oEntry2 = {},
				oController = this,
				status = true,
				requiredFieldInfo = [{
					"id": "activity_description",
					"type": "text",
					"required" :true
				}, {
					"id": "activity_name",
					"type": "text",
					"required" :true
				}, {
					"id": "communication_type",
					"type": "text",
					"required" :true
				}, {
					"id": "future_developments",
					"type": "text",
					"required" :true
				},{
					"id": "frequency_of_communication",
					"type": "select",
					"required" :true
				},{
					"id": "activity_start_date",
					"type": "text",
					"required" :true
				},{
					"id": "activity_end_date",
					"type": "text",
					"required" :true
				}/*,{
				"id": "stakeholder_name",
					"type": "select",
					"required" :true
				}*/
				];
	
			if (requiredFieldInfo.length) {
				status = this.handleChangeValuestate(requiredFieldInfo, oView);
			}
			requiredFieldInfo.forEach(function (item, index, arr) {
				if (item.type === 'text') {
					oEntry2[item.id] = oView.byId(item.id).getValue();

				} else {
					oEntry2[item.id] = oView.byId(item.id).getSelectedKey();
				}
			});
			
			/*oEntry2['id'] = Math.floor(Math.random() * 1000) + "";
			oEntry2['club_id'] = Math.floor(Math.random() * 1000) + "";
			oEntry2['creation_date_time'] = new Date();
			oEntry2['changed_date_time'] = new Date();
			oEntry2['changed_by'] = sap.ushell.Container.getService("UserInfo").getId();
			oEntry2['stakeholder_id'] = that.getView().byId("object").mProperties.unit;//this must be changed to fetch the id of the stakeholder
			// oEntry2['stakeholder_id'] = Math.floor(Math.random() * 1000) + "";
			oEntry2['activity_start_date'] = new Date(); //this needs to be set by user not randomly generated
			oEntry2['activity_end_date'] = new Date();
			oEntry2['created_by'] = sap.ushell.Container.getService("UserInfo").getId();

			console.log(oEntry2);*/
				if (status) {
			var self = this;
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var oModel = this.oModel;
			if (oModel.getPendingChanges()) {
				return new Promise(function (fnResolve) {
					sap.m.MessageBox.confirm(oResourceBundle.getText('ConfirmEditSubmit'), {
						title: oResourceBundle.getText('Confirm'),
						actions: [oResourceBundle.getText('Confirm'), oResourceBundle.getText('cancel')],
						onClose: function (sActionClicked) {
							if (sActionClicked === oResourceBundle.getText('Confirm')) {
								oModel.submitChanges({
									success: function (param) {
										sap.m.MessageToast.show(oResourceBundle.getText('Success'));
									},
									error: function (param) {
										
									}
								});
								self._oDialog.close();
							}
						}
					});
				}).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err);
					}
				});
			}
			}
			/*e = jQuery.extend(true, {}, e);
			return new Promise(function (e) {
				e(true)
			}).then(function (e) {
				var t = this.getView(),
					n = this,
					i = true,
					o = [];
				if (o.length) {
					i = this.handleChangeValuestate(o, t)
				}
				if (i) {
					return new Promise(function (e, i) {
						var o = n.oModel;
						var r = function (e) {
							o.resetChanges();
							i(new Error(e))
						};
						if (o && o.hasPendingChanges()) {
							o.submitChanges({
								success: function (i) {
									var s = i.__batchResponses[0];
									var a = s.__changeResponses && s.__changeResponses[0];
									if (a && a.data) {
										var u = o.getKey(a.data);
										t.unbindObject();
										t.bindObject({
											path: "/" + u
										});
										if (window.history && window.history.replaceState) {
											window.history.replaceState(undefined, undefined, window.location.hash.replace(encodeURIComponent(n.sContext),
												encodeURIComponent(u)))
										}
										o.refresh();
										e()
									} else if (a && a.response) {
										r(a.message)
									} else if (!a && s.response) {
										r(s.message)
									} else {
										o.refresh();
										e()
									}
								},
								error: function (e) {
									i(new Error(e.message))
								}
							})
						} else {
							e()
						}
					})
				}
			}.bind(this)).then(function (e) {
				if (e === false) {
					return false
				} else {
					this.close()
				}
			}.bind(this)).catch(function (e) {
				if (e !== undefined) {
					t.error(e.message)
				}
			})*/
		},
		handleChangeValuestate: function (e, t) {
			var n = true;
			if (e) {
				e.forEach(function (e) {
					var i = t.byId(e.id);
					if (i) {
						i.setValueState("None");
						if (i.getValue() === "") {
							i.setValueState("Error");
							n = false
						} else if (i.getDateValue && !i._bValid) {
							i.setValueState("Error");
							n = false
						}
					}
				})
			}
			return n
		},
		_onButtonPress1: function (e) {
			e = jQuery.extend(true, {}, e);
			return new Promise(function (e) {
				e(true)
			}).then(function (e) {
				return new Promise(function (e) {
					var t, n;
					var i = this.oModel;
					if (i && i.hasPendingChanges()) {
						t = Object.keys(i.mChangedEntities);
						for (var o = 0; o < t.length; o++) {
							n = i.getContext("/" + t[o]);
							if (n && n.bCreated) {
								i.deleteCreatedEntry(n)
							}
						}
						i.resetChanges()
					}
					e()
				}.bind(this))
			}.bind(this)).then(function (e) {
				if (e === false) {
					return false
				} else {
					this.close()
				}
			}.bind(this)).catch(function (e) {
				if (e !== undefined) {
					t.error(e.message)
				}
			})
		},
		onInit: function () {
			this._oDialog = this.getControl();
			this.oModel = this.getOwnerComponent().getModel()
		},
		onExit: function () {
			this._oDialog.destroy()
		},
			handleUploadPress: function (oEvent) {
			var DomRef = this.getView().byId('myFileUploadstakeholderactivity').getFocusDomRef();
			var sModel = this._oControl.getModel();
			var sBindingPath = this.getView().byId('myFileUploadstakeholderactivity').getBindingContext().getPath();
			var file = DomRef.files[0] || '';
			if (file != '') {
				RepoService.uploadFile(file).then(function (param1, param2) {
					var filename = param1.properties['cmis:name'].value;
					sModel.setProperty(sBindingPath + '/proof_cmis_id', filename);
				});
			}
		},
		openlink: function (oEvent) {
			var sLink = '';
			var filename = this.getView().byId('myFileUploadstakeholderactivity').getBindingContext().getProperty('proof_cmis_id');
			RepoService.getRepoId().then(function (ReposId) {
				sLink = "/DMSservice/cmis/json/" + ReposId + "/root" + "/" + filename;
				window.open(sLink);
			});
		}
		
		
		
		
		
		
		
		
		
		
		
		
		
		
	})
}, true);
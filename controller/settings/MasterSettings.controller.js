sap.ui.define([
	"../BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"pwc/portal/eval/ClubEvaluations/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, MessageToast, JSONModel, formatter, Filter, FilterOperator) {
	"use strict";
	return BaseController.extend("pwc.portal.eval.ClubEvaluations.controller.settings.MasterSettings", {
		formatter: formatter,
		cat_id: 0,
		onInit: function () {

			var that = this,
				oRoutes = Object.keys(this.getRouter()._oRoutes);
			that.getRouter().getRoute("Category").attachPatternMatched(that._onObjectMatched, this);

			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.attachRouteMatched(this.handleRouteMatched, this);

			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
			var oList = this.byId("list");
			this._oList = oList;
			// keeps the filter and search state
			this._oListFilterState = {
				aFilter: [],
				aSearch: []
			};

			var Lang = sap.ui.getCore().getConfiguration().getLanguage();
			if (Lang === "ar" || Lang === "AR") {

				jQuery.sap.includeStyleSheet("/css/ar_style.css", "ARStyle");

			} else {
				jQuery.sap.includeStyleSheet("/css/en_style.css", "ARStyle");

			}

		},
		handleRouteMatched: function (oEvent) {
			var sObjectId = oEvent.getParameter("arguments").CATEGORY_ID,
				sMODULE_ID = oEvent.getParameter("arguments").MODULE_ID;
			this.cat_id = sObjectId;
			try {
				this.getModel().metadataLoaded().then(function () {
					this._bindView("/CatList(category_id='" + sObjectId + "',module_id='" + sMODULE_ID + "')");
				}.bind(this));
			} catch (e) {}
			try {
				this.callEvaluationStart();
			} catch (e) {}
		},
		callEvaluationStart: async function () {

			await this.evaluationStart();
		},
		_onObjectMatched: function (oEvent) {

			var sObjectId = oEvent.getParameter("arguments").CATEGORY_ID,
				sMODULE_ID = oEvent.getParameter("arguments").MODULE_ID;
			this.cat_id = sObjectId;
			try {
				this.getModel().metadataLoaded().then(function () {
					this._bindView("/CatList(category_id='" + sObjectId + "',module_id='" + sMODULE_ID + "')");
					//debugger;;
				}.bind(this));
				this.evaluationStart();
			} catch (e) {}

		},
		onListFilter: function (oEvent) {
			oEvent.getSource().getBinding("items").filter();
			try {
				var period_type = sap.ui.getCore().AppContext.evaluation.period_type;
				if (period_type === "M") {
					oEvent.getSource().getBinding("items").filter([new sap.ui.model.Filter("eval_type", sap.ui.model.FilterOperator.EQ,
						"M")]);
				} else {
					oEvent.getSource().getBinding("items").filter([new sap.ui.model.Filter("eval_type", sap.ui.model.FilterOperator.NE,
						"M")]);
				}

				if (this.getAppContext("Editable") === 'X') {
					oEvent.getSource().getBinding("items").filter([new sap.ui.model.Filter("eval_type", sap.ui.model.FilterOperator.NE,
						'X')]);
				}
			} catch (e) {}
		},
		_bindView: function (sObjectPath) {
			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {},
					dataReceived: function () {}
				}
			});
		},

		onMasterPressed: function (oEvent) {
			//debugger;;
			if (this.getAppContext("Editable") === 'X') {
				return;
			}
			try {

				var that = this,
					oContext = oEvent.getParameter("listItem").getBindingContext();
				var sPath = oContext.getPath();
				//	oContext.getModel().setProperty(sPath, true);
				var sKey = oContext.getObject().app_name;
				this.getRouter().navTo(sKey, {
					CATEGORY_ID: that.cat_id,
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
		_onBindingChange: function () {},
		_onMetadataLoaded: function () {},
		onNavButtonPress: function () {
			this.getOwnerComponent().myNavBack();
		},
		onSearch: function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				this.onRefresh();
				return;
			}
			var sQuery = oEvent.getParameter("query");

			if (sQuery) {
				this._oListFilterState.aSearch = [new Filter("Form", FilterOperator.Contains, sQuery)];
			} else {
				this._oListFilterState.aSearch = [];
			}
			this._applyFilterSearch();
		},
		onRefresh: function () {
			this._oList.getBinding("items").refresh();
		},
		_applyFilterSearch: function () {
			var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter);
			this._oList.getBinding("items").filter(aFilters, "Application");
		}
	});
});
sap.ui.define([
	"./BaseController",
	"sap/m/ResponsivePopover",
	"sap/m/MessagePopover",
	"sap/m/ActionSheet",
	"sap/m/Button",
	"sap/m/Link",
	"sap/m/NotificationListItem",
	"sap/m/MessagePopoverItem",
	"sap/ui/core/CustomData",
	"sap/m/MessageToast",
	"sap/ui/Device",
	"../model/formatter",

	"sap/ui/core/syncStyleClass",
	"sap/m/library"
], function (BaseController, ResponsivePopover, MessagePopover, ActionSheet, Button, Link, NotificationListItem, MessagePopoverItem,
	CustomData, MessageToast, Device, formatter, syncStyleClass, mobileLibrary) {
	"use strict";

	CATEGORY_ID: 0;
	MODULE_ID: 0;
	return BaseController.extend("pwc.portal.eval.ClubEvaluations.controller.App", {
		_bExpanded: true,
		formatter: formatter,
		onInit: function () {
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.attachRouteMatched(this.handleRouteMatched, this);
		

		},

	

		handleRouteMatched: function (oEvent) {
			this.evaluationStart();
			if (typeof oEvent.getParameter("arguments").CATEGORY_ID !== 'undefined' && typeof oEvent.getParameter("arguments").MODULE_ID !==
				'undefined') {
				this.CATEGORY_ID = oEvent.getParameter("arguments").CATEGORY_ID,
					this.MODULE_ID = oEvent.getParameter("arguments").MODULE_ID;
				this.byId("SideNavigation").setProperty("selectedKey", this.MODULE_ID + "" + this.CATEGORY_ID);

			} else {
				this.byId("SideNavigation").setProperty("selectedKey", "");

			}

		},
		action: function (oEvent) {
			if (this.getAppContext("Editable") === 'X') {
				return;
			}
			var actionParameters = JSON.parse(oEvent.getSource().data("wiring").replace(/'/g, "\""));
			this.getRouter().navTo("Category", {
				CATEGORY_ID: actionParameters.select.param[0],
				MODULE_ID: actionParameters.select.param[1]
			});

		},
		onCheckEvaluation: function (oEvent) {
			if (this.getAppContext("Editable") === 'X') {
				oEvent.getSource().setVisible(false);
				oEvent.getSource().getParent().setVisible(false);
				oEvent.getSource().getBinding("items").filter([new sap.ui.model.Filter("eval_type", sap.ui.model.FilterOperator.NE,
					'X')]);
				oEvent.getSource().setVisible(false);
				oEvent.getSource().getParent().setVisible(false);
			}
		},
		onCollapse: function (oEvent) {
			var item = oEvent.getParameter('item');
			// this.byId("pageContainer").to(this.getView().createId(item.getKey()));
			if (item.getKey() === "collapser") {
				var toolPage = this.byId("app");
				toolPage.setSideExpanded(!toolPage.getSideExpanded());
				if (toolPage.getSideExpanded()) {
					item.setIcon("sap-icon://close-command-field");
				} else {
					item.setIcon("sap-icon://open-command-field");
				}
			}
		},
		onSideNavButtonPress: function () {
			this.getRouter().navTo("home");
		}
	});
});
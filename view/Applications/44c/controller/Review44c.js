sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"pwc/portal/eval/ClubEvaluations/service/RepoService"
], function (ManagedObject, MessageBox, Utilities, History, RepoService) {

	return ManagedObject.extend("pwc.portal.eval.ClubEvaluations.view.Applications.44c.controller.Review44c", {
		club_dms_id: '',
		constructor: function (oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "pwc.portal.eval.ClubEvaluations.view.Applications.44c.view.Review44c", this);
			this._bInit = false;
		},

		exit: function () {
			delete this._oView;
		},

		getView: function () {
			return this._oView;
		},

		getControl: function () {
			return this._oControl;
		},

		getOwnerComponent: function () {
			return this._oView.getController().getOwnerComponent();
		},

		open: function () {
			var oView = this._oView;
			var oControl = this._oControl;

			if (!this._bInit) {

				// Initialize our fragment
				this.onInit();

				this._bInit = true;

				// connect fragment to the root view of this component (models, lifecycle)
				oView.addDependent(oControl);
			}
			// var date = oView.byId("LastPaymentMonthText").getText();
			// var datearray = date.split("/");
			// var newdate = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
			// var d1 = new Date(newdate);
			// var monthDifference = this.monthDiff(d1, new Date()) + " " + "أشهر";
			// oView.byId("dateDifference").setText(monthDifference);

			var args = Array.prototype.slice.call(arguments);
			if (oControl.open) {
				oControl.open.apply(oControl, args);
			} else if (oControl.openBy) {
				oControl.openBy.apply(oControl, args);
			}
		},
		monthsformater: function (bAvailable) {
			if (bAvailable == '-1') {
				return "";
			} else {
				return bAvailable + "   أشهر";

			}
		},

		close: function () {
			this._oControl.close();
		},

		setRouter: function (oRouter) {
			this.oRouter = oRouter;

		},
		getBindingParameters: function () {
			return {};

		},

		_onButtonPress144c: function () {

			this.close();

		},
		onInit: function () {

			this._oDialog = this.getControl();

			this.oModel = this.getOwnerComponent().getModel("payment");

		},
		onExit: function () {
			this._oDialog.destroy();

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

						var ret = JSON.parse(response).myResult;

						dataget = decodeURIComponent(escape(ret));
						return decodeURIComponent(escape(ret));

					},
					error: function (e) {}
				});

				return dataget;

			}
		},

		myFormatterDate: function (value) {

			var d = new Date(value),
				month = '' + (d.getMonth() + 1),
				day = '' + d.getDate(),
				year = d.getFullYear();

			if (month.length < 2) month = '0' + month;

			if (day.length < 2) day = '0' + day;

			return [year, month, day].join('-');

		},
		monthDiff: function (d1, d2) {
			var months;
			months = (d2.getFullYear() - d1.getFullYear()) * 12;
			months -= d1.getMonth();
			months += d2.getMonth();
			return months <= 0 ? 0 : months;
		}

	});
}, /* bExport= */ true);
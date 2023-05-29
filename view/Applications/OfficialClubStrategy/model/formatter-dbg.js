sap.ui.define([], function () {
	"use strict";
	return {
		GoalText: function (sgoal_type) {
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (sgoal_type) {
				case '0':
					return resourceBundle.getText("DepartmentTypeKey");
				case '1':
					return resourceBundle.getText("GoalTypeKey");
				case '2':
					return resourceBundle.getText("EmployeeTypeKey");
				default:
					return sgoal_type;
			}
		}
	};
});
function initModel() {
	var sUrl = "/portal/portal/portal_eval/EvaluationCore/EvaluationCore.xsodata/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}
sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    'use strict';
    return Controller.extend("gavdi.sandbox.Tami_training_app.controller.PurchaseDetails", {
        
        onInit: function(oEvent){
            var oController = this;
            var oRouter = sap.ui.core.UIComponent.getRouterFor(oController);
            var oPurchaseDetailsRoute = oRouter.getRoute("PurchaseDetailsRoute");

            oPurchaseDetailsRoute.attachMatched(oController.onRouteMatched, oController);
        },
        
        
        
        onRouteMatched: function (oEvent) {
            var oController = this;
            var sServiceURL = "http://sapes4.gavdi.pl:8030/sap/opu/odata/sap/ZODATA_SRV/";
            var sParameters = ""; //"?sap-client=100";

            var oPurchaseModel = new sap.ui.model.odata.v2.ODataModel(sServiceURL + sParameters);
            var sPath = "/WygodnyPurchaseSet"
            var oCallParameters = {
                "$expand": "Basket",
                "sap-client": "100"
            };
            oPurchaseModel.read(sPath, {
                urlParameters: oCallParameters,
                success: function (oData, oResponse) {
                    var oPurchaseModel = new sap.ui.model.json.JSONModel(oData);
                    oController.getView().setModel(oPurchaseModel, "PurchaseModel");

                    var routeId = oEvent.getPatameters();
                    oPurchaseModel.bindRows("PurchaseModel>/results" + routeId + "/Basket/results/");
                },
                error: function (oError) {
                    var a = 9;
                }
            });


        },

        onClickEditPurchaseButton: function()
        {
            
        }
    });
});
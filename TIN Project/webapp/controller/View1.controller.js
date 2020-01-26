sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"sap/m/ButtonType",
], function (Controller, JSONModel, MessageBox, Dialog, ButtonType) 
{
	"use strict";

	return Controller.extend("gavdi.sandbox.Tami_training_app.controller.View1", 
	{
		_myView: {
			view: {}
		},

		_selectedEmployees: {
			selectedEmp: []
		},

		_selectedProducts: {
			selectedProd: []
		},

		_selectedPurchases: {
			selectedPurc: []
		},

		_sServiceURL: "http://sapes4.gavdi.pl:8030/sap/opu/odata/sap/ZODATA_SRV/",
		_sParameters: "?sap-client=100",

		onInit: function () 
		{	
			var oController = this;

			this._myView.view = this.getView();

			var oModelv2 = oController.getModelv2();

			var oEmployeeModel;
			var oProductModel;
		
			var sPath = "/EmployeeSet";

			//ODataModel v2 – wywołanie asynchroniczne
			oModelv2.read(sPath, 
				{
					success: function(oData, oResponse) 
					{
						oEmployeeModel.setData(oData);
					}, 
					error: function(oError) 
					{
						console.log("Employee read in init error");
					}
				}
			);

			sPath = "/ProductSet";
			oModelv2.read(sPath, 
				{
					success: function(oData, oResponse) 
					{
						oProductModel.setData(oData);
					}, 
					error: function(oError) 
					{
						console.log("Product read in init error");
					}
				}
			);
			
			var oEmployeeModel = new JSONModel();
			oController.getView().setModel(oEmployeeModel, "employeeModel");

			var oProductModel = new JSONModel();
			oController.getView().setModel(oProductModel, "productModel")
		},

		getServiceURL: function()
		{
			return this._sServiceURL;
		},

		getParameters: function()
		{
			return this._sParameters;
		},

		getModelv2: function()
		{
			var oModelv2 = new sap.ui.model.odata.v2.ODataModel(this.getServiceURL() + this.getParameters());
			return oModelv2;
		},

		getMyView: function()
		{
			return this._myView.view;
		},
		
		onClickAddButton: function(oEvent)
		{
			var oController = this;
			var oView = oController.getView();
			var oModelv2 = oController.getModelv2();

			var ename = oView.byId("ename").getValue();
			var sname = oView.byId("sname").getValue();
			if(ename != "" && sname != "")
			{
				//console.log(ename + " " + sname);

				oView.byId("ename").setValue("");
				oView.byId("sname").setValue("");

				var sPath = "/EmployeeSet";
				var oModelToRead = "employeeModel";

				var oJsonEntityToSend =
				{
					"EmpId": "",
					"Vorna": ename,
					"Nachn" : sname
				};

				oModelv2.create(sPath, oJsonEntityToSend, 
					{
						success: function(oData, oResponse) 
						{
							oController.readData(oModelv2, sPath, oModelToRead);
						}, 
						error: function(oError) 
						{
							console.log("Coś nie pykło, ssiesz :)");
						}
					}
				);
			} 
			else
			{
				MessageBox.error("Inappropriate input!");
			}
		},

		onAddProductButtonPress: function(oEvent)
		{
			var oController = this;
			var oView = oController.getView();
			var oModelv2 = oController.getModelv2();

			var sProductPrice = oView.byId("productPrice").getValue();
			var sProductName = oView.byId("productName").getValue();
			if(sProductPrice != "" || sProductName != "")
			{
				//console.log(ename + " " + sname);

				oView.byId("productName").setValue("");
				oView.byId("productPrice").setValue("");

				var sPath = "/ProductSet";
				var oModelToRead = "productModel";

				var oJsonEntityToSend =
				{
					"ProdId": "",
					"Price": sProductPrice,
					"ProdName" : sProductName
				};

				oModelv2.create(sPath, oJsonEntityToSend, 
					{
						success: function(oData, oResponse) 
						{
							oController.readData(oModelv2, sPath, oModelToRead);
						}, 
						error: function(oError) 
						{
							console.log("Coś nie pykło, ssiesz :)");
						}
					}
				);
			} 
			else
			{
				MessageBox.error("Inappropriate input!");
			}
		},

		readData: function(oModelv2, sPath, oModelToRead)
		{
			oModelv2.read(sPath, 
				{
					success: function(oData, oResponse) 
					{
						var oController = sap.ui.controller("gavdi.sandbox.Tami_training_app.controller.View1");
						//var oModel = oController.getMyView().getModel("employeeModel");
						var oModel = oController.getMyView().getModel(oModelToRead);
						oModel.setData(oData);
					}, 
					error: function(oError) 
					{
						console.log("Coś nie pykło, ssiesz :)");
					}
				});
		},

		onSelectionChange: function(oEvent)
		{
			var oController = this;
			var oTable = oController.getMyView().byId("employeeTable");

			this._selectedEmployees.selectedEmp = oTable.getSelectedItems();
			console.log(this._selectedEmployees.selectedEmp);
		},

		onSelectionProdChange: function(oEvent)
		{
			var oController = this;
			var oTable = oController.getMyView().byId("productTable");

			this._selectedProducts.selectedProd = oTable.getSelectedItems();
			console.log(this._selectedProducts.selectedProd);
		},

		onClickDeleteButton: function(oEvent)
		{
			var oController = this;
			var oSelectedEmployee = oController._selectedEmployees.selectedEmp;
			var keys = [];

			if(oSelectedEmployee.length != 0)
			{
				for(var i = 0; i < oSelectedEmployee.length; i++)
				{
					// var ename = oSelectedEmployee[i].getAggregation("cells")[0].getProperty("value");
					// var sname = oSelectedEmployee[i].getAggregation("cells")[1].getProperty("value");
					var employeeId = oSelectedEmployee[i].getAggregation("cells")[0].getProperty("value");
					keys.push({empId:employeeId});
				}

				oController.deleteEmployee(keys);
				
				this._selectedEmployees.selectedEmp = [];
				oController.getMyView().byId("employeeTable").removeSelections();
			}
			else
			{
				MessageBox.error("Select employees to delete!");
			}
		},

		onDeleteProductButtonPress: function(oEvent)
		{
			var oController = this;
			var oSelectedProduct = oController._selectedProducts.selectedProd;
			var keys = [];

			if(oSelectedProduct.length != 0)
			{
				for(var i = 0; i < oSelectedProduct.length; i++)
				{
					var productId = oSelectedProduct[i].getAggregation("cells")[0].getProperty("value");
					keys.push({prodId:productId});
				}

				oController.deleteProduct(keys);
				
				this._selectedProducts.selectedProd = [];
				oController.getMyView().byId("productTable").removeSelections();
			}
			else
			{
				MessageBox.error("Select products to delete!");
			}
		},

		deleteEmployee: function(oEmployeeArray,oRes)
		{	
			if(oEmployeeArray.length != 0)
			{
				var oController = this;
				var oModelv2 = oController.getModelv2();

				var employee = oEmployeeArray.pop();

				// var ename = employee.vorna;
				// var sname = employee.nachn;
				var empId = employee.empId;
				// var sPath = "/EmployeeSet(Vorna='" + ename + "'," + "Nachn='" + sname + "')";
				var sPath = "/EmployeeSet(EmpId='" + empId + "')";
				var oModelToRead = "employeeModel";

				return new Promise((/*resolve, reject*/) =>{

					oModelv2.remove(sPath, 
					{
						success: function(oData, oResponse) 
						{
							var sPath2 = "/EmployeeSet";
							oController.readData(oModelv2, sPath2, oModelToRead);
						}, 
						error: function(oError) 
						{
							console.log("Coś nie pykło, ssiesz :)");
						}
					});

				}).then(oController.deleteEmployee(oEmployeeArray));
			}

		},

		deleteProduct: function(oProductArray,oRes)
		{	
			if(oProductArray.length != 0)
			{
				var oController = this;
				var oModelv2 = oController.getModelv2();

				var product = oProductArray.pop();

				var prodId = product.prodId;
				var sPath = "/ProductSet(ProdId='" + prodId + "')";
				var oModelToRead = "productModel";

				return new Promise(() =>{

					oModelv2.remove(sPath, 
					{
						success: function(oData, oResponse) 
						{
							var sPath2 = "/ProductSet";
							oController.readData(oModelv2, sPath2, oModelToRead);
						}, 
						error: function(oError) 
						{
							console.log("Error during deleting product");
						}
					});

				}).then(oController.deleteProduct(oProductArray));
			}

		},

		onClickUpdateButton: function(employee)
		{
			var oController = this;
			var oModelv2 = oController.getModelv2();
			var inputName = oController.getMyView().byId("ename");
			var inputSurname = oController.getMyView().byId("sname")

			var oSelectedEmployee = this._selectedEmployees.selectedEmp;
			if(oSelectedEmployee.length == 1)
			{
				if(inputName.getValue() != "" && inputSurname.getValue() != "")
				{
					var empId = oSelectedEmployee[0].getAggregation("cells")[0].getProperty("value");
					var vorna = oSelectedEmployee[0].getAggregation("cells")[1].getProperty("value");
					var nachn = oSelectedEmployee[0].getAggregation("cells")[2].getProperty("value");

					var sPath = "/EmployeeSet(EmpId='" + empId + "')";
					var oJsonEntityToSend = 
					{
						"EmpId": empId,
						"Vorna": inputName.getValue(),
						"Nachn": inputSurname.getValue()
					};

					var oModelToRead = "employeeModel";
					oController.getMyView().byId("ename").setValue("");
					oController.getMyView().byId("sname").setValue("");
					
					oModelv2.update(sPath, oJsonEntityToSend,
						{
							success: function(oData, oResponse) 
							{
								var sPath2 = "/EmployeeSet";
								oController.readData(oModelv2, sPath2, oModelToRead);
							}, 
							error: function(oError) 
							{
								console.log("Coś nie pykło, ssiesz :(");
							}
						}
					);
					
					oController.getMyView().byId("employeeTable").removeSelections();
				}
				else
				{
					MessageBox.error("Input can not be empty");
				}
			}
			else
			{
				MessageBox.error("Choose one employee to update!");
			}
		},

		onUpdateProductButtonPress: function(product)
		{
			var oController = this;
			var oModelv2 = oController.getModelv2();
			var inputName = oController.getMyView().byId("productName");
			var inputPrice = oController.getMyView().byId("productPrice")

			var oSelectedProducts = this._selectedProducts.selectedProd;
			if(oSelectedProducts.length == 1)
			{
				if(inputName.getValue() != "" && inputPrice.getValue() != "")
				{
					var prodId = oSelectedProducts[0].getAggregation("cells")[0].getProperty("value");
					var prodName = oSelectedProducts[0].getAggregation("cells")[1].getProperty("value");
					var price = oSelectedProducts[0].getAggregation("cells")[2].getProperty("value");

					var sPath = "/ProductSet(ProdId='" + prodId + "')";
					var oJsonEntityToSend = 
					{
						"ProdId": prodId,
						"ProdName": inputName.getValue(),
						"Price": inputPrice.getValue()
					};

					var oModelToRead = "productModel";
					oController.getMyView().byId("productName").setValue("");
					oController.getMyView().byId("productPrice").setValue("");
					
					oModelv2.update(sPath, oJsonEntityToSend,
						{
							success: function(oData, oResponse) 
							{
								var sPath2 = "/ProductSet";
								oController.readData(oModelv2, sPath2, oModelToRead);
							}, 
							error: function(oError) 
							{
								console.log("Error during updating the product");
							}
						}
					);
					
					oController.getMyView().byId("productTable").removeSelections();
				}
				else
				{
					MessageBox.error("Input can not be empty");
				}
			}
			else
			{
				MessageBox.error("Choose one product to update!");
			}
		},

		onProductPress: function()
		{
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("PurchaseDetailsRoute", {
				id: "1"
			});
		},

		pressDialog: null,

		onClickAddPurchaseButton: function()
		{
			var today = new Date();
			var date = today.getDate() + '.' + (today.getMonth()+1) + '.' + today.getFullYear();
			var time = today.getHours() + ":" + today.getMinutes()
			var realTime = date + " " + time;
			console.log(realTime);
			
			// if (!this.pressDialog) 
			// {
			// 	this.pressDialog = new Dialog({
			// 		title: "Available Products",

			// 		beginButton: new Button({
			// 			type: ButtonType.Emphasized,
			// 			text: "OK",
			// 			press: function () {
			// 				this.pressDialog.close();
			// 			}.bind(this)
			// 		}),
			// 		endButton: new Button({
			// 			text: "Close",
			// 			press: function () {
			// 				this.pressDialog.close();
			// 			}.bind(this)
			// 		})
			// 	});

			// 	//to get access to the global model
			// 	this.getView().addDependent(this.pressDialog);
			// }

			// this.pressDialog.open();

		},

		onSelectionPurChange: function()
		{
			var oController = this;
			var oTable = oController.getMyView().byId("purchaseTable");

			this._selectedPurchases.selectedPur = oTable.getSelectedItems();
			console.log(this._selectedPurchases.selectedPur);
		},

		onClickDeletePurchaseButton: function()
		{
			
		}

	});
});
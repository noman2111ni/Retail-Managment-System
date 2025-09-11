import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import branchReducer from "./slices/branchSlice";
import newProductsReducer from "./newproductSlice";
import auditLogsReducer from "./slices/auditLogsSlice";
import salesReducer from "./slices/saleSlice";
import stockSlice from "./slices/stockSlice";
import vendorReducer from "./slices/vendorSlice";
import purchaseReducer from "./slices/purchaseSlice";
import ledgerReducer from "./slices/ledgerSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    branches: branchReducer,
    newProducts: newProductsReducer,
    auditLogs: auditLogsReducer,
    sales: salesReducer,
    stock: stockSlice,
    vendors: vendorReducer,
    purchases: purchaseReducer,
    ledger: ledgerReducer, 
  },
});

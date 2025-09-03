import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import branchReducer from "./slices/branchSlice";
import newProductsReducer from "./newproductSlice";
import auditLogsReducer from "./slices/auditLogsSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    branches: branchReducer,
    newProducts: newProductsReducer,
    auditLogs: auditLogsReducer,
  },
});

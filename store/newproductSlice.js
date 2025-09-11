// store/newproductSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setTokens } from "./slices/authSlice";

const API_URL = "https://retailm.pythonanywhere.com/api/products/";
const REFRESH_URL = "https://retailm.pythonanywhere.com/api/token/refresh/";

const withAuth = async (requestFn, { getState, dispatch, rejectWithValue }) => {
  let { accessToken, refreshToken } = getState().auth;

  try {
    return await requestFn(accessToken);
  } catch (err) {
    if (err.response?.data?.code === "token_not_valid" && refreshToken) {
      try {
        const refreshResponse = await axios.post(REFRESH_URL, { refresh: refreshToken });
        accessToken = refreshResponse.data.access;
        dispatch(setTokens({ access: accessToken, refresh: refreshToken }));
        return await requestFn(accessToken);
      } catch {
        return rejectWithValue("Refresh token expired, login required.");
      }
    }
    return rejectWithValue(err.response?.data || "Request failed.");
  }
};

// Fetch products
export const fetchnewProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, helpers) =>
    await withAuth(
      (token) => axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } }),
      helpers
    ).then((res) => res.data)
);

// Add new product
export const addnewProduct = createAsyncThunk(
  "products/addProduct",
  async (productData, helpers) =>
    await withAuth(
      (token) => axios.post(API_URL, productData, { headers: { Authorization: `Bearer ${token}` } }),
      helpers
    ).then((res) => res.data)
);

// Delete product
export const deletenewProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, helpers) =>
    await withAuth(
      (token) => axios.delete(`${API_URL}${id}/`, { headers: { Authorization: `Bearer ${token}` } }),
      helpers
    ).then(() => id)
);

// Update product
export const updatenewProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data }, helpers) =>
    await withAuth(
      (token) => axios.put(`${API_URL}${id}/`, data, { headers: { Authorization: `Bearer ${token}` } }),
      helpers
    ).then((res) => res.data)
);

const productSlice = createSlice({
  name: "newProducts",
  initialState: { data: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchnewProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchnewProducts.fulfilled, (state, action) => { state.loading = false; state.data = action.payload || []; })
      .addCase(fetchnewProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Add
      .addCase(addnewProduct.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addnewProduct.fulfilled, (state, action) => { state.loading = false; state.data.push(action.payload); })
      .addCase(addnewProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Delete
      .addCase(deletenewProduct.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deletenewProduct.fulfilled, (state, action) => { state.loading = false; state.data = state.data.filter((p) => p.id !== action.payload); })
      .addCase(deletenewProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Update
      .addCase(updatenewProduct.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updatenewProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.data[index] = action.payload;
      })
      .addCase(updatenewProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default productSlice.reducer;

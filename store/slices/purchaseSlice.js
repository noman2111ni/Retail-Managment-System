// src/store/slices/purchaseSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_PURCHASES = "https://retailm.pythonanywhere.com/api/purchases/";

// fetch purchases
export const fetchPurchases = createAsyncThunk(
  "purchases/fetchPurchases",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken"); // 👈 agar JWT token use karte ho
      const res = await axios.get(API_PURCHASES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);
// ✅ Add Purchase thunk
export const addPurchase = createAsyncThunk(
  "purchases/addPurchase",
  async (payload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken"); // 👈 agar JWT token use karte ho
      const res = await axios.post(API_PURCHASES, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);
// ✅ Delete Purchase thunk
export const deletePurchase = createAsyncThunk(
  "purchases/deletePurchase",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken"); // 👈 agar JWT token use karte ho
      await axios.delete(`${API_PURCHASES}${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

const purchaseSlice = createSlice({
  name: "purchases",
  initialState: {
    purchases: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    //  fetchPurchases cases
    builder
      .addCase(fetchPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases = action.payload;
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // add purshase cases
    builder
      .addCase(addPurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases.push(action.payload);
      })
      .addCase(addPurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // delete purchase cases
    builder
      .addCase(deletePurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases = state.purchases.filter(
          (purchase) => purchase.id !== action.payload
        );
      })
      .addCase(deletePurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default purchaseSlice.reducer;

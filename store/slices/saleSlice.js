import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_SALES = "https://retailm.pythonanywhere.com/api/sales/";

// ✅ Fetch sales
export const fetchSales = createAsyncThunk(
  "sales/fetchSales",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_SALES, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Create sale
export const createSale = createAsyncThunk(
  "sales/createSale",
  async (saleData, { rejectWithValue }) => {
    try {
      const payload = {
        invoice_no: saleData.invoice_no,
        customer_name: saleData.customer_name,
        customer_phone: saleData.customer_phone,
        branch: saleData.branch,
        subtotal: saleData.subtotal,
        discount: saleData.discount,
        total_amount: saleData.total_amount,
        paid_amount: saleData.paid_amount,
        payment_method: saleData.payment_method,
        created_by: saleData.created_by,
        notes: saleData.notes,
        items: saleData.items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      };

      const response = await axios.post(API_SALES, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Delete sale
export const deleteSale = createAsyncThunk(
  "sales/deleteSale",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${API_SALES}${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id; // return id instead of response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const saleSlice = createSlice({
  name: "sales",
  initialState: {
    sales: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch Sales
      .addCase(fetchSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔹 Create Sale
      .addCase(createSale.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.loading = false;
        state.sales.push(action.payload);
      })
      .addCase(createSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔹 Delete Sale
      .addCase(deleteSale.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSale.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = state.sales.filter((sale) => sale.id !== action.payload);
      })
      .addCase(deleteSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default saleSlice.reducer;

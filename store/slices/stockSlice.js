import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔹 Fetch Stock Movements
export const fetchStockMovements = createAsyncThunk(
  "stock/fetchStockMovements",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(
        "https://retailm.pythonanywhere.com/api/stock-movements/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`, // 🔑 secure request
          },
        }
      );

      // Normalize data (array safe return)
      if (Array.isArray(response.data)) return response.data;
      if (response.data?.results) return response.data.results;
      return [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to fetch stock movements"
      );
    }
  }
);
// delete stock movement
export const deleteStockMovement = createAsyncThunk(
  "stock/deleteStockMovement",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.delete(
        `https://retailm.pythonanywhere.com/api/stock-movements/${id}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`, // 🔑 secure request
          },
        }
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to delete stock movement"
      );
    }
  }
);

const stockSlice = createSlice({
  name: "stock",
  initialState: {
    movements: [], // list of stock in/out
    loading: false,
    error: null,
  },
  reducers: {
    clearStock: (state) => {
      state.movements = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockMovements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockMovements.fulfilled, (state, action) => {
        state.loading = false;
        state.movements = action.payload; // ✅ guaranteed array
      })
      .addCase(fetchStockMovements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch stock movements";
      });
    // delete stock movement
    builder
      .addCase(deleteStockMovement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStockMovement.fulfilled, (state, action) => {
        state.loading = false;
        state.movements = state.movements.filter(
          (movement) => movement.id !== action.payload.id
        ); // remove deleted movement from state
      })
      .addCase(deleteStockMovement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete stock movement";
      });
  },
});

export const { clearStock } = stockSlice.actions;
export default stockSlice.reducer;

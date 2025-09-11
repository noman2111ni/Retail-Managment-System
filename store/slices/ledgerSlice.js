// src/store/slices/ledgerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_LEDGER = "https://retailm.pythonanywhere.com/api/ledger-entries/";

// Fetch Ledger Entries
export const fetchLedger = createAsyncThunk(
  "ledger/fetchLedger",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_LEDGER, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching ledger");
    }
  }
);

// delete Ledger Entry
export const deleteLedgerEntry = createAsyncThunk(
  "ledger/deleteLedgerEntry",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_LEDGER}${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return id;
      // console.log("Deleted entry with ID:", id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Error deleting ledger entry"
      );
    }
  }
);
const ledgerSlice = createSlice({
  name: "ledger",
  initialState: {
    entries: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLedger.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLedger.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchLedger.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // Delete Ledger Entry
    builder
      .addCase(deleteLedgerEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLedgerEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = state.entries.filter(
          (entry) => entry.id !== action.payload
        );
      })
      .addCase(deleteLedgerEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ledgerSlice.reducer;

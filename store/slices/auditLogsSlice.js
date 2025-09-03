import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch audit logs (no role check)
export const fetchAuditLogs = createAsyncThunk(
  "auditLogs/fetchAuditLogs",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const response = await axios.get(
        "https://retailm.pythonanywhere.com/api/audit-logs/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.auth.accessToken}`,
          },
        }
      );

      // Ensure we always return an array
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data?.results) {
        return response.data.results;
      } else {
        return [];
      }
    } catch (err) {
      // Handle axios errors
      return rejectWithValue(
        err.response?.data?.detail || err.message || "Failed to fetch audit logs"
      );
    }
  }
);

const auditLogsSlice = createSlice({
  name: "auditLogs",
  initialState: {
    logs: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAuditLogs: (state) => {
      state.logs = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
        console.log(action.payload);
         // guaranteed to be an array
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch audit logs";
      });
  },
});

export const { clearAuditLogs } = auditLogsSlice.actions;
export default auditLogsSlice.reducer;

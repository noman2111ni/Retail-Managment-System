// store/slices/branchSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setTokens } from "./authSlice";

const API_URL = "https://retailm.pythonanywhere.com/api/branches/";
const REFRESH_URL =
  "https://retailm.pythonanywhere.com/api/token/refresh/";

// 🔹 Utility function to handle token refresh automatically
const withAuth = async (requestFn, { getState, dispatch, rejectWithValue }) => {
  let { accessToken, refreshToken } = getState().auth;

  try {
    return await requestFn(accessToken);
  } catch (err) {
    if (err.response?.data?.code === "token_not_valid" && refreshToken) {
      try {
        const refreshResponse = await axios.post(REFRESH_URL, {
          refresh: refreshToken,
        });
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

// 🔹 Thunks (API Calls)

// Fetch All Branches
export const fetchBranches = createAsyncThunk(
  "branches/fetchBranches",
  async (_, helpers) =>
    await withAuth(
      (token) =>
        axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      helpers
    ).then((res) => res.data)
);

// Add New Branch
export const addBranch = createAsyncThunk(
  "branches/addBranch",
  async (branchData, helpers) =>
    await withAuth(
      (token) =>
        axios.post(API_URL, branchData, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      helpers
    ).then((res) => res.data)
);

// Update Branch
export const updateBranch = createAsyncThunk(
  "branches/updateBranch",
  async ({ id, branchData }, helpers) =>
    await withAuth(
      (token) =>
        axios.put(`${API_URL}${id}/`, branchData, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      helpers
    ).then((res) => res.data)
);

// Delete Branch (✅ fixed to use withAuth + correct token)
export const deleteBranch = createAsyncThunk(
  "branches/deleteBranch",
  async (id, helpers) =>
    await withAuth(
      (token) =>
        axios.delete(`${API_URL}${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      helpers
    ).then(() => id) // return deleted id
);

// 🔹 Slice
const branchSlice = createSlice({
  name: "branches",
  initialState: { data: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Branches
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Branch
      .addCase(addBranch.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })

      // Update Branch
      .addCase(updateBranch.fulfilled, (state, action) => {
        const index = state.data.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })

      // Delete Branch
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (branch) => branch.id !== action.payload
        );
      });
  },
});

export default branchSlice.reducer;

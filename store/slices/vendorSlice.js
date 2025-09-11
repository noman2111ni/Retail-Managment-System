// src/store/slices/vendorSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setTokens } from "./authSlice"; // 👈 ensure you have this in authSlice

// 👇 API ka base URL
const API_VENDORS = "https://retailm.pythonanywhere.com/api/vendors/";
const REFRESH_URL = "https://retailm.pythonanywhere.com/api/token/refresh/";

// 🔹 Helper function for token auth
const withAuth = async (requestFn, { getState, dispatch, rejectWithValue }) => {
  let { accessToken, refreshToken } = getState().auth;

  try {
    return await requestFn(accessToken);
  } catch (err) {
    // if token expired
    if (err.response?.data?.code === "token_not_valid" && refreshToken) {
      try {
        const refreshResponse = await axios.post(REFRESH_URL, {
          refresh: refreshToken,
        });

        accessToken = refreshResponse.data.access;

        // update tokens in redux
        dispatch(setTokens({ access: accessToken, refresh: refreshToken }));

        // retry request with new token
        return await requestFn(accessToken);
      } catch {
        return rejectWithValue("Refresh token expired, login required.");
      }
    }
    return rejectWithValue(err.response?.data || "Request failed.");
  }
};

// ✅ Vendors fetch
export const fetchVendors = createAsyncThunk(
  "vendors/fetchVendors",
  async (_, thunkAPI) => {
    return withAuth(
      async (token) => {
        const res = await axios.get(API_VENDORS, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
      },
      thunkAPI
    );
  }
);

// ✅ Add vendor
export const addVendor = createAsyncThunk(
  "vendors/addVendor",
  async (vendorData, thunkAPI) => {
    return withAuth(
      async (token) => {
        const res = await axios.post(API_VENDORS, vendorData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
      },
      thunkAPI
    );
  }
);

// ✅ Delete vendor
export const deleteVendor = createAsyncThunk(
  "vendors/deleteVendor",
  async (vendorId, thunkAPI) => {
    return withAuth(
      async (token) => {
        await axios.delete(`${API_VENDORS}${vendorId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return vendorId;
      },
      thunkAPI
    );
  }
);

const vendorSlice = createSlice({
  name: "vendors",
  initialState: {
    vendors: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetch vendors
    builder.addCase(fetchVendors.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchVendors.fulfilled, (state, action) => {
      state.loading = false;
      state.vendors = action.payload;
    });
    builder.addCase(fetchVendors.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // add vendor
    builder.addCase(addVendor.fulfilled, (state, action) => {
      state.vendors.push(action.payload);
    });

    // delete vendor
    builder.addCase(deleteVendor.fulfilled, (state, action) => {
      state.vendors = state.vendors.filter((v) => v.id !== action.payload);
    });
  },
});

export default vendorSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_LOGIN = "https://retailm.pythonanywhere.com/api/token/";
const API_REGISTER = "https://retailm.pythonanywhere.com/api/register/";
const API_CURRENT_USER =
  "https://retailm.pythonanywhere.com/admin/api/customuser/?role__exact=admin";

// Login Thunk
console.log(API_CURRENT_USER);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, { rejectWithValue, dispatch }) => {
    try {
      // 1️⃣ Login and get tokens
      const response = await axios.post(API_LOGIN, { username, password });
      const { access, refresh } = response.data;

      dispatch(setTokens({ access, refresh }));

      // 2️⃣ Fetch current user info
      const userResponse = await axios.get(API_CURRENT_USER, {
        headers: { Authorization: `Bearer ${access}` },
      });

      dispatch(setUser(userResponse.data));
      return { access, refresh, user: userResponse.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

// Register Thunk
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_REGISTER, {
        username,
        email,
        password,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Signup failed");
    }
  }
);

const initialState = {
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  user: null, // ✅ now store user
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens: (state, action) => {
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      localStorage.setItem("accessToken", action.payload.access);
      localStorage.setItem("refreshToken", action.payload.refresh);
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.detail || action.payload;
      })
      // register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.detail || action.payload;
      });
  },
});

export const { setTokens, setUser, logout } = authSlice.actions;
export default authSlice.reducer;

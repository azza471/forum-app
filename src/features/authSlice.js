import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'https://forum-api.dicoding.dev/v1';

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }) => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.status !== 'success') {
      throw new Error(data.message);
    }

    return data.data.user;
  },
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }) => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.status !== 'success') {
      throw new Error(data.message);
    }

    const { token } = data.data;

    localStorage.setItem('token', token);

    return token;
  },
);

const authSlice = createSlice({
  name: 'auth',

  initialState: {
    token: localStorage.getItem('token'),
    loading: false,
    user: null,
  },

  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;

      localStorage.removeItem('token');
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })

      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(registerUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;

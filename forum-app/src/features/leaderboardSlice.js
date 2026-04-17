import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchLeaderboards = createAsyncThunk(
  'leaderboards/fetchLeaderboards',
  async () => {
    const res = await fetch('https://forum-api.dicoding.dev/v1/leaderboards');

    const data = await res.json();

    return data.data.leaderboards;
  },
);

const leaderboardSlice = createSlice({
  name: 'leaderboards',

  initialState: {
    leaderboards: [],
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchLeaderboards.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchLeaderboards.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboards = action.payload;
      })

      .addCase(fetchLeaderboards.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default leaderboardSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchThreads = createAsyncThunk(
  'threads/fetchThreads',
  async () => {
    const [threadsRes, usersRes] = await Promise.all([
      fetch('https://forum-api.dicoding.dev/v1/threads'),
      fetch('https://forum-api.dicoding.dev/v1/users'),
    ]);

    const threadsData = await threadsRes.json();
    const usersData = await usersRes.json();

    const { threads } = threadsData.data;
    const { users } = usersData.data;

    const mergedThreads = threads.map((thread) => {
      const owner = users.find((user) => user.id === thread.ownerId);

      return {
        ...thread,
        owner,
      };
    });

    return mergedThreads;
  },
);

function getUserId() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.id;
}

export const upVoteThread = createAsyncThunk(
  'threads/upVoteThread',
  async (threadId) => {
    const token = localStorage.getItem('token');
    const userId = getUserId();

    await fetch(
      `https://forum-api.dicoding.dev/v1/threads/${threadId}/up-vote`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return { threadId, userId };
  },
);

export const downVoteThread = createAsyncThunk(
  'threads/downVoteThread',
  async (threadId) => {
    const token = localStorage.getItem('token');
    const userId = getUserId();

    await fetch(
      `https://forum-api.dicoding.dev/v1/threads/${threadId}/down-vote`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return { threadId, userId };
  },
);

export const neutralVoteThread = createAsyncThunk(
  'threads/neutralVoteThread',
  async (threadId) => {
    const token = localStorage.getItem('token');
    const userId = getUserId();

    await fetch(
      `https://forum-api.dicoding.dev/v1/threads/${threadId}/neutral-vote`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return { threadId, userId };
  },
);

export const createThread = createAsyncThunk(
  'threads/createThread',
  async ({ title, body, category }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        'https://forum-api.dicoding.dev/v1/threads',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, body, category }),
        },
      );

      const data = await response.json();
      if (data.status !== 'success') throw new Error(data.message);

      return data.data.thread;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const threadsSlice = createSlice({
  name: 'threads',
  initialState: {
    threads: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.loading = false;
        state.threads = action.payload;
      })
      .addCase(fetchThreads.rejected, (state) => {
        state.loading = false;
      })

      .addCase(upVoteThread.fulfilled, (state, action) => {
        const { threadId, userId } = action.payload;

        const thread = state.threads.find((t) => t.id === threadId);
        if (!thread) return;

        thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);

        if (thread.upVotesBy.includes(userId)) {
          thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
        } else {
          thread.upVotesBy.push(userId);
        }
      })

      .addCase(downVoteThread.fulfilled, (state, action) => {
        const { threadId, userId } = action.payload;

        const thread = state.threads.find((t) => t.id === threadId);
        if (!thread) return;

        thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);

        if (thread.downVotesBy.includes(userId)) {
          thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
        } else {
          thread.downVotesBy.push(userId);
        }
      })

      .addCase(neutralVoteThread.fulfilled, (state, action) => {
        const { threadId, userId } = action.payload;

        const thread = state.threads.find((t) => t.id === threadId);
        if (!thread) return;

        thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
        thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
      })

      .addCase(createThread.fulfilled, (state, action) => {
        state.threads.unshift(action.payload);
      });
  },
});

export default threadsSlice.reducer;

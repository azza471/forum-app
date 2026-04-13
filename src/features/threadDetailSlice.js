import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchThreadDetail = createAsyncThunk(
  'threadDetail/fetchThreadDetail',
  async (threadId) => {
    const res = await fetch(
      `https://forum-api.dicoding.dev/v1/threads/${threadId}`,
    );

    const data = await res.json();

    return data.data.detailThread;
  },
);

export const upVoteThreadDetail = createAsyncThunk(
  'threadDetail/upVoteThreadDetail',
  async ({ threadId, isUpVoted }) => {
    const token = localStorage.getItem('token');

    const url = isUpVoted
      ? `https://forum-api.dicoding.dev/v1/threads/${threadId}/neutral-vote`
      : `https://forum-api.dicoding.dev/v1/threads/${threadId}/up-vote`;

    await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return true;
  },
);

export const downVoteThreadDetail = createAsyncThunk(
  'threadDetail/downVoteThreadDetail',
  async ({ threadId, isDownVoted }) => {
    const token = localStorage.getItem('token');

    const url = isDownVoted
      ? `https://forum-api.dicoding.dev/v1/threads/${threadId}/neutral-vote`
      : `https://forum-api.dicoding.dev/v1/threads/${threadId}/down-vote`;

    await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return true;
  },
);

export const createComment = createAsyncThunk(
  'threadDetail/createComment',
  async ({ threadId, content }) => {
    const token = localStorage.getItem('token');

    const res = await fetch(
      `https://forum-api.dicoding.dev/v1/threads/${threadId}/comments`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      },
    );

    const data = await res.json();

    return data.data.comment;
  },
);

const threadDetailSlice = createSlice({
  name: 'threadDetail',

  initialState: {
    thread: null,
    loading: false,
  },

  reducers: {
    toggleUpVote(state, action) {
      const userId = action.payload;

      const isUp = state.thread.upVotesBy.includes(userId);

      if (isUp) {
        state.thread.upVotesBy = state.thread.upVotesBy.filter(
          (id) => id !== userId,
        );
      } else {
        state.thread.upVotesBy.push(userId);

        state.thread.downVotesBy = state.thread.downVotesBy.filter(
          (id) => id !== userId,
        );
      }
    },

    toggleDownVote(state, action) {
      const userId = action.payload;

      const isDown = state.thread.downVotesBy.includes(userId);

      if (isDown) {
        state.thread.downVotesBy = state.thread.downVotesBy.filter(
          (id) => id !== userId,
        );
      } else {
        state.thread.downVotesBy.push(userId);

        state.thread.upVotesBy = state.thread.upVotesBy.filter(
          (id) => id !== userId,
        );
      }
    },

    toggleCommentUpVote(state, action) {
      const { commentId, userId } = action.payload;

      const comment = state.thread.comments.find((c) => c.id === commentId);

      const isUp = comment.upVotesBy.includes(userId);

      if (isUp) {
        comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
      } else {
        comment.upVotesBy.push(userId);

        comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
      }
    },

    toggleCommentDownVote(state, action) {
      const { commentId, userId } = action.payload;

      const comment = state.thread.comments.find((c) => c.id === commentId);

      const isDown = comment.downVotesBy.includes(userId);

      if (isDown) {
        comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
      } else {
        comment.downVotesBy.push(userId);

        comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
      }
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchThreadDetail.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.thread = action.payload;
      })

      .addCase(createComment.fulfilled, (state, action) => {
        state.thread.comments.unshift(action.payload);
      });
  },
});

export const upVoteComment = createAsyncThunk(
  'threadDetail/upVoteComment',
  async ({ threadId, commentId, isUpVoted }) => {
    const token = localStorage.getItem('token');

    const url = isUpVoted
      ? `https://forum-api.dicoding.dev/v1/threads/${threadId}/comments/${commentId}/neutral-vote`
      : `https://forum-api.dicoding.dev/v1/threads/${threadId}/comments/${commentId}/up-vote`;

    await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return true;
  },
);

export const downVoteComment = createAsyncThunk(
  'threadDetail/downVoteComment',
  async ({ threadId, commentId, isDownVoted }) => {
    const token = localStorage.getItem('token');

    const url = isDownVoted
      ? `https://forum-api.dicoding.dev/v1/threads/${threadId}/comments/${commentId}/neutral-vote`
      : `https://forum-api.dicoding.dev/v1/threads/${threadId}/comments/${commentId}/down-vote`;

    await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return true;
  },
);

export const {
  toggleUpVote,
  toggleDownVote,
  toggleCommentUpVote,
  toggleCommentDownVote,
} = threadDetailSlice.actions;

export default threadDetailSlice.reducer;

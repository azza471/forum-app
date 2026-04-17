import { configureStore } from '@reduxjs/toolkit';

import threadsReducer from '../features/threadsSlice';
import threadDetailReducer from '../features/threadDetailSlice';
import commentsReducer from '../features/commentsSlice';
import authReducer from '../features/authSlice';
import leaderboardReducer from '../features/leaderboardSlice';

export const store = configureStore({
  reducer: {
    threads: threadsReducer,
    threadDetail: threadDetailReducer,
    comments: commentsReducer,
    auth: authReducer,
    leaderboards: leaderboardReducer,
  },
});

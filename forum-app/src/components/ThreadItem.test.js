import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';

import ThreadItem from './ThreadItem';
import authReducer from '../features/authSlice';
import threadsReducer from '../features/threadsSlice';

const mockThread = {
  id: 'thread-1',
  title: 'Test Thread',
  body: '<p>Hello world</p>',
  category: 'general',
  upVotesBy: [],
  downVotesBy: [],
  totalComments: 0,
  createdAt: new Date().toISOString(),
  owner: {
    name: 'User A',
    avatar: 'https://i.pravatar.cc/100',
  },
};

function renderWithStore() {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      threads: threadsReducer,
    },
    preloadedState: {
      auth: { token: 'fake.token.123' },
    },
  });

  const spy = jest.spyOn(store, 'dispatch');

  render(
    <Provider store={store}>
      <BrowserRouter>
        <ThreadItem thread={mockThread} />
      </BrowserRouter>
    </Provider>,
  );

  return { store, spy };
}

test('should dispatch upVoteThread when clicked', () => {
  const { spy } = renderWithStore();

  fireEvent.click(screen.getByTestId('upvote-btn'));

  expect(spy).toHaveBeenCalledWith(expect.any(Function));
});

test('should dispatch downVoteThread when clicked', () => {
  const { spy } = renderWithStore();

  fireEvent.click(screen.getByTestId('downvote-btn'));

  expect(spy).toHaveBeenCalledWith(expect.any(Function));
});

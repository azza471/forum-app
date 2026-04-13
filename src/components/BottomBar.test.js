import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';

import BottomBar from './BottomBar';
import authReducer, { logout } from '../features/authSlice';

function renderWithStore(preloadedState) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState,
  });

  const dispatchSpy = jest.spyOn(store, 'dispatch');

  render(
    <Provider store={store}>
      <BrowserRouter>
        <BottomBar />
      </BrowserRouter>
    </Provider>,
  );

  return { store, dispatchSpy };
}

test('should show Login when not authenticated', () => {
  renderWithStore({ auth: { token: null } });

  expect(screen.getByText('Login')).toBeInTheDocument();
});

test('should show Logout when authenticated', () => {
  renderWithStore({ auth: { token: 'fake-token' } });

  expect(screen.getByText('Logout')).toBeInTheDocument();
});

test('should dispatch logout action when Logout clicked', () => {
  const { dispatchSpy } = renderWithStore({
    auth: { token: 'fake-token' },
  });

  fireEvent.click(screen.getByText('Logout'));

  expect(dispatchSpy).toHaveBeenCalledWith(logout());
});

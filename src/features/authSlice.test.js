import reducer, { logout, loginUser, registerUser } from './authSlice';

global.fetch = jest.fn();

describe('authSlice', () => {
  const initialState = {
    token: null,
    loading: false,
    user: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
  });

  describe('Reducer Logic', () => {
    test('should return initial state', () => {
      const result = reducer(undefined, { type: '@@INIT' });
      expect(result.loading).toBe(false);
    });

    test('should handle loginUser.pending', () => {
      const action = { type: loginUser.pending.type };
      const result = reducer(initialState, action);
      expect(result.loading).toBe(true);
    });

    test('should handle loginUser.fulfilled', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: 'fake-token',
      };
      const result = reducer(initialState, action);
      expect(result.loading).toBe(false);
      expect(result.token).toBe('fake-token');
    });

    test('should handle loginUser.rejected', () => {
      const state = { ...initialState, loading: true };
      const action = { type: loginUser.rejected.type };
      const result = reducer(state, action);
      expect(result.loading).toBe(false);
    });

    test('should handle logout', () => {
      const state = {
        token: 'abc',
        user: { name: 'test' },
        loading: false,
      };
      const result = reducer(state, logout());
      expect(result.token).toBe(null);
      expect(result.user).toBe(null);
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });
  });

  describe('Thunks (Asynchronous)', () => {
    test('loginUser thunk should return token and save to localStorage on success', async () => {
      const fakeResponse = {
        status: 'success',
        data: { token: 'new-token' },
      };

      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(fakeResponse),
      });

      const dispatch = jest.fn();
      const thunk = loginUser({ email: 'test@mail.com', password: 'password' });
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/login'),
        expect.objectContaining({ method: 'POST' }),
      );
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'new-token');
      expect(result.payload).toBe('new-token');
    });

    test('loginUser thunk should handle failure', async () => {
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ status: 'fail', message: 'Wrong password' }),
      });

      const dispatch = jest.fn();
      const thunk = loginUser({ email: 'test@mail.com', password: 'password' });
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.type).toBe(loginUser.rejected.type);
    });

    test('registerUser thunk should return user data on success', async () => {
      const fakeUser = { id: 'user-1', name: 'Leon' };
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ status: 'success', data: { user: fakeUser } }),
      });

      const dispatch = jest.fn();
      const thunk = registerUser({
        name: 'Leon',
        email: 'a@b.com',
        password: '123',
      });
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.type).toBe(registerUser.fulfilled.type);
      expect(result.payload).toEqual(fakeUser);
    });
  });
});

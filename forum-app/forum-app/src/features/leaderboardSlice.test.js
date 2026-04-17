import reducer, { fetchLeaderboards } from './leaderboardSlice';

global.fetch = jest.fn();

describe('leaderboardSlice', () => {
  const initialState = {
    leaderboards: [],
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Reducer Logic', () => {
    test('should return initial state', () => {
      const result = reducer(undefined, { type: '@@INIT' });
      expect(result).toEqual(initialState);
    });

    test('should handle fetchLeaderboards.pending', () => {
      const action = { type: fetchLeaderboards.pending.type };
      const result = reducer(initialState, action);
      expect(result.loading).toBe(true);
    });

    test('should handle fetchLeaderboards.fulfilled', () => {
      const fakeData = [{ user: { id: '1', name: 'Leon' }, score: 100 }];
      const action = {
        type: fetchLeaderboards.fulfilled.type,
        payload: fakeData,
      };
      const result = reducer({ ...initialState, loading: true }, action);
      expect(result.loading).toBe(false);
      expect(result.leaderboards).toEqual(fakeData);
    });

    test('should handle fetchLeaderboards.rejected', () => {
      const action = { type: fetchLeaderboards.rejected.type };
      const result = reducer({ ...initialState, loading: true }, action);
      expect(result.loading).toBe(false);
    });
  });

  describe('Thunks (Asynchronous)', () => {
    test('fetchLeaderboards thunk should return leaderboard data on success', async () => {
      const mockData = {
        status: 'success',
        data: {
          leaderboards: [{ user: { id: 'user-1', name: 'Leon' }, score: 100 }],
        },
      };

      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockData),
      });

      const dispatch = jest.fn();
      const thunk = fetchLeaderboards();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://forum-api.dicoding.dev/v1/leaderboards',
      );
      expect(result.type).toBe(fetchLeaderboards.fulfilled.type);
      expect(result.payload).toEqual(mockData.data.leaderboards);
    });

    test('fetchLeaderboards thunk should dispatch rejected when fetch fails', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Fetch failed'));

      const dispatch = jest.fn();
      const thunk = fetchLeaderboards();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.type).toBe(fetchLeaderboards.rejected.type);
    });
  });
});

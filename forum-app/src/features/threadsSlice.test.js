import reducer, {
  fetchThreads,
  upVoteThread,
  downVoteThread,
  neutralVoteThread,
  createThread,
} from './threadsSlice';

global.fetch = jest.fn();

const createFakeToken = (id) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ id, iat: 123456789 }));
  return `${header}.${payload}.signature`;
};

describe('threadsSlice', () => {
  const initialState = {
    threads: [],
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn();
  });

  describe('Reducer Logic', () => {
    test('should return initial state', () => {
      const result = reducer(undefined, { type: '@@INIT' });
      expect(result).toEqual(initialState);
    });

    test('should handle fetchThreads.fulfilled', () => {
      const fakeThreads = [{ id: '1', upVotesBy: [], downVotesBy: [] }];
      const action = {
        type: fetchThreads.fulfilled.type,
        payload: fakeThreads,
      };
      const result = reducer(initialState, action);
      expect(result.threads).toEqual(fakeThreads);
    });

    test('should handle createThread.fulfilled', () => {
      const newThread = {
        id: '2',
        title: 'New',
        upVotesBy: [],
        downVotesBy: [],
      };
      const action = { type: createThread.fulfilled.type, payload: newThread };
      const result = reducer(initialState, action);
      expect(result.threads[0]).toEqual(newThread);
    });

    test('should handle upVoteThread.fulfilled', () => {
      const state = {
        ...initialState,
        threads: [{ id: '1', upVotesBy: [], downVotesBy: ['user1'] }],
      };
      const action = {
        type: upVoteThread.fulfilled.type,
        payload: { threadId: '1', userId: 'user1' },
      };
      const result = reducer(state, action);
      expect(result.threads[0].downVotesBy).not.toContain('user1');
      expect(result.threads[0].upVotesBy).toContain('user1');
    });

    test('should handle downVoteThread.fulfilled', () => {
      const state = {
        ...initialState,
        threads: [{ id: '1', upVotesBy: ['user1'], downVotesBy: [] }],
      };
      const action = {
        type: downVoteThread.fulfilled.type,
        payload: { threadId: '1', userId: 'user1' },
      };
      const result = reducer(state, action);
      expect(result.threads[0].upVotesBy).not.toContain('user1');
      expect(result.threads[0].downVotesBy).toContain('user1');
    });

    test('should handle neutralVoteThread.fulfilled', () => {
      const state = {
        ...initialState,
        threads: [{ id: '1', upVotesBy: ['user1'], downVotesBy: ['user2'] }],
      };
      const action = {
        type: neutralVoteThread.fulfilled.type,
        payload: { threadId: '1', userId: 'user1' },
      };
      const result = reducer(state, action);
      expect(result.threads[0].upVotesBy).not.toContain('user1');
      expect(result.threads[0].downVotesBy).toContain('user2');
    });
  });

  describe('Thunks (Asynchronous)', () => {
    test('fetchThreads thunk should fetch and merge threads with users', async () => {
      const mockThreadsRes = {
        status: 'success',
        data: { threads: [{ id: 't-1', ownerId: 'u-1' }] },
      };
      const mockUsersRes = {
        status: 'success',
        data: { users: [{ id: 'u-1', name: 'Leon Duta' }] },
      };

      global.fetch
        .mockResolvedValueOnce({ json: () => Promise.resolve(mockThreadsRes) })
        .mockResolvedValueOnce({ json: () => Promise.resolve(mockUsersRes) });

      const dispatch = jest.fn();
      const thunk = fetchThreads();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result.type).toBe(fetchThreads.fulfilled.type);
      expect(result.payload[0].owner.name).toBe('Leon Duta');
    });

    test('upVoteThread thunk should call API and return correct payload', async () => {
      const threadId = 'thread-123';
      const userId = 'user-leon';
      const fakeToken = createFakeToken(userId);

      Storage.prototype.getItem.mockReturnValue(fakeToken);
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ status: 'success' }),
      });

      const dispatch = jest.fn();
      const thunk = upVoteThread(threadId);
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/threads/${threadId}/up-vote`),
        expect.any(Object),
      );
      expect(result.payload).toEqual({ threadId, userId });
    });

    test('createThread thunk should return new thread data on success', async () => {
      const newThreadData = { id: 'new-1', title: 'Judul Baru' };
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({
          status: 'success',
          data: { thread: newThreadData },
        }),
      });

      const dispatch = jest.fn();
      const thunk = createThread({
        title: 'Judul Baru',
        body: 'Isi',
        category: 'it',
      });
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.type).toBe(createThread.fulfilled.type);
      expect(result.payload).toEqual(newThreadData);
    });

    test('createThread thunk should return rejected if API fails', async () => {
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({
          status: 'fail',
          message: 'Error',
        }),
      });

      const dispatch = jest.fn();
      const thunk = createThread({ title: 'X' });
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.type).toBe(createThread.rejected.type);
      expect(result.payload).toBe('Error');
    });
  });
});

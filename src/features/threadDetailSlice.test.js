import reducer, {
  toggleUpVote,
  toggleDownVote,
  toggleCommentUpVote,
  toggleCommentDownVote,
  fetchThreadDetail,
  createComment,
  upVoteThreadDetail,
  upVoteComment,
} from './threadDetailSlice';

global.fetch = jest.fn();

describe('threadDetailSlice', () => {
  const initialState = {
    thread: {
      id: '1',
      upVotesBy: [],
      downVotesBy: [],
      comments: [
        {
          id: 'c1',
          upVotesBy: [],
          downVotesBy: [],
        },
      ],
    },
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn();
  });

  describe('Reducer Logic', () => {
    test('should return initial state', () => {
      const result = reducer(undefined, { type: '@@INIT' });
      expect(result).toEqual({ thread: null, loading: false });
    });

    test('should handle toggleUpVote (add vote)', () => {
      const action = toggleUpVote('user1');
      const result = reducer(initialState, action);
      expect(result.thread.upVotesBy).toContain('user1');
    });

    test('should handle toggleDownVote', () => {
      const action = toggleDownVote('user1');
      const result = reducer(initialState, action);
      expect(result.thread.downVotesBy).toContain('user1');
    });

    test('should toggle comment upvote', () => {
      const action = toggleCommentUpVote({ commentId: 'c1', userId: 'user1' });
      const result = reducer(initialState, action);
      const comment = result.thread.comments.find((c) => c.id === 'c1');
      expect(comment.upVotesBy).toContain('user1');
    });

    test('should toggle comment downvote', () => {
      const action = toggleCommentDownVote({
        commentId: 'c1',
        userId: 'user1',
      });
      const result = reducer(initialState, action);
      const comment = result.thread.comments.find((c) => c.id === 'c1');
      expect(comment.downVotesBy).toContain('user1');
    });

    test('should handle fetchThreadDetail.fulfilled', () => {
      const fakeThread = { id: '1', comments: [] };
      const action = {
        type: fetchThreadDetail.fulfilled.type,
        payload: fakeThread,
      };
      const result = reducer(undefined, action);
      expect(result.thread).toEqual(fakeThread);
    });
  });

  describe('Thunks (Asynchronous)', () => {
    test('fetchThreadDetail thunk should return thread detail on success', async () => {
      const fakeThread = { id: 'thread-1' };
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({
          status: 'success',
          data: { detailThread: fakeThread },
        }),
      });

      const dispatch = jest.fn();
      const thunk = fetchThreadDetail('thread-1');
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.type).toBe(fetchThreadDetail.fulfilled.type);
      expect(result.payload).toEqual(fakeThread);
    });

    test('fetchThreadDetail thunk should handle failure', async () => {
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ status: 'fail' }),
      });
      const dispatch = jest.fn();
      const thunk = fetchThreadDetail('thread-1');
      const result = await thunk(dispatch, () => ({}), undefined);
      expect(result.type).toBe(fetchThreadDetail.rejected.type);
    });

    test('upVoteThreadDetail thunk should call correct URL and return true', async () => {
      Storage.prototype.getItem.mockReturnValue('fake-token');
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ status: 'success' }),
      });

      const dispatch = jest.fn();
      const thunk = upVoteThreadDetail({
        threadId: 'thread-1',
        isUpVoted: false,
      });
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/up-vote'),
        expect.any(Object),
      );
      expect(result.payload).toBe(true);
    });

    test('createComment thunk should call API with correct headers and return comment', async () => {
      const fakeComment = { id: 'c-1', content: 'test' };
      Storage.prototype.getItem.mockReturnValue('valid-token');
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({
          status: 'success',
          data: { comment: fakeComment },
        }),
      });

      const dispatch = jest.fn();
      const thunk = createComment({ threadId: 'thread-1', content: 'test' });
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/comments'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: expect.stringContaining('Bearer'),
          }),
        }),
      );
      expect(result.payload).toEqual(fakeComment);
    });

    test('upVoteComment thunk should call correct URL when not voted', async () => {
      Storage.prototype.getItem.mockReturnValue('token');
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ status: 'success' }),
      });

      const dispatch = jest.fn();
      const thunk = upVoteComment({
        threadId: 't1',
        commentId: 'c1',
        isUpVoted: false,
      });
      await thunk(dispatch, () => ({}), undefined);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/threads/t1/comments/c1/up-vote'),
        expect.any(Object),
      );
    });

    test('upVoteComment should call neutral-vote when already voted', async () => {
      Storage.prototype.getItem.mockReturnValue('token');
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ status: 'success' }),
      });

      const dispatch = jest.fn();
      const thunk = upVoteComment({
        threadId: 't1',
        commentId: 'c1',
        isUpVoted: true,
      });
      await thunk(dispatch, () => ({}), undefined);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/neutral-vote'),
        expect.any(Object),
      );
    });
  });
});

import reducer from './commentsSlice';

describe('commentsSlice', () => {
  const initialState = [];

  test('should return initial state', () => {
    const result = reducer(undefined, { type: '@@INIT' });
    expect(result).toEqual(initialState);
  });

  test('should return the current state for unknown action types', () => {
    const currentState = [{ id: 'c1', content: 'test content' }];
    const action = { type: 'UNKNOWN_ACTION' };

    const result = reducer(currentState, action);

    expect(result).toEqual(currentState);
  });
});

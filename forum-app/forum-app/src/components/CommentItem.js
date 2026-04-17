import React from 'react';

function CommentItem({ comment }) {
  return (
    <div style={{ borderBottom: '1px solid #ddd', marginBottom: '10px' }}>
      <p>{comment.content}</p>
      <small>
        by
        {comment.owner.name}
      </small>
    </div>
  );
}

export default CommentItem;

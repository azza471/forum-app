import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiThumbsUp, FiThumbsDown, FiMessageCircle } from 'react-icons/fi';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import {
  fetchThreadDetail,
  createComment,
  upVoteThreadDetail,
  downVoteThreadDetail,
  upVoteComment,
  downVoteComment,
  toggleCommentUpVote,
  toggleCommentDownVote,
  toggleUpVote,
  toggleDownVote,
} from '../features/threadDetailSlice';

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'baru saja';
  const interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} hari lalu`;
  const hours = Math.floor(seconds / 3600);
  if (hours >= 1) return `${hours} jam lalu`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes} menit lalu`;
}

function ThreadDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { thread, loading } = useSelector((state) => state.threadDetail);
  const [comment, setComment] = useState('');
  const token = localStorage.getItem('token');
  let userId = null;

  if (token) {
    try {
      userId = JSON.parse(atob(token.split('.')[1])).id;
    } catch (e) {
      userId = null;
    }
  }

  useEffect(() => {
    dispatch(fetchThreadDetail(id));
  }, [dispatch, id]);

  if (loading || !thread) return <div className="container">Loading...</div>;

  const isUpVoted = thread.upVotesBy.includes(userId);
  const isDownVoted = thread.downVotesBy.includes(userId);

  const handleUpVote = () => {
    if (!token) {
      alert('Login dulu untuk memberikan vote!');
      return;
    }
    dispatch(toggleUpVote(userId));
    dispatch(upVoteThreadDetail({ threadId: id, isUpVoted }));
  };

  const handleDownVote = () => {
    if (!token) {
      alert('Login dulu untuk memberikan vote!');
      return;
    }
    dispatch(toggleDownVote(userId));
    dispatch(downVoteThreadDetail({ threadId: id, isDownVoted }));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    dispatch(createComment({ threadId: id, content: comment }));
    setComment('');
  };

  const handleCommentUpVote = (commentId, isCommentUpVoted) => {
    if (!token) {
      alert('Login dulu untuk memberikan vote pada komentar!');
      return;
    }
    dispatch(toggleCommentUpVote({ commentId, userId }));
    dispatch(
      upVoteComment({ threadId: id, commentId, isUpVoted: isCommentUpVoted }),
    );
  };

  const handleCommentDownVote = (commentId, isCommentDownVoted) => {
    if (!token) {
      alert('Login dulu untuk memberikan vote pada komentar!');
      return;
    }
    dispatch(toggleCommentDownVote({ commentId, userId }));
    dispatch(
      downVoteComment({
        threadId: id,
        commentId,
        isDownVoted: isCommentDownVoted,
      }),
    );
  };

  return (
    <div className="container">
      <div className="thread-card">
        <div className="thread-category">
          #
          {thread.category}
        </div>
        <h2 className="thread-title">{thread.title}</h2>
        <div
          className="thread-body"
          dangerouslySetInnerHTML={{ __html: thread.body }}
        />
        <div className="thread-stats">
          <button
            type="button"
            className={isUpVoted ? 'vote-btn active' : 'vote-btn'}
            onClick={handleUpVote}
          >
            {isUpVoted ? <AiFillLike /> : <FiThumbsUp />}
            {' '}
            {thread.upVotesBy.length}
          </button>
          <button
            type="button"
            className={isDownVoted ? 'vote-btn active' : 'vote-btn'}
            onClick={handleDownVote}
          >
            {isDownVoted ? <AiFillDislike /> : <FiThumbsDown />}
            {' '}
            {thread.downVotesBy.length}
          </button>
          <span className="comment-icon">
            <FiMessageCircle />
            {' '}
            {thread.comments.length}
          </span>
        </div>
        <div className="thread-footer">
          <div className="thread-owner">
            <img src={thread.owner.avatar} alt="" />
            <span>
              Dibuat oleh
              {' '}
              <b>{thread.owner.name}</b>
            </span>
          </div>
          <div className="thread-time">{timeAgo(thread.createdAt)}</div>
        </div>
      </div>

      {token ? (
        <div className="thread-card">
          <h3>Tulis Komentar</h3>
          <form onSubmit={handleCommentSubmit}>
            <textarea
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
              }}
              required
            />
            <button
              type="submit"
              className="login-btn"
              style={{ marginTop: '10px' }}
            >
              Kirim Komentar
            </button>
          </form>
        </div>
      ) : (
        <div className="thread-card">
          <p>
            Silakan
            {' '}
            <Link to="/login">Login</Link>
            {' '}
            untuk berkomentar.
          </p>
        </div>
      )}

      <h3 style={{ margin: '20px 0' }}>
        Komentar (
        {thread.comments.length}
        )
      </h3>

      {thread.comments.map((c) => {
        const isUp = c.upVotesBy.includes(userId);
        const isDown = c.downVotesBy.includes(userId);
        return (
          <div key={c.id} className="thread-card">
            <div className="thread-owner">
              <img src={c.owner.avatar} alt="" />
              <span>{c.owner.name}</span>
            </div>
            <div
              className="thread-body"
              dangerouslySetInnerHTML={{ __html: c.content }}
            />
            <div className="thread-stats">
              <button
                type="button"
                className={isUp ? 'vote-btn active' : 'vote-btn'}
                onClick={() => handleCommentUpVote(c.id, isUp)}
              >
                {isUp ? <AiFillLike /> : <FiThumbsUp />}
                {' '}
                {c.upVotesBy.length}
              </button>
              <button
                type="button"
                className={isDown ? 'vote-btn active' : 'vote-btn'}
                onClick={() => handleCommentDownVote(c.id, isDown)}
              >
                {isDown ? <AiFillDislike /> : <FiThumbsDown />}
                {' '}
                {c.downVotesBy.length}
              </button>
            </div>
            <div className="thread-time">{timeAgo(c.createdAt)}</div>
          </div>
        );
      })}
    </div>
  );
}

export default ThreadDetailPage;

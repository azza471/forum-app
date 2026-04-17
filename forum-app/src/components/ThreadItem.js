import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { FiThumbsUp, FiThumbsDown, FiMessageCircle } from 'react-icons/fi';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import {
  upVoteThread,
  downVoteThread,
  neutralVoteThread,
} from '../features/threadsSlice';

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const day = Math.floor(seconds / 86400);
  if (day >= 1) return `${day} hari lalu`;

  const hour = Math.floor(seconds / 3600);
  if (hour >= 1) return `${hour} jam lalu`;

  const minute = Math.floor(seconds / 60);
  if (minute >= 1) return `${minute} menit lalu`;

  if (seconds >= 1) return `${seconds} detik lalu`;

  return 'baru saja';
}

function safeDecode(token) {
  try {
    if (!token) return null;
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
}

function ThreadItem({ thread }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const payload = safeDecode(token);
  const userId = payload?.id;

  const isUpVoted = thread.upVotesBy.includes(userId);
  const isDownVoted = thread.downVotesBy.includes(userId);

  const handleUpVote = () => {
    if (!token) {
      alert('Login dulu untuk vote');
      return;
    }

    if (isUpVoted) {
      dispatch(neutralVoteThread(thread.id));
    } else {
      dispatch(upVoteThread(thread.id));
    }
  };

  const handleDownVote = () => {
    if (!token) {
      alert('Login dulu untuk vote');
      return;
    }

    if (isDownVoted) {
      dispatch(neutralVoteThread(thread.id));
    } else {
      dispatch(downVoteThread(thread.id));
    }
  };

  const preview = `${thread.body.replace(/<[^>]*>?/gm, '').slice(0, 160)}...`;

  return (
    <div className="thread-card">
      <div className="thread-category">
        #
        {thread.category}
      </div>

      <Link to={`/thread/${thread.id}`} className="thread-title">
        {thread.title}
      </Link>

      <p className="thread-body">{preview}</p>

      <div className="thread-stats">
        <span
          data-testid="upvote-btn"
          className={isUpVoted ? 'vote-btn active' : 'vote-btn'}
          onClick={handleUpVote}
        >
          {isUpVoted ? <AiFillLike /> : <FiThumbsUp />}
          {thread.upVotesBy.length}
        </span>

        <span
          data-testid="downvote-btn"
          className={isDownVoted ? 'vote-btn active' : 'vote-btn'}
          onClick={handleDownVote}
        >
          {isDownVoted ? <AiFillDislike /> : <FiThumbsDown />}
          {thread.downVotesBy.length}
        </span>

        <span className="comment-icon">
          <FiMessageCircle />
          {thread.totalComments}
        </span>
      </div>

      <div className="thread-footer">
        <div className="thread-owner">
          <img src={thread?.owner?.avatar} alt="avatar" />
          <span>{thread?.owner?.name}</span>
        </div>

        <span className="thread-time">{timeAgo(thread.createdAt)}</span>
      </div>
    </div>
  );
}

export default ThreadItem;

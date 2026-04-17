import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchLeaderboards } from '../features/leaderboardSlice';

function LeaderboardPage() {
  const dispatch = useDispatch();

  const { leaderboards, loading } = useSelector((state) => state.leaderboards);

  useEffect(() => {
    dispatch(fetchLeaderboards());
  }, [dispatch]);

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h2 className="forum-title">Klasmen Pengguna Aktif</h2>

      {leaderboards.map((item, index) => (
        <div key={item.user.id} className="thread-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <b>
                #
                {index + 1}
              </b>

              <img
                src={item.user.avatar}
                alt={item.user.name}
                style={{
                  width: '35px',
                  height: '35px',
                  borderRadius: '50%',
                }}
              />

              <span>{item.user.name}</span>
            </div>

            <div>
              <b>{item.score}</b>
              {' '}
              points
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LeaderboardPage;

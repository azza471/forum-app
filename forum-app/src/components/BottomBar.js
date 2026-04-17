import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineTrophy,
  HiOutlineUser,
} from 'react-icons/hi2';
import { logout } from '../features/authSlice';

function BottomBar() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="bottom-bar">
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? 'menu active' : 'menu')}
      >
        <HiOutlineChatBubbleLeftRight size={22} />
        <span>Threads</span>
      </NavLink>

      <NavLink
        to="/leaderboard"
        className={({ isActive }) => (isActive ? 'menu active' : 'menu')}
      >
        <HiOutlineTrophy size={22} />
        <span>Leaderboard</span>
      </NavLink>

      {token ? (
        <div
          className="menu"
          onClick={handleLogout}
          style={{ cursor: 'pointer' }}
        >
          <HiOutlineUser size={22} />
          <span>Logout</span>
        </div>
      ) : (
        <NavLink
          to="/login"
          className={({ isActive }) => (isActive ? 'menu active' : 'menu')}
        >
          <HiOutlineUser size={22} />
          <span>Login</span>
        </NavLink>
      )}
    </div>
  );
}

export default BottomBar;

import React from 'react';
import {
  Routes, Route, Link, useLocation,
} from 'react-router-dom';
import { useSelector } from 'react-redux';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BottomBar from './components/BottomBar';
import Header from './components/Header';
import ThreadDetailPage from './pages/ThreadDetailPage';
import LeaderboardPage from './pages/LeaderboardPage';
import CreateThreadPage from './pages/CreateThreadPage';

function App() {
  const location = useLocation();
  const { auth } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');

  const isThreadPage = location.pathname === '/';
  const isLoggedIn = auth || token;

  return (
    <>
      <Header />

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tambah" element={<CreateThreadPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/thread/:id" element={<ThreadDetailPage />} />
        </Routes>
      </div>

      {isThreadPage && isLoggedIn && (
        <Link
          to="/tambah"
          className="add-thread-floating"
          data-testid="create-thread-btn"
        >
          +
        </Link>
      )}

      <BottomBar />
    </>
  );
}

export default App;

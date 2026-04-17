import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createThread } from '../features/threadsSlice';

function CreateThreadPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [body, setBody] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createThread({ title, body, category })).then((result) => {
      if (!result.error) {
        navigate('/');
      }
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Buat Diskusi Baru</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Judul</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Kategori (Opsional)</label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="body">Isi Diskusi</label>
            <textarea
              id="body"
              rows="6"
              style={{
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontFamily: 'inherit',
              }}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">
            Buat
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateThreadPage;

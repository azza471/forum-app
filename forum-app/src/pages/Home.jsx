import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchThreads } from '../features/threadsSlice';
import ThreadItem from '../components/ThreadItem';

function Home() {
  const dispatch = useDispatch();
  const { threads, loading } = useSelector((state) => state.threads);

  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchThreads());
  }, [dispatch]);

  const categories = [...new Set(threads.map((t) => t.category))];

  // filter thread
  const filteredThreads = selectedCategory
    ? threads.filter((t) => t.category === selectedCategory)
    : threads;

  // toggle kategori
  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null); // klik lagi → reset
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <div className="container">
      {/* kategori populer */}
      <div className="category-section">
        <h3>Kategori populer</h3>

        <div className="categories">
          {categories.map((cat) => (
            <span
              key={cat}
              className={
                selectedCategory === cat
                  ? 'category-pill active'
                  : 'category-pill'
              }
              onClick={() => handleCategoryClick(cat)}
            >
              #
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* threads */}
      <div className="threads">
        {loading && <p>Loading...</p>}

        {filteredThreads.map((thread) => (
          <ThreadItem key={thread.id} thread={thread} />
        ))}
      </div>
    </div>
  );
}

export default Home;

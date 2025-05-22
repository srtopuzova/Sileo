import { useState, useEffect } from 'react'
import axios from '../api/axios'
import { Link } from 'react-router-dom'

export default function Home() {
  const [articles, setArticles] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    start_date: '',
    end_date: '',
  })

  const [debouncedSearch, setDebouncedSearch] = useState(filters.search)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search)
    }, 500)
    return () => {
      clearTimeout(handler)
    }
  }, [filters.search])

  useEffect(() => {
    async function fetchArticles() {
        setLoading(true)
      try {
        const params = {
          search: debouncedSearch,
          category: filters.category,
          start_date: filters.start_date,
          end_date: filters.end_date,
        }
        const response = await axios.get('/articles/', { params })
        setArticles(response.data)
        setError('')
      } catch (err) {
        setError('Failed to load articles.')
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [debouncedSearch, filters.category, filters.start_date, filters.end_date])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }))
  }

  return (
    <div>
      <h1>Articles</h1>
      <div>
        <input
          type="text"
          name="search"
          placeholder="Search articles"
          value={filters.search}
          onChange={handleFilterChange}
        />
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
        >
          <option value="">All Categories</option>
          <option value="Ethics">Ethics</option>
          <option value="Logic">Logic</option>
          <option value="Metaphysics">Metaphysics</option>
          <option value="Epistemology">Epistemology</option>
          <option value="Aesthetics">Aesthetics</option>
          <option value="Existentialism">Existentialism</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="date"
          name="start_date"
          value={filters.start_date}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="end_date"
          value={filters.end_date}
          onChange={handleFilterChange}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading articles...</p>}
      {!loading && articles.length === 0 && !error && <p>No articles found.</p>}
      <ul>
        {articles.map((article) => (
          <li key={article.id} style={{ marginBottom: '1rem' }}>
            <Link
              to={`/articles/${article.id}`}
              style={{ fontWeight: 'bold', fontSize: '1.2rem' }}
            >
              {article.title}
            </Link>
            <p>by {article.author}</p>
            <p>{article.content.slice(0, 100) + '...'}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

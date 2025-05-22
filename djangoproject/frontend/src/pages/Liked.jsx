import { useEffect, useState } from 'react'
import axios from '../api/axios'
import { Link } from 'react-router-dom'

export default function Liked() {
  const [likedArticles, setLikedArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  useEffect(() => {
    async function fetchLikedArticles() {
      setLoading(true)
      try {
        const response = await axios.get('/articles/liked/', {
          headers: { Authorization: `Token ${token}` },
        })
        setLikedArticles(response.data)
        setError('')
      } catch (err) {
        setError('Failed to load liked articles.')
      } finally {
        setLoading(false)
      }
    }

    fetchLikedArticles()
  }, [])

  return (
    <div>
      <h1>Liked Articles</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading liked articles...</p>}
      {!loading && likedArticles.length === 0 && !error && <p>You haven’t liked any articles yet.</p>}
      <ul>
        {likedArticles.map((article) => (
          <li key={article.id} style={{ marginBottom: '1rem' }}>
            <Link
              to={`/articles/${article.id}`}
              style={{ fontWeight: 'bold', fontSize: '1.2rem' }}
            >
              {article.title}
            </Link>
            <p>by {article.user}</p>
            <p>{article.content.slice(0, 100) + '...'}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

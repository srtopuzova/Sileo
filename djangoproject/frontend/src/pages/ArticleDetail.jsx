import { useState, useEffect } from 'react'
import axios from '../api/axios'
import { useParams } from 'react-router-dom'

export default function ArticleDetail() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const username = localStorage.getItem('username')
  const token = localStorage.getItem('token')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const articleRes = await axios.get(`/articles/${id}/`)
        setArticle(articleRes.data)
        setError('')
      } catch (err) {
        setError('Failed to load article or comments.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])


  if (loading) return <p>Loading article...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!article) return <p>No article found.</p>

  return (
    <div>
      <h1>{article.title}</h1>
      <p>by {article.user}</p>
      <article>{article.content}</article>

      <section style={{ marginTop: '2rem' }}>
        <a href={`/articles/${id}/comments/`}>
        <button>View Comments</button>
        </a>
      </section>

    </div>
  )
}

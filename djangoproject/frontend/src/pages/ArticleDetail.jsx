import { useState, useEffect } from 'react'
import axios from '../api/axios'
import { useParams, useNavigate, Link } from 'react-router-dom'

export default function ArticleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [submittingEdit, setSubmittingEdit] = useState(false)

  const username = localStorage.getItem('username')
  const token = localStorage.getItem('token')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const articleRes = await axios.get(`/articles/${id}/`)
        setArticle(articleRes.data)
        setEditTitle(articleRes.data.title)
        setEditContent(articleRes.data.content)
        setError('')
      } catch (err) {
        setError('Failed to load article.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this article?')) return

    try {
      await axios.delete(`/articles/${id}/`, {
        headers: { Authorization: `Token ${token}` }
      })
      navigate('/')
    } catch (err) {
      setError('Failed to delete article.')
    }
  }

  const handleEditSubmit = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      setError('Title and content cannot be empty.')
      return
    }

    setSubmittingEdit(true)
    try {
      const res = await axios.put(
        `/articles/${id}/`,
        { title: editTitle, content: editContent },
        { headers: { Authorization: `Token ${token}` } }
      )
      setArticle(res.data)
      setEditing(false)
      setError('')
    } catch (err) {
      setError('Failed to update article.')
    } finally {
      setSubmittingEdit(false)
    }
  }

  if (loading) return <p>Loading article...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!article) return <p>No article found.</p>

  return (
    <div>
      {editing ? (
        <>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={submittingEdit}
            style={{ width: '100%', fontSize: '1.5rem', marginBottom: '0.5rem' }}
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={10}
            style={{ width: '100%' }}
            disabled={submittingEdit}
          />
          <br />
          <button type="button" onClick={handleEditSubmit} disabled={submittingEdit}>
            {submittingEdit ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h1>{article.title}</h1>
          <p>by {article.user}</p>
          <p>Category: <strong>{article.category}</strong></p>
          <article>{article.content}</article>
          <small>
            {article.updated_at === article.created_at
              ? `Posted: ${new Date(article.created_at).toLocaleString()}`
              : `Edited: ${new Date(article.updated_at).toLocaleString()}`}
          </small>
        </>
      )}

      {username === article.user && !editing && (
        <div style={{ marginTop: '1rem' }}>
          <button type="button" onClick={() => setEditing(true)}>Edit Article</button>
          <button type="button" onClick={handleDelete} style={{ marginLeft: '1rem' }}>Delete Article</button>
        </div>
      )}

      <section style={{ marginTop: '2rem' }}>
        <Link to={`/articles/${id}/comments/`}>
          <button type="button">View Comments</button>
        </Link>
      </section>
    </div>
  )
}

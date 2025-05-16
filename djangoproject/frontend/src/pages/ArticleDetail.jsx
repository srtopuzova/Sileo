import { useState, useEffect } from 'react'
import axios from '../api/axios'
import { useParams } from 'react-router-dom'

export default function ArticleDetail() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [comments, setComments] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const [commentError, setCommentError] = useState('')
  const [commentSubmitting, setCommentSubmitting] = useState(false)

  const username = localStorage.getItem('username')
  const token = localStorage.getItem('token')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [articleRes, commentsRes] = await Promise.all([
          axios.get(`/articles/${id}/`),
          axios.get(`/articles/${id}/comments/`),
        ])
        setArticle(articleRes.data)
        setComments(commentsRes.data)
        setError('')
      } catch (err) {
        setError('Failed to load article or comments.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!commentContent.trim()) {
      setCommentError('Please enter your comment.')
      return
    }

    setCommentSubmitting(true)
    setCommentError('')

    try {
      const response = await axios.post(
        `/articles/${id}/comments/`,
        { content: commentContent },
        { headers: { Authorization: `Token ${token}` } }
      )
      setComments((prev) => [response.data, ...prev])
      setCommentContent('')
    } catch (err) {
      setCommentError('Failed to submit comment.')
    } finally {
      setCommentSubmitting(false)
    }
  }

  if (loading) return <p>Loading article...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!article) return <p>No article found.</p>

  return (
    <div>
      <h1>{article.title}</h1>
      <p>by {article.user}</p>
      <article>{article.content}</article>

      <section style={{ marginTop: '2rem' }}>
        <h2>Comments</h2>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <ul>
            {comments.map((comment) => (
              <li key={comment.id} style={{ marginBottom: '1rem' }}>
                <p><b>{comment.user}</b> commented:</p>
                <p>{comment.content}</p>
                <small>Last updated: {new Date(comment.updated_at).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h3>Add a Comment</h3>
        {username ? (
          <form onSubmit={handleCommentSubmit}>
            <div>
              <label>
                Comment:
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  disabled={commentSubmitting}
                  rows={4}
                  cols={50}
                />
              </label>
            </div>
            {commentError && <p style={{ color: 'red' }}>{commentError}</p>}
            <button type="submit" disabled={commentSubmitting} style={{ marginTop: '0.5rem' }}>
              {commentSubmitting ? 'Submitting...' : 'Submit Comment'}
            </button>
          </form>
        ) : (
          <p>You must be logged in to comment.</p>
        )}
      </section>
    </div>
  )
}

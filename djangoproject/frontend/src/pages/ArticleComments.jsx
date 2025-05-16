import { useState, useEffect } from 'react'
import axios from '../api/axios'
import { useParams } from 'react-router-dom'

export default function ArticleComments() {
  const { id } = useParams()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [commentContent, setCommentContent] = useState('')
  const [commentError, setCommentError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editedContent, setEditedContent] = useState('')
  const [editSubmitting, setEditSubmitting] = useState(false)

  const username = localStorage.getItem('username')
  const token = localStorage.getItem('token')

  useEffect(() => {
    async function fetchComments() {
      setLoading(true)
      try {
        const res = await axios.get(`/articles/${id}/comments/`)
        setComments(res.data)
        setError('')
      } catch (err) {
        setError('Failed to load comments.')
      } finally {
        setLoading(false)
      }
    }
    fetchComments()
  }, [id])

  const handleEditClick = (comment) => {
    setEditingCommentId(comment.id)
    setEditedContent(comment.content)
    setCommentError('')
  }

  const handleEditCancel = () => {
    setEditingCommentId(null)
    setEditedContent('')
    setCommentError('')
  }  

  const handleEditSubmit = async (commentId) => {
    if (!editedContent.trim()) {
        setCommentError('Please enter a comment.')
        return
    }

    setEditSubmitting(true)
    setCommentError('')

    try {
        await axios.put(
        `/articles/${id}/comments/${commentId}/`,
        { content: editedContent },
        { headers: { Authorization: `Token ${token}` } }
        )
        setComments((prev) =>
        prev.map((c) =>
            c.id === commentId
            ? { ...c, content: editedContent, updated_at: new Date().toISOString() }
            : c
        )
        )
        setEditingCommentId(null)
        setEditedContent('')
        setCommentError('')
    } catch (err) {
        setCommentError('Failed to update comment.')
    } finally {
        setEditSubmitting(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!commentContent.trim()) {
      setCommentError('Please enter a comment.')
      return
    }

    setSubmitting(true)
    setCommentError('')

    try {
      const res = await axios.post(
        `/articles/${id}/comments/`,
        { content: commentContent },
        { headers: { Authorization: `Token ${token}` } }
      )
      setComments(prev => [res.data, ...prev])
      setCommentContent('')
    } catch (err) {
      setCommentError('Failed to submit comment.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return

    try {
        await axios.delete(
        `/articles/${id}/comments/${commentId}/`,
        { headers: { Authorization: `Token ${token}` } }
        )
        setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch (err) {
        setError('Failed to delete comment.')
    }
  }

  return (
    <div>
      <h2>Comments</h2>

      {loading ? (
        <p>Loading comments...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul>
          {comments.map(comment => (
            <li key={comment.id} style={{ marginBottom: '1rem' }}>
            <p><strong>{comment.user}</strong> commented:</p>
            
            {editingCommentId === comment.id ? (
                <>
                <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={4}
                    cols={50}
                />
                {commentError && <p style={{ color: 'red' }}>{commentError}</p>}
                <button onClick={() => handleEditSubmit(comment.id)} disabled={editSubmitting}>
                    {editSubmitting ? 'Saving...' : 'Save'}
                </button>
                <button onClick={handleEditCancel}>Cancel</button>
                </>
            ) : (
                <>
                <p>{comment.content}</p>
                {username === comment.user && (
                    <>
                    <button onClick={() => handleEditClick(comment)}>Edit</button>
                    <button onClick={() => handleDelete(comment.id)}>Delete</button>
                    </>
                )}
                </>
            )}

            <small>
                {comment.updated_at === comment.created_at
                ? `Posted: ${new Date(comment.created_at).toLocaleString()}`
                : `Edited: ${new Date(comment.updated_at).toLocaleString()}`}
            </small>

            </li>

          ))}
        </ul>
      )}

      <section style={{ marginTop: '2rem' }}>
        <h3>Add a Comment</h3>
        {username ? (
          <form onSubmit={handleSubmit}>
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              rows={4}
              cols={50}
              disabled={submitting}
            />
            {commentError && <p style={{ color: 'red' }}>{commentError}</p>}
            <br />
            <button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Comment'}
            </button>
          </form>
        ) : (
          <p>You must be logged in to comment.</p>
        )}
      </section>
    </div>
  )
}

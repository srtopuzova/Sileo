import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem('token')

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <nav style={navStyle}>
      <Link to="/">Home</Link>
      <Link to="/favorites">Favorites</Link>

      {isLoggedIn ? (
        <button onClick={handleLogout} style={buttonStyle}>Logout</button>
      ) : (
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>
      )}
    </nav>
  )
}

const navStyle = {
  display: 'flex',
  gap: '1rem',
  padding: '1rem',
  backgroundColor: '#f0f0f0'
}

const buttonStyle = {
  background: 'none',
  border: 'none',
  color: 'blue',
  cursor: 'pointer',
  textDecoration: 'underline',
  padding: 0,
  fontSize: '1rem'
}
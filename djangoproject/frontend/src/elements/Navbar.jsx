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
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/favorites">Favorites</Link></li>

        {isLoggedIn ? (
          <li>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </li>
        ) : (
          <>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  )
}

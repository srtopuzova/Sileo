import { Link, useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const isLoggedIn = !!token

  async function handleLogout() {
    try {
      await axios.post('/users/logout/', null, {
        headers: {
          Authorization: `Token ${token}`
        }
      })
    } catch (err) {
      console.error('Logout failed:', err)
    }
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>

        {isLoggedIn ? (
          <>
            <li><Link to="/favorites">Favorites</Link></li><li>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </li>
          </>
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

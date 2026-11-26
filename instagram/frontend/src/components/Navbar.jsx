import { Link } from 'react-router';

import { useAuth } from '../hooks/useAuth';


function NavBar() {
    const { token, user, logout } = useAuth();

    return (
        <nav className="navbar bg-white border-bottom sticky-top px-3">
            <Link className="navbar-brand" to="/">insta</Link>
            { token
                ? <div className="d-flex align-items-center gap-2">
                    <Link className="text-reset" to="/new"><i className="bi bi-plus-square"></i></Link>
                    { user && <Link className="text-reset" to={`/users/${user.username}`}>{ user.username }</Link> }
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={ logout }>Logout</button>
                  </div>
                : <Link className="btn btn-sm btn-outline-secondary" to="/login">Login</Link>
            }
        </nav>
    )
}

export default NavBar;
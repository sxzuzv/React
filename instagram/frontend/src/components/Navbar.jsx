import { Link } from 'react-router';


function NavBar() {
    return (
        <nav className="navbar bg-white border-bottom sticky-top px-3">
            <Link className="navbar-brand" to="/">insta</Link>
        </nav>
    )
}

export default NavBar;
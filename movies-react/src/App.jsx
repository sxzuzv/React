import { Routes, Route, Link } from 'react-router';

import MovieList from './MovieList.jsx';
import MovieDetail from './MovieDetail.jsx';


function App() {
    return (
        <>
        <nav className="tools">
            <Link to="/">상영 중 영화</Link>
        </nav>
        <Routes>
            <Route path='/' element={ <MovieList /> } />
            <Route path='/movies/:id' element={ <MovieDetail /> } />
        </Routes>
        </>
    )
}

export default App;
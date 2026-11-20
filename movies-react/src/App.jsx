import { Routes, Route, Link } from 'react-router';

import MovieList from './MovieList.jsx';
import MovieDetail from './MovieDetail.jsx';
import MovieSearch from './MovieSearch.jsx';
import shape from './shape';


function App() {
    return (
        <>
        <nav className="tools">
            <Link to="/">상영 중 영화</Link>
            <Link to="/search">영화 검색</Link>
        </nav>
        <Routes>
            <Route path='/' element={ <MovieList /> } />
            <Route path='/movies/:id' element={ <MovieDetail /> } />
            <Route path='/search' element={ <MovieSearch /> } />
        </Routes>
        </>
    )
}

export default App;
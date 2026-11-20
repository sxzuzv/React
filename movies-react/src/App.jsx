import { Routes, Route } from 'react-router';

import MovieList from './MovieList.jsx';
import MovieDetail from './MovieDetail.jsx';


function App() {
    return (
        <>
        <Routes>
            <Route path='/' element={ <MovieList /> } />
            <Route path='/movies/:id' element={ <MovieDetail /> } />
        </Routes>
        </>
    )
}

export default App;
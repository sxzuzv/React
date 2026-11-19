import { useState, useEffect } from 'react';

import tmdb from './api';
import MovieCard from './MovieCard';


function App() {
    const [ movies, setMovies ] = useState([]);

    useEffect(() => {
        async function load() {
            const { results } = await tmdb('/movie/now_playing');
            setMovies(results);
        }
        load();
    }, []);

    return(
        <>
        <div id="card">
            { movies.map((movie) => <MovieCard key={ movie.id } { ...movie } />)}
        </div>
        </>
    )
}

export default App;
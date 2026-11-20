import { useState, useEffect } from 'react';

import tmdb from './api';
import MovieCard from './MovieCard';
import shape from './shape';


function MovieList() {
    const [ movies, setMovies ] = useState([]);

    useEffect(() => {
        async function load() {
            const { results } = await tmdb('/movie/now_playing');
            const { genres } = await tmdb('/genre/movie/list');
            setMovies(results.map(m => shape(m, genres)));
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

export default MovieList;
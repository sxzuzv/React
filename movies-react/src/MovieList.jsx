import { useState, useEffect } from 'react';

import tmdb from './api';
import MovieCard from './MovieCard';
import shape from './shape';


function MovieList() {
    const [ movies, setMovies ] = useState([]);
    const [ query, setQuery ] = useState('');

    useEffect(() => {
        async function load() {
            const { results } = await tmdb('/movie/now_playing');
            const { genres } = await tmdb('/genre/movie/list');
            setMovies(results.map(m => shape(m, genres)));
        }
        load();
    }, []);

    const shown = movies.filter(m => m.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()));

    return(
        <>
            <div className="tools">
                <label for="search">영화를 검색해보세용 : </label>
                <input type="text" id="search" onChange={ e => setQuery(e.target.value) } />
            </div>

            <div id="card">
                { shown.map((movie) => <MovieCard key={ movie.id } { ...movie } />)}
            </div>
        </>
    )
}

export default MovieList;
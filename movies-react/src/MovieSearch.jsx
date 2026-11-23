
import { useState } from 'react';

import tmdb from './api.js';
import shape from './shape';
import MovieCard from './MovieCard';


function MovieSearch() {
    const [ query, setQuery ] = useState('');
    const [ movies, setMovies ] = useState([]);

    async function handleSubmit(e) {
        e.preventDefault();

        const { results } = await tmdb(`/search/movie?query=${query}`);
        const { genres } = await tmdb('/genre/movie/list');
        setMovies(results.map(m => shape(m, genres)));
    }

    return (
        <>
            <h1>영화 검색</h1>
            <form action="" className="tools" onSubmit={ handleSubmit }> 
                <input type="text" onChange={ e => setQuery(e.target.value) }/>
                <button>찾기</button>
            </form>

            <div id="cards">
                { movies.map(movie => 
                    <MovieCard key={ movie.id } { ...movie } />
                )}
            </div>
        </>
    )
}

export default MovieSearch;
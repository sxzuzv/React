import { useState, useEffect } from 'react';

import tmdb from './api';
import MovieCard from './MovieCard';
import shape from './shape';


function MovieList() {
    const [ movies, setMovies ] = useState([]);
    const [ query, setQuery ] = useState('');

    const [ genreNames, setGenereNames ] = useState([]);
    const [ selectedGenre, setSelectedGenre ] = useState('all');

    const [ wishIds, setWishIds ] = useState([]);

    useEffect(() => {
        async function load() {
            const { results } = await tmdb('/movie/now_playing');
            const { genres } = await tmdb('/genre/movie/list');
            setMovies(results.map(m => shape(m, genres)));

            const shownGenres = genres.filter(genre => {
                const hasMovie = results.filter(movie => movie.genre_ids.includes(genre.id));
                return hasMovie.length > 0;
            });
            setGenereNames(shownGenres.map(g => g.name));
        }
        load();
    }, []);

    let shown = movies.filter(m => m.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()));

    if (selectedGenre !== 'all') {
        shown = shown.filter(m => m.genre_ids.includes(selectedGenre));
    }

    function toggleWish(id) {
        let next;

        if (wishIds.includes(id)) { 
            next = wishIds.filter(wishId => wishId !== id);    // 해당 id만 뺀 새 배열
        } else {
            next = [...wishIds, id];                    // 기존 목록 + 새 id
        }

        setWishIds(next);   // 계산한 다음 상태로 교체
    }

    return(
        <>
            <div className="tools">
                <label for="search">영화를 검색해보세용 : </label>
                <input type="text" id="search" onChange={ e => setQuery(e.target.value) } />

                <div>{ ['all', ...genreNames].map(name => 
                    <button 
                    key={ name }
                    onClick={ () => { setSelectedGenre(name) }}
                    className={ name === selectedGenre ? 'on' : '' }
                    >
                        { name }
                    </button>) 
                    }
                </div>
            </div>

            <div id="card">
                { shown.map((movie) => 
                <MovieCard 
                    key={ movie.id } { ...movie } 
                    wish={ wishIds.includes(movie.id) } 
                    onWish={ toggleWish }
                />
                )}
            </div>
        </>
    )
}

export default MovieList;
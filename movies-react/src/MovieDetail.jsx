import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import tmdb from './api.js';


function MovieDetail() {
    const { id } = useParams();
    const [ movie, setMovie ] = useState({});

    useEffect(() => {
        async function load() {
            setMovie(await tmdb(`/movie/${id}`));
        }
        load();
    }, [id]);


    return (
        <div className="detail">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
            <h2>{ movie.title }번 영화 상세 페이지</h2>
            <p>{ movie.tagline }번 영화 상세 페이지</p>
            <p>{ movie.overview }번 영화 상세 페이지</p>
        </div>
    )
}

export default MovieDetail;
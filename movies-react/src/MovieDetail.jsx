import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import tmdb from './api.js';


function MovieDetail() {
    const { id } = useParams();
    const [ movie, setMovie ] = useState(null);
    const [ error, setError ] = useState('');

    useEffect(() => {
        async function load() {
            try {
                setMovie(await tmdb(`/movie/${id}`));
            } catch (e) {
                setError(e.message);
            }
        }
        load();
    }, [id]);

    if (!movie) return <p>영화를 불러오는 중입니다.</p>
    if (error) return <p>영화를 불러오지 못했습니다.</p>

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
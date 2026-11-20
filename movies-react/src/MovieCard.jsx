import { Link } from 'react-router';

import { useWish } from './useWish';


function MovieCard({ id, title, poster_path, vote_average, release_date, genre_ids }) {
    const { wishIds, toggleWish } = useWish();

    function handleWish(e) {
        e.preventDefault();
        toggleWish(id);
    }

    return(
        <Link className="card" to={ `/movies/${ id }` }>
            <img src={ poster_path } alt="movie" />
            <h3>{ title }</h3>
            <p>평점 : { vote_average } / 개봉일: { release_date }</p>
            <p>장르: { genre_ids.join(' ') }</p>
            <button onClick={ e => handleWish(e) }>{ wishIds.includes(id) ? '♥️' : '🤍' }wish</button>
        </Link>
    )
}

export default MovieCard;
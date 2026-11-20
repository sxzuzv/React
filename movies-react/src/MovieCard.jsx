import { Link } from 'react-router';


function MovieCard({ id, title, poster_path, vote_average, release_date, genre_ids, wish, onWish }) {
    function handleWish(e) {
        e.preventDefault();
        onWish(id);
    }

    return(
        <Link className="card" to={ `/movies/${ id }` }>
            <img src={ poster_path } alt="movie" />
            <h3>{ title }</h3>
            <p>평점 : { vote_average } / 개봉일: { release_date }</p>
            <p>장르: { genre_ids.join(' ') }</p>
            <button onClick={ e => handleWish(e) }>{ wish ? '♥️' : '🤍' }wish</button>
        </Link>
    )
}

export default MovieCard;
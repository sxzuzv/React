import { Link } from 'react-router';


function MovieCard({ id, title, poster_path, vote_average, release_date, genre_ids }) {
    return(
        <Link className="cards" to={ `/movies/${ id }` }>
            <img src={ poster_path } alt="movie" />
            <h3>{ title }</h3>
            <p>평점 : { vote_average } / 개봉일: { release_date }</p>
            <p>장르: { genre_ids.join(' ') }</p>
        </Link>
    )
}

export default MovieCard;
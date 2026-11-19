function MovieCard({ title, poster_path, vote_average, release_date }) {
    return(
        <div className="cards">
            <img src={ `https://image.tmdb.org/t/p/w300${poster_path}` } alt="movie" />
            <h3>{ title }</h3>
            <p>평점 : { vote_average } / 개봉일: { release_date }</p>
        </div>
    )
}

export default MovieCard;
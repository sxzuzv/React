function MovieCard({ title, poster, rating, date, genres }) {
    return(
        <div className="cards">
            <img src={ poster } alt={ title } />
            <h3>{ title }</h3>
            <p>평점 : { rating } / 개봉일: { date }</p>
            <p>장르 : { genres.join(' ') }</p>
        </div>
    )
}

export default MovieCard;
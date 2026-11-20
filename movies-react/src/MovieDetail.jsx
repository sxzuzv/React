import { useParams } from 'react-router';


function MovieDetail() {
    const { id } = useParams();
    return <p>{ id }번 영화 상세 페이지</p>
}

export default MovieDetail;
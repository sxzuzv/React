import { useParams } from 'react-router'


function PostDetail() {
    const { id } = useParams();

    return (
        <h2>{ id }번 글의 상세 페이지입니당</h2>
    )
}

export default PostDetail;
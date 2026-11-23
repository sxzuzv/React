import { SERVER_URL } from "../api.js";


function PostCard({ content, created_at, image_url, user, likes }) {
    return (
        <article className="card mb-4 p-3">
            <h3>{user.username}</h3>
            {image_url && <img src={`${SERVER_URL}${image_url}`} alt={content} className="img-fluid" />}
            <p>{content}</p>
            <p className="small text-secondary">♥ {likes.length} · {new Date(created_at).toLocaleString('ko-KR')}</p>
        </article>
    )
}

export default PostCard;
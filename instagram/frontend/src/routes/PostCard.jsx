import { SERVER_URL } from "../api.js";


function PostCard({ content, created_at, image_url, user, likes }) {
    return (
        <article className="card mb-4">
            <div className="card-header bg-white d-flex align-items-center gap-2">
                <i className="bi bi-person-circle fs-4"></i>
                <b>{user.username}</b>
            </div>
            {image_url && (
                <div className="ratio ratio-1x1">
                <img src={`${SERVER_URL}${image_url}`} alt={content} className="object-fit-cover" />
                </div>
            )}
            <div className="card-body">
                <div className="fs-4 mb-2">
                <i className="bi bi-heart me-3"></i>
                <i className="bi bi-chat"></i>
                </div>
                <p className="mb-1"><b>좋아요 {likes.length}개</b></p>
                <p className="mb-1"><b>{user.username}</b> {content}</p>
                <small className="text-secondary">{new Date(created_at).toLocaleString('ko-KR')}</small>
            </div>
        </article>
    )
}

export default PostCard;
import { Link } from 'react-router';

import { SERVER_URL } from "../api.js";
import { useAuth } from '../hooks/useAuth.jsx';


function PostCard({ id, content, created_at, image_url, user, likes, visible, onUpdate, onDelete }) {
    const auth = useAuth();
    const liked = auth.user && likes.some((like) => { return auth.user.id === like.user_id });
    const mine = auth.user && (user.id === auth.user.id);

    async function handleLike() {
        const updated = await auth.authApi(`/api/posts/${id}/likes`, { 
            method: liked ? 'DELETE' : 'POST'
        });

        onUpdate(updated);
    }

    async function handleDelete() {
        if (!confirm('게시글을 삭제하시겠습니까? 삭제 후 되돌릴 수 없습니다.')) return;

        await auth.authApi(`/api/posts/${id}`, { method: 'DELETE' });
        
        onDelete();
    }

    return (
        <article className="card mb-4">
            <div className="card-header bg-white d-flex align-items-center gap-2">
                <i className="bi bi-person-circle fs-4"></i>
                { user && <Link className="text-reset text-decoration-none fw-bold" to={`/users/${user.username}`}>{ user.username }</Link> }
                { mine && visible && (
                    <span className="ms-auto">
                        <button
                            type="button"
                            className="btn btn-link text-secondary p-0 me-2"
                            aria-label="게시글 수정"
                        >
                            <i className="bi bi-pencil-fill" />
                        </button>

                        <button
                            type="button"
                            className="btn btn-sm btn-link text-danger p-0 me-2"
                            aria-label="게시글 삭제"
                            onClick={ handleDelete }
                        >
                            <i className="bi bi-trash" />
                        </button>
                    </span>
                )}
            </div>
            {image_url && (
                <Link className="ratio ratio-1x1" to={ `/posts/${id}` }>
                    <img src={`${SERVER_URL}${image_url}`} alt={content} className="object-fit-cover" />
                </Link>
            )}
            <div className="card-body">
                <div className="fs-4 mb-2">
                <button className="btn btn-link p-0 text-reset me-3 fs-4" onClick={ handleLike }>
                    <i className={ liked ? "bi bi-heart-fill text-danger" : "bi bi-heart" }></i>
                </button>
                <Link className="text-reset" to={ `/posts/${id}` }>
                    <i className="bi bi-chat"></i>
                </Link>
                </div>
                <p className="mb-1"><b>좋아요 {likes.length}개</b></p>
                <p className="mb-1"><b>{user.username}</b> {content}</p>
                <small className="text-secondary">{new Date(created_at).toLocaleString('ko-KR')}</small>
            </div>
        </article>
    )
}

export default PostCard;
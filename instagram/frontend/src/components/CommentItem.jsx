import { useAuth } from "../hooks/useAuth.jsx";


function CommentItem({ id, user, content, onDelete }) {
    const auth = useAuth();
    const mine = auth.user && user.id === auth.user.id;

    async function handleDelete() {
        await auth.authApi(`/api/comments/${id}`, {
            method: 'DELETE'
        });

        onDelete(id);
    }

    return (
        <span>
            <li className="list-group-item d-flex justify-content-between">
                <span><b>{ user.username }</b> { content }</span>
                { mine && (
                    <button
                        type="button"
                        className="btn btn-sm btn-link text-danger p-0"
                        aria-label="댓글 삭제"
                        onClick={ handleDelete }
                    >
                        <i className="bi bi-trash" />
                    </button>
                )}
            </li>
        </span>
    )
}

export default CommentItem;
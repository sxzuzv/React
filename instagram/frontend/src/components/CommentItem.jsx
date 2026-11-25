import { useState } from "react";

import { useAuth } from "../hooks/useAuth.jsx";


function CommentItem({ id, user, content, onDelete, onUpdate }) {
    const auth = useAuth();

    const [ editing, setEditing ] = useState(false);
    const [ text, setText ] = useState(content);

    const mine = auth.user?.id === user.id;

    async function handleDelete() {
        await auth.authApi(`/api/comments/${id}`, {
            method: 'DELETE'
        });

        onDelete(id);
    }

    function handleCancle() {
        setText(content);
        setEditing(false);
    }

    async function handleSave(e) {
        e.preventDefault();

        const updated = await auth.authApi(`/api/comments/${id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ content: text })
        });

        onUpdate(updated);
        setEditing(false);
    }


    if (editing) {
        return (
            <form action="" className="input-group input-group-sm" onSubmit={ handleSave }>
                <input 
                    className="form-control" 
                    type="text" 
                    value={ text }
                    onChange={ e => setText(e.target.value) }
                />
                <button stype="submit" className="btn btn-primary" aria-label="저장">
                    <i className="bi bi-check-square-fill" />
                </button>
                <button type="button"
                        className="btn btn-secondary" 
                        aria-label="취소"
                        onClick={ handleCancle }
                >
                    <i className="bi bi-dash-circle" />
                </button>
            </form>
        )
    }

    return (
        <span>
            <li className="list-group-item d-flex justify-content-between">
                <span><b>{ user.username }</b> { content }</span>
                { mine && (
                    <span>
                        <button
                            type="button"
                            className="btn btn-link text-secondary p-0 me-2"
                            aria-label="댓글 수정"
                            onClick={ () => setEditing(true) }
                        >
                            <i className="bi bi-pencil-fill" />
                        </button>
                        
                        <button
                            type="button"
                            className="btn btn-sm btn-link text-danger p-0 me-2"
                            aria-label="댓글 삭제"
                            onClick={ handleDelete }
                        >
                            <i className="bi bi-trash" />
                        </button>
                    </span>
                )}
            </li>
        </span>
    )
}

export default CommentItem;
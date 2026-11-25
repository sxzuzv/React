import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';


function CommentForm({ postId, onCreate }) {
    const [ text, setText ] = useState('');
    const auth = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();

        const created = await auth.authApi(`/api/posts/${postId}/comments`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ content: text })
        });

        onCreate(created);
        setText('');
    }

    return (
        <form className="input-group mt-3" onSubmit={ handleSubmit }>
            <input className="form-control" type="text" value={ text } onChange={ e => setText(e.target.value) } />
            <button type="submit" className="btn btn-primary" aria-label="작성">
                <i className="bi bi-arrow-up-circle-fill" />
            </button>
        </form>
    )
}

export default CommentForm;
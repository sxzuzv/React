import { useState } from 'react';
import { useNavigate } from 'react-router';

import { useAuth } from '../hooks/useAuth';


function NewPost() {
    const { authApi } = useAuth();
    const [ content, setContent ] = useState('');
    const [ error, setError ] = useState(null);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await authApi('/api/posts', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ content })
            });
            
            navigate('/');
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <div className="card p-3">
            <h2 className="h5 mb-3">새 게시물</h2>
            <form className="d-grid gap-2" onSubmit={ handleSubmit }>
                <textarea className="form-control" rows={3} value={ content } onChange={ e => setContent(e.target.value) } placeholder="문구 입력…" required />
                <button className="btn btn-primary">공유하기</button>
            </form>
            {error && <p className="text-danger mt-3 mb-0">{ error }</p>}
        </div>
    );
}

export default NewPost;
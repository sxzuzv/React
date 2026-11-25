import { useState } from 'react';
import { useNavigate } from 'react-router';

import { useAuth } from '../hooks/useAuth';


function NewPost() {
    const { authApi } = useAuth();
    const [ content, setContent ] = useState('');
    const [ file, setFile ] = useState(null);
    const [ error, setError ] = useState('');
    const [ sending, setSending ] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setSending(true);

        try {
            let image_url = null;
            if (file) {
                const formData = new FormData();
                formData.append('photo', file);

                const data = await authApi('/api/uploads', {
                    method: 'POST',
                    body: formData
                });

                image_url = data.image_url;
            }

            await authApi('/api/posts', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ content, image_url })
            });

            navigate('/');
        } catch (e) {
            setError(e.message);
            setSending(false);
        }
    }

    return (
        <div className="card p-3">
            <h2 className="h5 mb-3">새 게시물</h2>
            <form className="d-grid gap-2" onSubmit={ handleSubmit }>
                <input className="form-control" type="file" accept='image/*' onChange={ e => setFile(e.target.files[0]) } />
                { file && (
                    <div className="ratio ratio-1x1">
                        <img className="object-fit-cover rounded" src={ URL.createObjectURL(file) } />
                    </div>
                )}
                <textarea className="form-control" rows={3} value={ content } onChange={ e => setContent(e.target.value) } placeholder="문구 입력…" required />
                <button className="btn btn-primary" disabled={ sending }>
                    { sending ? '보내는 중 . .' : '공유하기' }
                </button>
            </form>
            {error && <p className="text-danger mt-3 mb-0">{ error }</p>}
        </div>
    );
}

export default NewPost;
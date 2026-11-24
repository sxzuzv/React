import { useState, useEffect } from 'react';
import { useNavigate, Link, useBeforeUnload } from 'react-router';

import { api } from '../api.js';


function Signup() {
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ error, setError ] = useState('');

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
 
        try {
            await api('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            navigate('/login');
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <div className="card p-4 text-center">
            <h2 className="mb-4">insta</h2>
            <form className="d-grid gap-2" onSubmit={handleSubmit}>
                <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} placeholder="아이디(3글자 이상)" minLength={3} required />
                <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호(4글자 이상)" minLength={4} required />
                <button className="btn btn-primary">가입</button>
            </form>
            {error && <p className="text-danger mt-3 mb-0">{error}</p>}
            <p className="mt-3 mb-0">계정이 있나요? <Link to="/login">로그인</Link></p>
        </div>
    )
}

export default Signup;
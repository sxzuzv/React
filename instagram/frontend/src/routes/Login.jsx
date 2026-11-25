import { useState } from 'react';
import { useNavigate, Link } from 'react-router';

import { useAuth } from '../hooks/useAuth.jsx';

import { SERVER_URL } from '../api.js'


function Login() {
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ error, setError ] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await login(username, password);
            navigate('/');
        } catch (e) {
            setError(e.message);
            setPassword(''); // 에러 발생 시 비밀번호 초기화
        } 
    }
    
    return (
        <>
            <div className="card p-4 text-center">
                <h2 className="mb-4">insta</h2>
                <form className="d-grid gap-2" onSubmit={ handleSubmit }>
                <input className="form-control" value={ username } onChange={ e => setUsername(e.target.value)} placeholder="아이디" required />
                <input className="form-control" type="password" value={ password } onChange={ e => setPassword(e.target.value)} placeholder="비밀번호" required />
                { error && <p className="text-danger small mb-0">{ error }</p> }
                <button className="btn btn-primary">로그인</button>
                </form>
                <div className="d-grid gap-2 mt-3">
                <a className="btn btn-outline-dark" href={`${SERVER_URL}/api/auth/google/login`}>
                    <i className="bi bi-google"></i>구글로 로그인
                </a>
                </div>
            </div>
            <p className="mt-3"><Link to="/signup">회원가입</Link></p>
        </>
    );
}

export default Login;
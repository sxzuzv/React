import { useState } from 'react';

import { api } from '../api.js';


function Login() {
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        
        const data = await api('/api/auth/login', {
            method: 'POST',
            body: new URLSearchParams({ username, password })
        });
    }
    
    return (
        <>
            <h1>로그인</h1>
            <form action="" onSubmit={ handleSubmit }>
                <input type="text" name="username" value={ username } onChange={ e => setUsername(e.target.value) } />
                <input type="text" name="password" value={ password } onChange={ e => setPassword(e.target.value) } />
                <button type="submit">제출</button>
            </form>
        </>
    );
}

export default Login;
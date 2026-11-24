import { createContext, useContext, useEffect, useState } from 'react';

import { api } from '../api.js';


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [ token, setToken ] = useState(localStorage.getItem('access_token'));
    const [ user, setUser ] = useState(null);

    useEffect(() => {
        if (!token) return;

        async function load() {
            try {
                setUser(await api('/api/auth/me', { headers: { Authorization: `Bearer ${token}` }}));
            } catch (e) {
                logout();
            }
        }
        load();
    }, [token]);

    async function login(username, password) {
        const data = await api('/api/auth/login', {
            method: 'POST',
            body: new URLSearchParams({ username, password })
        });

        setToken(data.access_token);
        localStorage.setItem('access_token', data.access_token);
    }

    function logout() {
        setToken(null);
        setUser(null);
        localStorage.removeItem('access_token');
    }

    return (
        <AuthContext value={{ token, user, login, logout }}>{ children }</AuthContext>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}
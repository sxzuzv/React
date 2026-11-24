import { createContext, useContext, useEffect, useState } from 'react';

import { api } from '../api.js';


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [ token, setToken ] = useState(null);
    const [ user, setUser ] = useState(null);
    const [ ready, setReady ] = useState(false);

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

    useEffect(() => { 
        async function load() {
            try {
                const data = await api(
                    '/api/auth/refresh',
                    { method: 'POST', credentials:' include'}
                );

                setToken(data.access_token);
            } catch (e) {
                setToken(null);
            }
            setReady(true);
        }
        load();
    }, []);

    async function login(username, password) {
        const data = await api('/api/auth/login', {
            method: 'POST',
            body: new URLSearchParams({ username, password }),
            credentials: 'include'
        });

        setToken(data.access_token);
    }

    async function logout() {
        await api('/api/auth/logtout', { method: 'POST', credentials: 'include' });
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext value={{ token, user, ready, login, logout }}>{ children }</AuthContext>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}
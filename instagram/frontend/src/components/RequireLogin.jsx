import { Navigate, Outlet } from 'react-router'; 

import { useAuth } from "../hooks/useAuth.jsx";


function RequireLogin() {
    const { token, ready } = useAuth();

    if (!ready) return null;
    if (!token) return <Navigate to="/login"></Navigate>;

    return <Outlet />;
}

export default RequireLogin;
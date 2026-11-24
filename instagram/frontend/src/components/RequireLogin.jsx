import { Navigate, Outlet } from 'react-router'; 

import { useAuth } from "../hooks/useAuth.jsx";


function RequireLogin() {
    const { token } = useAuth();
    if (!token) return <Navigate to="/login"></Navigate>;

    return <Outlet />;
}

export default RequireLogin;
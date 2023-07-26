import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {

        if (location.pathname === "/signup" || location.pathname === "/login") {
            //do nothing;
        }else {
            const user = window.localStorage.getItem("userData");
            if (!user) {
                navigate("/login");
            }
        }
        // } else if(!isAuthenticated) {
        //     navigate('/login');
        // }
    }, [isAuthenticated, location.pathname, navigate]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

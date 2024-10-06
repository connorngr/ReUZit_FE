import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, removeToken, setToken } from "../utils/storage";
import { login as loginApi } from "../api/auth";
import { toast } from "react-toastify";
interface AuthContextType {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();
        if (token) {
            setIsAuthenticated(true);
        }
    },[])

    const login = async (email: string, password: string) => {
        try {
            const response = await loginApi(email, password);
            if (response?.status === 200) {
                // Successful login, set token and authentication state
                setToken(response.data.token);
                setIsAuthenticated(true);
                // Navigate to the home page after successful login
                navigate("/");
                toast.success("Login successful!", {
                    position: "bottom-right",
                    autoClose: 1000,
                });
            }
        }
        catch (error: any) {
            if (error.status === 401) {
                console.error('Invalid credentials, please try again.');
                throw error.status;
                
            }
        }
    }
    const logout = () => {
        toast.error("Logout successful!", {
          position: "bottom-right",
          autoClose: 1000,
      });
        removeToken();
        setIsAuthenticated(false);
        navigate("/login");
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
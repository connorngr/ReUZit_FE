import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, removeToken, setToken } from "../utils/storage";
import { login as loginApi, signup } from "../api/auth";
import { toast } from "react-toastify";
import { getUserRole } from "../utils/getUserRole";

interface AuthContextType {
    isAuthenticated: boolean;
    role: string;
    login: (email: string, password: string) => Promise<void>;
    register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [role, setRole] = useState<string>("");
    
    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();
        if (token) {
            setIsAuthenticated(true);
            const userRole = getUserRole(token);
            setRole(userRole);
        }
    },[])

    const login = async (email: string, password: string) => {
        try {
            const response = await loginApi(email, password);
            if (response?.status === 200) {
                // Successful login, set token and authentication state
                setToken(response.data.token);
                const userRole = getUserRole(response.data.token);
                setRole(userRole);
                setIsAuthenticated(true);
                // Navigate to the home page after successful login
                navigate("/");
                // toast.success("Login successful!", {
                //     position: "bottom-right",
                //     autoClose: 3000,
                // });
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
    //     toast.error("Logout successful!", {
    //       position: "bottom-right",
    //       autoClose: 3000,
    //   });
        removeToken();
        setIsAuthenticated(false);
        navigate("/login");
    }

    const register = async (firstName: string, lastName: string, email: string, password: string) => {
        try {
          const response = await signup(firstName, lastName, email, password);
          // Handle registration success (e.g., automatically log the user in)
          if (response?.status === 200) {
            // Successful login, set token and authentication state
             setToken(response.data.token);
             const userRole = getUserRole(response.data.token);
             setRole(userRole);
             setIsAuthenticated(true);
             // Navigate to the home page after successful login
             navigate("/");
            //  toast.success("Registration successful!", {
            //      position: "bottom-right",
            //      autoClose: 3000,
            //  });
          }
        } catch (error) {
          console.error('Registration failed:', error);
        }
      };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    )
}
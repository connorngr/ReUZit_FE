import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, removeToken, setToken } from "../utils/storage";
import { login as loginApi, signUp } from "../api/auth";
import { getUserRole } from "../utils/getUserRole";
import { User, getCurrentUser } from "../api/user";

interface AuthContextType {
    isAuthenticated: boolean;
    role: string;
    login: (email: string, password: string) => Promise<void>;
    register: (firstName: string, lastName: string, email: string, password: string, imageUrl: File | null) => Promise<void>; // Cập nhật ở đây
    logout: () => void;
    user: User | null;
    setAuthData: (authData: { token: string; user: User }) => void;
    updateUserBalance: (balance: number) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [role, setRole] = useState<string>("");
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();


    useEffect(() => {
        const token = getToken();
        if (token) {
            setIsAuthenticated(true);
            const userRole = getUserRole(token);
            setRole(userRole);
        }
    }, [])

    useEffect(() => {
        const token = getToken();
        const savedUser = localStorage.getItem("user");
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
            setRole(getUserRole(token));
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }
    }, []);

    const setAuthData = ({ token, user }: { token: string; user: User }) => {
        setToken(token); // Save token in storage
        setUser(user); // Update user state
        localStorage.setItem("user", JSON.stringify(user)); // Persist user data in localStorage
        setRole(getUserRole(token)); // Extract and set user role
        setIsAuthenticated(true); // Mark user as authenticated
    };

    const updateUserInLocalStorage = (updatedUser: User) => {
        setUser(updatedUser); // Update user state
        localStorage.setItem("user", JSON.stringify(updatedUser)); // Persist updated user data
    };

    const updateUserBalance = (money: number) => {
        if (user) {
            const updatedUser = { ...user, money };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        }
    };


    const login = async (email: string, password: string) => {
        try {
            const response = await loginApi(email, password);
            if (response?.status === 200) {
                // Successful login, set token and authentication state
                setToken(response.data.token);
                const userData = await getCurrentUser();
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
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
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
        setRole("");
        navigate("/login");
    }

    const register = async (firstName: string, lastName: string, email: string, password: string, imageUrl: File | null) => {
        try {
          const response = await signUp(firstName, lastName, email, password, imageUrl);
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
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout, register, user, setAuthData, updateUserBalance }}>
            {children}
        </AuthContext.Provider>
    )
}
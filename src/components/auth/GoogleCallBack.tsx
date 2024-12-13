import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleGoogleAuth } from '../../api/auth';
import { AuthContext } from "../../context/AuthContext";

const GoogleCallback = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    useEffect(() => {
        const fetchData = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            if (code) {
                try {
                    // Pass the code to the backend to exchange for user info and JWT
                    await authContext?.login(undefined, undefined, code); // Assuming login function is defined elsewhere
                } catch (error) {
                    console.error('Error during login:', error);
                }
            } else {
                console.error('No code found in the URL');
            }
        };

        fetchData();
    }, [navigate]);

    return <div>Processing Google authentication...</div>;
};

export default GoogleCallback;

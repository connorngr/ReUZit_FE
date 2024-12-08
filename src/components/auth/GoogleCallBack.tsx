import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleGoogleAuth } from '../../api/auth';

const GoogleCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        console.log(code);
        
        if (code) {
            // Pass the code to the backend to exchange for user info and JWT
            handleGoogleAuth(code);

            navigate('/dashboard');
        } else {
            console.error('No code found in the URL');
        }
    }, [navigate]);

    return <div>Processing Google authentication...</div>;
};

export default GoogleCallback;

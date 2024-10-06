import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from 'react-i18next';

const Home = () => {
    const authContext = useContext(AuthContext);



    return (
        <div>
            <h1>Welcome to the Home Page!</h1>
            {/* <button onClick={handleLogout}>Logout</button> */}
        </div>
    );

}

export default Home;
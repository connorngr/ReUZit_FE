import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
    const authContext = useContext(AuthContext);

    const handleLogout = () => {
        if (authContext) {
            authContext.logout();
        }
    };

    return (
        <div>
            <h1>Welcome to the Home Page!</h1>
            {/* <button onClick={handleLogout}>Logout</button> */}
        </div>
    );

}

export default Home;
import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import MotionButton from "../common/MotionButton";
import { CiHeart } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, User } from '../../api/user'; // Đảm bảo đường dẫn đúng
import { API_URL } from '../../api/auth'
import UserDropdown from "../common/Navbar/UserDropdown"
import NavbarLinks from "../common/Navbar/NavbarLinks";
import SearchBar from "../common/Navbar/SearchBar";

const Navbar = () => {
    const authContext = useContext(AuthContext);

    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [imageUrl, setImageUrl] = useState(
        "https://www.shutterstock.com/image-vector/error-customer-icon-editable-line-260nw-1714948474.jpg"
    );

    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };

    const handleLogout = () => {
        authContext?.logout();
    }
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);

                // Set the user's image URL if available, otherwise fallback
                if (userData?.imageUrl) {
                    setImageUrl(`${API_URL}${userData.imageUrl}`);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        authContext?.isAuthenticated ?? fetchUserData();
    }, []);

    return (
        <header className="sticky top-0 z-20 bg-neutral-100/50 backdrop-blur-md ">
            <div className="mx-auto max-w-7xl px-3 sm:px-8"  >
                <div className="flex h-16 justify-between gap-4 md:gap-8"  >
                    <div className="flex items-center font-bold"  ><Link aria-label="homepage" to="/">ReUZit</Link></div>
                    <nav className="flex w-full gap-4 lg:gap-6 p-3" aria-label="Main navigation">
                        <NavbarLinks />
                        <div className="ml-auto flex items-center justify-center gap-4 whitespace-nowrap lg:gap-8"  >
                            <SearchBar />
                            {/* {Logic} */}
                            {authContext?.isAuthenticated ?
                                <div className="flex items-center gap-4">

                                    {authContext.role == "ROLE_ADMIN" ?
                                        <Link to="/admin/dashboard">
                                            <MotionButton
                                                className="main-btn">Dashboard</MotionButton>
                                        </Link>
                                        : <>

                                            <Link to="/my-listings" className="h-6 w-6">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="lucide lucide-user h-6 w-6 shrink-0"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                                    <circle cx="12" cy="7" r="4"></circle>
                                                </svg>
                                            </Link>
                                            <Link to="/my-orders" className="h-6 w-6">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-shopping-cart h-5 w-5">
                                                    <circle cx="8" cy="21" r="1"></circle>
                                                    <circle cx="19" cy="21" r="1"></circle>
                                                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                                                </svg>
                                            </Link>
                                            <Link to="/shopping-cart">
                                                <CiHeart className="h-8 w-8 cursor-pointer" />
                                            </Link>
                                            <Link to="/create-listing">
                                                <MotionButton
                                                    className="main-btn">Add Post</MotionButton>
                                            </Link></>
                                    }
                                    <div className="relative">
                                        <img
                                            id="avatarButton"
                                            onClick={toggleDropdown}
                                            className="w-10 h-10 rounded-full cursor-pointer"
                                            src={imageUrl}
                                            alt="User dropdown"
                                        />

                                        {/* Dropdown menu */}
                                        {isOpen && (
                                            <UserDropdown
                                                userName={user?.lastName || "Bonnie Green"}
                                                userEmail={user?.email || "name@flowbite.com"}
                                                onLogout={handleLogout}
                                            />
                                        )}
                                    </div>
                                </div> :
                                <Link to="/login">
                                    <MotionButton
                                        className="main-btn">Log In</MotionButton>
                                </Link>
                            }
                        </div>
                        <button className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 self-end self-center md:hidden" aria-controls="mobile-menu" aria-expanded="false" aria-label="Open menu">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu h-6 w-6 shrink-0" aria-hidden="true">
                                <line x1="4" x2="20" y1="12" y2="12"></line>
                                <line x1="4" x2="20" y1="6" y2="6"></line>
                                <line x1="4" x2="20" y1="18" y2="18"></line>
                            </svg>
                        </button>

                    </nav>
                </div>
            </div>
        </header>

    );
};
export default Navbar;
import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import MotionButton from "../common/MotionButton";
import { CiHeart } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, User } from '../../api/user'; // Đảm bảo đường dẫn đúng
import {API_URL} from '../../api/user'

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
    
        fetchUserData();
      }, []);

    return (
        <header className="sticky top-0 z-20 bg-neutral-100/50 backdrop-blur-md ">
            <div className="mx-auto max-w-7xl px-3 sm:px-8"  >
                <div className="flex h-16 justify-between gap-4 md:gap-8"  >
                    <div className="flex items-center font-bold"  ><Link aria-label="homepage" to="/">ReUZit</Link></div>
                    <nav className="flex w-full gap-4 lg:gap-6 p-3" aria-label="Main navigation">
                        <div className="ml-auto flex items-center justify-center gap-4 whitespace-nowrap lg:gap-8"  >
                            <div className="lg:flex"  >
                                <form className="group relative my-2 flex w-full items-center justify-items-center text-sm lg:w-80">
                                    <label className="w-full">
                                        <input placeholder="Search for products..." className="h-10 w-full rounded-md border border-neutral-300 bg-transparent bg-white px-4 py-2 pr-10 text-sm text-black placeholder:text-neutral-500 focus:border-black focus:ring-black" type="text" name="search" /></label>
                                    <div className="absolute inset-y-0 right-0"  >
                                        <button type="submit" className="inline-flex aspect-square w-10 items-center justify-center text-neutral-500 hover:text-neutral-700 focus:text-neutral-700 group-invalid:pointer-events-none group-invalid:opacity-80">
                                            <span className="sr-only">search</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search h-5 w-5" aria-hidden="true">
                                                <circle cx="11" cy="11" r="8"></circle>
                                                <path d="m21 21-4.3-4.3"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </form>
                            </div>
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
                                            <CiHeart className="h-8 w-8 cursor-pointer" />
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
                                            <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                                                <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                    <div>Bonnie Green</div>
                                                    <div className="font-medium truncate">name@flowbite.com</div>
                                                </div>
                                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatarButton">
                                                    <li>
                                                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            Dashboard
                                                        </a>
                                                    </li>
                                                    <li>
                                                    <a
           
                                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                        onClick={() => navigate('/settings')} // Navigate to ProfileSettings
                                                    > Settings
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            Earnings
                                                        </a>
                                                    </li>
                                                </ul>
                                                <div className="py-1">
                                                    <a onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                                        Sign out
                                                    </a>
                                                </div>
                                            </div>
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
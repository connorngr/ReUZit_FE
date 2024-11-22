import { useNavigate } from "react-router-dom";

interface UserDropdownProps {
  userName: string;
  userEmail: string;
  onLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  userName,
  userEmail,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
    <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
      <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
        <div>{userName}</div>
        <div className="font-medium truncate">{userEmail}</div>
      </div>
      <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
        <li>
          <a
            href="#"
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            Dashboard
          </a>
        </li>
        <li>
          <a
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={() => navigate("/settings")}
          >
            Settings
          </a>
        </li>
        <li>
          <a
            onClick={() => navigate("/order")}
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            Purchase order
          </a>
        </li>
        <li>
          <a
            onClick={() => navigate("/seller-order")}
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            Sales order
          </a>
        </li>
      </ul>
      <div className="py-1">
      <a
          onClick={() => navigate("/wishlist")}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
        >
          WishList
        </a>
        <a
          onClick={onLogout}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
        >
          Sign out
        </a>
      </div>
    </div>
  );
};

export default UserDropdown;

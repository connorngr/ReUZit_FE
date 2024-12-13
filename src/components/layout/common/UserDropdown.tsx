import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from 'react';
import {User} from '../../../api/user'

interface UserDropdownProps {
  userName: string;
  userEmail: string;
  onLogout: () => void;
  onClose: () => void;
  user: User;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  userName,
  userEmail,
  onLogout,
  onClose,
  user,
  
}) => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose(); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);


  return (
    <div ref={dropdownRef} className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
      <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
        <div>{userName}</div>
        <div className="font-medium truncate">{userEmail}</div>
      </div>
      <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
      <li>
      <p className="px-4 py-2 font-bold text-md">{Number(user.money ?? 0).toLocaleString('vi-VN')} VND</p>
        <a onClick={() => {
              onClose(); 
              navigate(`/deposit`);
            }}
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
            Deposit
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
            onClick={() => navigate("/seller-order")}
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            Sales
          </a>
        </li>
        <li>
          <a
            onClick={() => navigate("/order")}
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            Purchases
          </a>
        </li>
        
      </ul>
      <div className="py-1">
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

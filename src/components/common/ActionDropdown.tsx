import React from "react";

interface ActionDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onAction: (action: string) => void;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({ isOpen, onToggle, onAction }) => {
  return (
    <div className="relative">
      {/* Dropdown Toggle Button */}
      <button
        onClick={onToggle}
        className="inline-flex items-center text-[#eb6a4e] bg-white border border-[#eb6a4e] focus:outline-none hover:bg-[#eb6a4e] hover:text-white font-medium rounded-lg text-sm px-3 py-1.5"
        type="button"
      >
        Action
        <svg
          className="w-2.5 h-2.5 ms-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="z-50 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow absolute top-full mt-1 left-0">
          <ul className="p-3 space-y-1 text-sm text-[#eb6a4e]">
            <li>
              <button
                className="w-full flex items-center p-2 rounded hover:bg-[#eb6a4e] hover:text-white cursor-pointer"
                onClick={() => onAction("Delete")}
              >
                Delete
              </button>
            </li>
            <li>
              <button
                className="w-full flex items-center p-2 rounded hover:bg-[#eb6a4e] hover:text-white cursor-pointer"
                onClick={() => onAction("Private")}
              >
                Private
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;

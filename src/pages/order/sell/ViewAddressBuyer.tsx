import React from "react";

const ViewAddressBuyer: React.FC<{ address: any; onClose: () => void }> = ({ address, onClose }) => {
  return (
    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Title */}
      <div className="mb-4 text-center">
        <h2 className="text-xl font-bold text-gray-800">Buyer Address</h2>
        <p className="text-sm text-gray-500">Details of the buyer's address</p>
      </div>

      {/* Address Details */}
      <div className="space-y-2">
        <div>
          <span className="block text-sm font-medium text-gray-600">Street:</span>
          <p className="text-gray-800">{address.street || "N/A"}</p>
        </div>
        
        <div>
          <span className="block text-sm font-medium text-gray-600">Province:</span>
          <p className="text-gray-800">{address.province || "N/A"}</p>
        </div>
        <div>
          <span className="block text-sm font-medium text-gray-600">District:</span>
          <p className="text-gray-800">{address.district || "N/A"}</p>
        </div>
        <div>
          <span className="block text-sm font-medium text-gray-600">Ward:</span>
          <p className="text-gray-800">{address.ward || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewAddressBuyer;

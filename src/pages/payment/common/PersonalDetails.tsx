import React from 'react';
import { Address } from '../../../api/address';

interface PersonalDetailsProps {
  selectedAddress: Address | null;
  onChangeAddress: () => void;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ selectedAddress, onChangeAddress }) => (
  <div className="grid md:grid-cols-3 gap-4">
    <div>
      <h3 className="text-3xl font-bold text-gray-300">01</h3>
      <h3 className="text-xl font-bold text-gray-800 mt-1">Personal Details</h3>
    </div>
    <div className="md:col-span-2">
      <div>
        {selectedAddress ? (
          <div className="p-4 bg-gray-100 border rounded-md">
            <h4 className="text-lg font-bold">{selectedAddress.fullName}</h4>
            <p>{selectedAddress.phoneNumber}</p>
            <p>{`${selectedAddress.street}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.city}, ${selectedAddress.province}`}</p>
          </div>
        ) : (
          <p className="text-gray-500">No address selected.</p>
        )}
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={onChangeAddress}
        >
          Change Address
        </button>
      </div>
    </div>
  </div>
);

export default PersonalDetails;

import React, { useEffect, useState } from "react";
import { getPayment } from '../../api/payment';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import { Address, getAddressesByUserId, deleteAddress, updateDefaultAddress } from '../../api/address';
import { createCodOrder } from '../../api/order';
import PersonalDetails from './common/PersonalDetails';
import PaymentSummary from './common/PaymentSummary';
import { FaTrash } from 'react-icons/fa'; 
import AddAddressForm from './common/AddressModal';

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, listing } = location.state || {}; // Lấy dữ liệu từ state của navigate
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<string>('vnpay');

  useEffect(() => {
    // Lấy danh sách địa chỉ từ API
    const fetchAddresses = async () => {
      try {
        const data = await getAddressesByUserId(user.id);
        setAddresses(data);

        // Set địa chỉ mặc định nếu có
        const defaultAddress = data.find((address) => address.default === true);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    fetchAddresses(); 
  }, [showAddressModal]); 

  const changeDefaultAddress = async (idAddress: number) => {
    try {
      const updatedAddress = await updateDefaultAddress(idAddress);
      console.log('Updated Default Address:', updatedAddress);
    } catch (error) {
      console.error('Failed to update default address:', error);
    }
  };


  const handlePayment = async () => {
    if (!user) {
      navigate('/login'); // Redirect to login if user is null
      return;
    }

    if (!listing) {
      Swal.fire('Error', 'No product selected!', 'error');
      return;
    }
    if (selectedAddress?.id === undefined) {
      console.error('Selected address ID is undefined');
      return;
    }

    try {
      const paymentUrl = await getPayment(listing.price, listing.id, selectedAddress?.id);
      console.log(paymentUrl);
      window.location.href = paymentUrl; // Chuyển hướng tới URL trả về từ API
    } catch (error: any) {
      Swal.fire('Payment Error', error?.message || 'An unknown error occurred.', 'error');
    }
  };

  const handleCOD = async () => {
    if (!selectedAddress) {
      Swal.fire('Error', 'Please select a shipping address.', 'error');
      return;
    }

    if (!user || !listing) {
      Swal.fire('Error', 'Invalid user or listing data.', 'error');
      return;
    }

    try {
      // Call the createCodOrder function to create the order with COD payment method
      const createdOrder = await createCodOrder(listing.id, selectedAddress.id!);

      // Show success message
      Swal.fire('Success', 'Order placed successfully. Please pay upon delivery.', 'success');

      // Navigate to the order management page
      navigate('/order');
    } catch (error) {
      Swal.fire('Error', 'There was an error placing the order. Please try again later.', 'error');
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'vnpay') {
      await handlePayment();
    } else if (paymentMethod === 'cod') {
      await handleCOD();
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      if (confirm('Are you sure you want to delete this address?')) {
        if(selectedAddress?.id == id){
          setSelectedAddress(null);
        }
        await deleteAddress(id); // Call the delete API
        // setAddresses((prev) => prev.filter((address) => address.id !== id)); // Update the local state
        const data = await getAddressesByUserId(user.id);
        setAddresses(data);
        
        Swal.fire('Success', 'Address deleted successfully!', 'success');
      }
    } catch (error) {
      console.error('Failed to delete address:', error);
      Swal.fire('Error', 'Failed to delete the address. Please try again later.', 'error');
    }
  };

  return (
    <div className="font-sans bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 inline-block border-b-[3px] border-gray-800 pb-1">
            Checkout
          </h2>
        </div>

        <div className="mt-12">
          {/* Shopping Address Section */}
          <PersonalDetails
            selectedAddress={selectedAddress}
            onChangeAddress={() => setShowAddressModal(true)}
          />
        </div>
        {showAddressModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md p-6 max-w-lg w-full">
              <h3 className="text-lg font-bold mb-4">Choose Address</h3>
              <ul className="space-y-2">
                {addresses.map((address) => (
                  <li
                    key={address.id}
                    className="relative p-4 border rounded-md hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedAddress(address);
                      setShowAddressModal(false);
                      changeDefaultAddress(address.id!);
                    }}
                  >
                    <p className="font-bold">{address.fullName}</p>
                    <p>{address.phoneNumber}</p>
                    <p>{`${address.street}, ${address.ward}, ${address.district}, ${address.province}`}</p>
                    {/* Delete Icon */}
                    <button
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the parent `onClick`
                        handleDeleteAddress(address.id!);
                        setShowAddressModal(true);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => { setShowAddAddress(true); setShowAddressModal(false); }}
              >
                Add addresses
              </button>
              <button
                className="mt-4 mx-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => setShowAddressModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
        {showAddAddress && (
          <AddAddressForm
            userId={user.id}
            onCancel={() => setShowAddAddress(false)}
          />
        )}
        <PaymentSummary
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          listing={listing}
          handleSubmit={handleSubmit}
          navigate={navigate}
        />
      </div>
    </div>
  );
};

export default Checkout;

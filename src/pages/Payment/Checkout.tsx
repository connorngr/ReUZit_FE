import React, { useEffect, useState } from "react";
import { getPayment } from '../../api/payment';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProvinces, getDistricts, getWards, searchProvinces, searchWards, searchDistricts, fetchDistrictsByProvince, fetchWardsByDistrict } from '../../api/location';
import { Province, District, Ward } from '../../api/location';
import { Address, getAddressesByUserId, createAddress } from '../../api/address';

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, listing } = location.state || {}; // Lấy dữ liệu từ state của navigate
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);

  // Khai báo state với kiểu cụ thể
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const [districtKeyword, setDistrictKeyword] = useState<string>('');
  const [debouncedDistrictKeyword, setDebouncedDistrictKeyword] = useState<string>('');
  const [showDistrictSuggestions, setShowDistrictSuggestions] = useState<boolean>(false);

  const [wardKeyword, setWardKeyword] = useState<string>('');
  const [debouncedWardKeyword, setDebouncedWardKeyword] = useState<string>('');
  const [showWardSuggestions, setShowWardSuggestions] = useState<boolean>(false);

  const [paymentMethod, setPaymentMethod] = useState<string>('vnpay');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
    }, 300); // Debounce 300ms
    return () => clearTimeout(handler);
  }, [searchKeyword]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedDistrictKeyword(districtKeyword);
    }, 300);
    return () => clearTimeout(handler);
  }, [districtKeyword]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedWardKeyword(wardKeyword);
    }, 300);
    return () => clearTimeout(handler);
  }, [wardKeyword]);

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
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        if (!debouncedKeyword.trim()) {
          setProvinces([]); // Nếu không có từ khóa, không hiển thị danh sách
          return;
        }
        const data = await searchProvinces(debouncedKeyword);
        setProvinces(data); // Cập nhật danh sách tỉnh
      } catch (error) {
        console.error('Error searching provinces:', error);
      }
    };

    fetchProvinces();
  }, [debouncedKeyword]);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        if (!debouncedDistrictKeyword.trim()) {
          setDistricts([]);
          return;
        }
        const data = await searchDistricts(debouncedDistrictKeyword);
        setDistricts(data);
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    };

    fetchDistricts();
  }, [debouncedDistrictKeyword]);

  useEffect(() => {
    const fetchWards = async () => {
      try {
        if (!debouncedWardKeyword.trim()) {
          setWards([]);
          return;
        }
        const data = await searchWards(debouncedWardKeyword);
        setWards(data);
      } catch (error) {
        console.error('Error fetching wards:', error);
      }
    };

    fetchWards();
  }, [debouncedWardKeyword]);

  const handleSelectProvince = async (provinceCode: string | null, provinceName: string | null) => {
    if (provinceCode === null || provinceName === null) {
      const data = await getProvinces(); // Lấy tất cả tỉnh
      setProvinces(data);
      setSearchKeyword(''); // Reset từ khóa tìm kiếm
      setShowSuggestions(false);
      return;
    }

    setSearchKeyword(provinceName); // Hiển thị tên tỉnh trong ô tìm kiếm
    setSelectedProvince(provinceCode); // Lưu mã tỉnh được chọn
    setShowSuggestions(false); // Ẩn danh sách gợi ý

    try {
      const districtsData = await fetchDistrictsByProvince(provinceCode); // Lấy các district theo mã tỉnh
      setDistricts(districtsData); // Cập nhật danh sách district
      setDistrictKeyword(''); // Reset từ khóa district
      setSelectedDistrict(''); // Reset district đã chọn
      setWards([]); // Xóa danh sách ward khi thay đổi tỉnh
      setSelectedWard(''); // Reset ward đã chọn
    } catch (error) {
      console.error('Error fetching districts for province:', error);
    }
  };

  const handleSelectDistrict = async (districtCode: string, districtName: string) => {
    setDistrictKeyword(districtName); // Hiển thị tên district trong ô nhập liệu
    setSelectedDistrict(districtCode); // Lưu mã district được chọn
    setShowDistrictSuggestions(false); // Ẩn gợi ý

    try {
      const wardsData = await fetchWardsByDistrict(districtCode); // Lấy danh sách ward theo mã district
      setWards(wardsData); // Cập nhật danh sách ward
      setWardKeyword(''); // Reset từ khóa ward
      setSelectedWard(''); // Reset ward đã chọn
    } catch (error) {
      console.error('Error fetching wards for district:', error);
    }
  };


  const handleSelectWard = (wardCode: string, wardName: string) => {
    setWardKeyword(wardName); // Hiển thị tên ward trong ô nhập liệu
    setSelectedWard(wardCode); // Lưu mã ward được chọn
    setShowWardSuggestions(false); // Ẩn gợi ý
  };

  const handleAddAddress = async (event: React.FormEvent) => {
    event.preventDefault();

    // Dữ liệu từ form
    const form = event.target as HTMLFormElement;
    const newAddress = {
      userId: user.id, // Lấy user ID từ state hoặc context
      fullName: form.fullName.value,
      phoneNumber: form.phoneNumber.value,
      street: form.street.value,
      city: 'City Name', // Giá trị tạm, lấy từ dữ liệu thành phố
      province: searchKeyword,
      district: districtKeyword,
      ward: wardKeyword,
      default: true, // Có thể set mặc định hoặc để người dùng chọn
    };

    try {
      // Gọi API để thêm địa chỉ
      const createdAddress = await createAddress(newAddress);

      // Cập nhật danh sách địa chỉ
      setAddresses((prevAddresses) => [...prevAddresses, createdAddress]);
      setShowAddAddress(false); // Đóng modal thêm địa chỉ
      // Field list address when you add 
      const data = await getAddressesByUserId(user.id);
      setAddresses(data);
    
      const defaultAddress = data.find((address) => address.default === true);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      }
    } catch (error) {
      console.error('Error adding new address:', error);
      alert('Failed to add address. Please try again.');
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

    try {
      const paymentUrl = await getPayment(listing.price, listing.id, user.id);
      console.log(paymentUrl);
      window.location.href = paymentUrl; // Chuyển hướng tới URL trả về từ API
    } catch (error: any) {
      Swal.fire('Payment Error', error?.message || 'An unknown error occurred.', 'error');
    }
  };

  const handleCOD = async () => {
    Swal.fire('Success', 'Order placed successfully. Please pay upon delivery.', 'success');
    navigate('/orders'); // Điều hướng tới trang quản lý đơn hàng
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'vnpay') {
      await handlePayment();
    } else if (paymentMethod === 'cod') {
      await handleCOD();
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
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-3xl font-bold text-gray-300">01</h3>
              <h3 className="text-xl font-bold text-gray-800 mt-1">Personal Details</h3>
            </div>
            <div className="md:col-span-2">
              <div>
                {/* Hiển thị địa chỉ được chọn */}
                {selectedAddress ? (
                  <div className="p-4 bg-gray-100 border rounded-md">
                    <h4 className="text-lg font-bold">{selectedAddress.fullName}</h4>
                    <p>{selectedAddress.phoneNumber}</p>
                    <p>{`${selectedAddress.street}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.city}, ${selectedAddress.province}`}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No address selected.</p>
                )}

                {/* Nút đổi địa chỉ */}
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={() => setShowAddressModal(true)}
                >
                  Change Address
                </button>
              </div>
            </div>
          </div>
        </div>
        {showAddressModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md p-6 max-w-lg w-full">
              <h3 className="text-lg font-bold mb-4">Choose Address</h3>
              <ul className="space-y-2">
                {addresses.map((address) => (
                  <li
                    key={address.id}
                    className="p-4 border rounded-md hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedAddress(address);
                      setShowAddressModal(false);
                    }}
                  >
                    <p className="font-bold">{address.fullName}</p>
                    <p>{address.phoneNumber}</p>
                    <p>{`${address.street}, ${address.ward}, ${address.district}, ${address.city}, ${address.province}`}</p>
                  </li>
                ))}
              </ul>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => {setShowAddAddress(true); setShowAddressModal(false);} }
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
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-0">
            <div className="bg-white rounded-md p-6 max-w-lg w-full">
              <h3 className="text-lg font-bold mb-4">Add New Address</h3>
              <form onSubmit={handleAddAddress}>
                <div className="mt-12">
                  {/* Personal Details */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-300">01</h3>
                      <h3 className="text-xl font-bold text-gray-800 mt-1">Personal Details</h3>
                    </div>
                    <div className="md:col-span-2">
                      <div>
                        {/* Email */}
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="px-4 py-3 bg-gray-200 text-gray-800 w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                        />
                      </div>
                      {/* Full Name */}
                      <div>
                        <input
                          type="text"
                          name="fullName"
                          placeholder="Full name"
                          className="px-4 mt-2 py-3 bg-white text-gray-800 w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                        />
                      </div>
                      {/* Phone Number */}
                      <div>
                        <input
                          type="text"
                          name="phoneNumber"
                          placeholder="Phone number"
                          className="px-4 mt-2 py-3 bg-white text-gray-800 w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shopping Address */}
                  <div className="grid md:grid-cols-3 gap-4 mt-12">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-300">02</h3>
                      <h3 className="text-xl font-bold text-gray-800 mt-1">Shopping Address</h3>
                    </div>
                    <div className="md:col-span-2">
                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* Province */}
                        <div>
                          <input
                            type="text"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            placeholder="Search province..."
                            className="px-4 py-3 w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                          />
                          {showSuggestions && provinces.length > 0 && (
                            <ul className="absolute z-10 bg-white border-2 border-gray-300 rounded-md w-full max-h-48 overflow-y-auto">
                              {provinces.map((province) => (
                                <li
                                  key={province.code}
                                  onClick={() => handleSelectProvince(province.code.toString(), province.name)}
                                  className="px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                                >
                                  {province.name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* District */}
                        <div>
                          <input
                            type="text"
                            value={districtKeyword}
                            onChange={(e) => setDistrictKeyword(e.target.value)}
                            placeholder="Search district..."
                            className="px-4 py-3 w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                            onFocus={() => setShowDistrictSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowDistrictSuggestions(false), 200)}
                          />
                          {showDistrictSuggestions && districts.length > 0 && (
                            <ul className="absolute z-10 bg-white border-2 border-gray-300 rounded-md w-full max-h-48 overflow-y-auto">
                              {districts.map((district) => (
                                <li
                                  key={district.code}
                                  onClick={() => handleSelectDistrict(district.code.toString(), district.name)}
                                  className="px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                                >
                                  {district.name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Ward */}
                        <div>
                          <input
                            type="text"
                            value={wardKeyword}
                            onChange={(e) => setWardKeyword(e.target.value)}
                            placeholder="Search ward..."
                            className="px-4 py-3 w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                            onFocus={() => setShowWardSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowWardSuggestions(false), 200)}
                          />
                          {showWardSuggestions && wards.length > 0 && (
                            <ul className="absolute z-10 bg-white border-2 border-gray-300 rounded-md w-full max-h-48 overflow-y-auto">
                              {wards.map((ward) => (
                                <li
                                  key={ward.code}
                                  onClick={() => handleSelectWard(ward.code.toString(), ward.name)}
                                  className="px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                                >
                                  {ward.name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      {/* Street */}
                      <div>
                        <input
                          type="text"
                          name="street"
                          placeholder="Street"
                          className="px-4 py-3 mt-4 bg-white text-gray-800 w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      onClick={() => setShowAddAddress(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Payment Method */}
        <div className="grid md:grid-cols-3 gap-4 mt-12">
          <div>
            <h3 className="text-3xl font-bold text-gray-300">03</h3>
            <h3 className="text-xl font-bold text-gray-800 mt-1">Payment Method</h3>
          </div>

          <div className="md:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* VNPay */}
              <div className="flex items-center">
                <input
                  type="radio"
                  className="w-5 h-5 cursor-pointer"
                  id="vnpay"
                  value="vnpay"
                  checked={paymentMethod === 'vnpay'}
                  onChange={() => setPaymentMethod('vnpay')}
                />
                <label htmlFor="vnpay" className="ml-4 flex gap-2 cursor-pointer items-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/24/Vnpay_logo.svg"
                    className="w-24"
                    alt="VNPay"
                  />
                  <span className="text-gray-800 font-medium">VNPay</span>
                </label>
              </div>

              {/* COD */}
              <div className="flex items-center">
                <input
                  type="radio"
                  className="w-5 h-5 cursor-pointer"
                  id="cod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <label htmlFor="cod" className="ml-4 flex gap-2 cursor-pointer items-center">
                  <img
                    src="https://img.icons8.com/ios-filled/50/000000/cash-on-delivery.png"
                    className="w-12"
                    alt="COD"
                  />
                  <span className="text-gray-800 font-medium">Cash on Delivery (COD)</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-md max-lg:-order-1 mt-10 mb-10">
          <h3 className="text-lg font-bold text-gray-800">Summary</h3>
          <ul className="text-gray-800 mt-6 space-y-3">
            <li className="flex flex-wrap gap-4 text-sm">Sub total <span className="ml-auto font-bold">{Number(listing.price).toLocaleString('vi-VN')} VND</span></li>
            <li className="flex flex-wrap gap-4 text-sm">Discount (20%) <span className="ml-auto font-bold">0 VND</span></li>
            <li className="flex flex-wrap gap-4 text-sm">Tax <span className="ml-auto font-bold">0 VND</span></li>
            <hr />
            <li className="flex flex-wrap gap-4 text-base font-bold">Total <span className="ml-auto">{Number(listing.price).toLocaleString('vi-VN')} VND</span></li>
          </ul>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-wrap justify-end gap-4 mt-12 mb-20">
          <button
            type="button"
            className="px-6 py-3 text-sm font-semibold tracking-wide bg-transparent border-2 text-gray-800 rounded-md hover:bg-gray-100"
            onClick={() => { navigate('/home') }}>
            Pay later
          </button>
          <button
            type="button"
            className="px-6 py-3 text-sm font-semibold tracking-wide bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Pay now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

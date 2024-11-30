import React, { useState, useEffect } from "react";
import { Province, District, Ward } from "../../../api/location";
import {
  getProvinces,
  searchProvinces,
  searchWards,
  searchDistricts,
  fetchDistrictsByProvince,
  fetchWardsByDistrict,
} from "../../../api/location";
import { Address, createAddress } from "../../../api/address";
import useDebounce from "./UseDebounce";

interface AddAddressFormProps {
  userId: number;
  onCancel: () => void;
}

const AddAddressForm: React.FC<AddAddressFormProps> = ({
  userId,
  onCancel,
}) => {

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [districtKeyword, setDistrictKeyword] = useState<string>("");
  const [wardKeyword, setWardKeyword] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [showDistrictSuggestions, setShowDistrictSuggestions] = useState<boolean>(false);
  const [showWardSuggestions, setShowWardSuggestions] = useState<boolean>(false);

  const debouncedKeyword = useDebounce(searchKeyword, 300);
  const debouncedDistrictKeyword = useDebounce(districtKeyword, 300);
  const debouncedWardKeyword = useDebounce(wardKeyword, 300);  

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        if (debouncedKeyword) {
          const provincesData = await searchProvinces(debouncedKeyword);
          setProvinces(provincesData);
        } else {
          setProvinces([]);
        }
  
        if (debouncedDistrictKeyword) {
          const districtsData = await searchDistricts(debouncedDistrictKeyword);
          setDistricts(districtsData);
        } else {
          setDistricts([]);
        }
  
        if (debouncedWardKeyword) {
          const wardsData = await searchWards(debouncedWardKeyword);
          setWards(wardsData);
        } else {
          setWards([]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };
  
    fetchSuggestions();
  }, [debouncedKeyword, debouncedDistrictKeyword, debouncedWardKeyword]);  

  const handleSelectProvince = async (provinceCode: string | null, provinceName: string | null) => {
    if (!provinceCode || !provinceName) {
      const data = await getProvinces();
      setProvinces(data);
      setSearchKeyword("");
      setShowSuggestions(false);
      return;
    }

    setSearchKeyword(provinceName);
    setShowSuggestions(false);

    try {
      const districtsData = await fetchDistrictsByProvince(provinceCode);
      setDistricts(districtsData);
      setDistrictKeyword("");
      setWards([]);
      setWardKeyword("");
    } catch (error) {
      console.error("Error fetching districts for province:", error);
    }
  };

  const handleSelectDistrict = async (districtCode: string, districtName: string) => {
    setDistrictKeyword(districtName);
    setShowDistrictSuggestions(false);

    try {
      const wardsData = await fetchWardsByDistrict(districtCode);
      setWards(wardsData);
      setWardKeyword("");
    } catch (error) {
      console.error("Error fetching wards for district:", error);
    }
  };

  const handleSelectWard = (wardCode: string, wardName: string) => {
    setWardKeyword(wardName);
    setShowWardSuggestions(false);
  };


  const handleAddAddress = async (event: React.FormEvent) => {
    event.preventDefault();


    event.preventDefault();

    // Dữ liệu từ form
    const form = event.target as HTMLFormElement;
    const newAddress = {
      userId, // Lấy user ID từ state hoặc context
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
      const createdAddress = await createAddress(newAddress);
      setAddresses((prev) => [...prev, createdAddress]);
      
      onCancel();
    } catch (error) {
      console.error("Error adding new address:", error);
      alert("Failed to add address. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-6 max-w-lg w-full">
        <h3 className="text-lg font-bold mb-4">Add New Address</h3>
        <form onSubmit={handleAddAddress}>
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              className="w-full px-4 py-2 border rounded-md mt-2"
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="province"
              defaultValue={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search province..."
              className="w-full px-4 py-3 border rounded-md mt-2"
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            {showSuggestions && provinces.length > 0 && (
              <ul className="absolute z-10 bg-white border rounded-md w-full max-h-48 overflow-y-auto">
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
          {/* District input */}
          <div>
            <input
              type="text"
              name="district"
              defaultValue={districtKeyword}
              value={districtKeyword}
              onChange={(e) => setDistrictKeyword(e.target.value)}
              placeholder="Search district..."
              className="w-full px-4 py-3 border rounded-md mt-2"
              onFocus={() => setShowDistrictSuggestions(true)}
              onBlur={() => setTimeout(() => setShowDistrictSuggestions(false), 200)}
            />
            {showDistrictSuggestions && districts.length > 0 && (
              <ul className="absolute z-10 bg-white border rounded-md w-full max-h-48 overflow-y-auto">
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
          {/* Ward input */}
          <div>
            <input
              type="text"
              name="ward"
              defaultValue={wardKeyword}
              value={wardKeyword}
              onChange={(e) => setWardKeyword(e.target.value)}
              placeholder="Search ward..."
              className="w-full px-4 py-3 border rounded-md mt-2"
              onFocus={() => setShowWardSuggestions(true)}
              onBlur={() => setTimeout(() => setShowWardSuggestions(false), 200)}
            />
            {showWardSuggestions && wards.length > 0 && (
              <ul className="absolute z-10 bg-white border rounded-md w-full max-h-48 overflow-y-auto">
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
          <div>
            <input
              type="text"
              name="street"
              placeholder="Street"
              className="w-full px-4 py-2 border rounded-md mt-2"
              required
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Save
            </button>
            <button
              type="button"
              className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAddressForm;

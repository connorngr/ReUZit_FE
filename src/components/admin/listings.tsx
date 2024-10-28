import React, { useEffect, useState } from 'react';
import { deleteListings, Image, Listing, fetchListings } from '../../api/listing'; // Adjust the path as needed
import {Category, fetchCategories } from '../../api/category'
import { useNavigate } from 'react-router-dom';
// Define the interface for a listing item, adjust fields as per your API's response structure

const Listings: React.FC = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (listingId: number) => {
    navigate(`/my-listings/edit/${listingId}`);
  };

  const [selectedListingIds, setSelectedListingIds] = useState<number[]>([]);
  // For filter dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Last 30 days');

  // For action dropdown
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);

  const handleCheckboxChange = (listingId: number) => {
    setSelectedListingIds((prevSelected) =>
      prevSelected.includes(listingId)
        ? prevSelected.filter((id) => id !== listingId) // Deselect if already selected
        : [...prevSelected, listingId] // Select if not already selected
    );
  };

  const handleAction = async (action: string) => {
    if (action === 'Delete') {
      if (selectedListingIds.length === 0) {
        alert("Please select at least one listing to delete.");
        return;
      }

      const isDeleted = await deleteListings(selectedListingIds);

      if (isDeleted) {
        alert("Selected listings deleted successfully!");
        setListings((prevListings) =>
          prevListings.filter((listing) => !selectedListingIds.includes(listing.id))
        );
        setSelectedListingIds([]); // Clear selection after deletion
      } else {
        alert("Some listings could not be deleted.");
      }
    }

    setIsActionDropdownOpen(false);
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const handleToggleActionDropdown = () => {
    setIsActionDropdownOpen((prevState) => !prevState);
  };

  // Fetch listings on component mount
  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchListings();
        setListings(data);
      } catch (err) {
        console.error("Error fetching listings:", err);
        setError("Failed to fetch listings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategorie = async () => {
        try {
          const category = await fetchCategories(); // api/category
          console.log(category);
          setCategories(category);
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      };

    fetchListing();
    fetchCategorie();
  }, []);
  const getCategoryName = (categoryId: number) => {
    if (!categories.length) return '';
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
};

return (
  <div className="relative overflow-x-auto shadow-md sm:rounded-lg m-10">
    <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
      {/* Dropdown button and search input */}
      <div className="flex items-center space-x-4">
      {/* Filter Dropdown */}
      <div className="relative">
        <button
          id="dropdownRadioButton"
          onClick={handleToggleDropdown}
          className="inline-flex items-center text-[#eb6a4e] bg-white border border-[#eb6a4e] focus:outline-none hover:bg-[#f87047] hover:text-white font-medium rounded-lg text-sm px-3 py-1.5"
          type="button"
        >
          <svg className="w-3 h-3 text-[#eb6a4e] me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
          </svg>
          {selectedOption}
          <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
          </svg>
        </button>
        {isDropdownOpen && (
          <div id="dropdownRadio" className="z-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow absolute top-full mt-1">
            <ul className="p-3 space-y-1 text-sm text-[#eb6a4e]" aria-labelledby="dropdownRadioButton">
              {['Last day', 'Last 7 days', 'Last 30 days', 'Last month', 'Last year'].map((option) => (
                <li key={option}>
                  <div className="flex items-center p-2 rounded hover:bg-[#eb6a4e] hover:text-white" onClick={() => handleOptionChange(option)}>
                    <input id={`filter-radio-${option}`} type="radio" name="filter-radio" checked={selectedOption === option} readOnly className="w-4 h-4 text-[#eb6a4e] bg-gray-100 border-gray-300 focus:ring-[#eb6a4e]" />
                    <label htmlFor={`filter-radio-${option}`} className="w-full ms-2 text-sm font-medium text-gray-900">
                      {option}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Dropdown */}
      <div className="relative">
        <button
          onClick={handleToggleActionDropdown}
          className="inline-flex items-center text-[#eb6a4e] bg-white border border-[#eb6a4e] focus:outline-none hover:bg-[#eb6a4e] hover:text-white font-medium rounded-lg text-sm px-3 py-1.5"
          type="button"
        >
          Action
          <svg className="w-2.5 h-2.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
          </svg>
        </button>
        {isActionDropdownOpen && (
          <div className="z-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow absolute top-full mt-1 left-0">
            <ul className="p-3 space-y-1 text-sm text-[#eb6a4e]">
              <li>
                <button className="w-full flex items-center p-2 rounded hover:bg-[#eb6a4e] hover:text-white cursor-pointer" onClick={() => handleAction('Delete')}>
                  Delete
                </button>
              </li>
              <li>
                <div className="flex items-center p-2 rounded hover:bg-[#eb6a4e] hover:text-white cursor-pointer" onClick={() => handleAction('Private')}>
                  Private
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>



      <div className="relative">
  <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
    <svg
      className="w-5 h-5 text-[#1d4ed8]" // Change this to the desired blue color
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
        clipRule="evenodd"
      />
    </svg>
  </div>
  <input
    type="text"
    id="table-search"
    className="block p-2 ps-10 text-sm text-gray-900 border border-[#1d4ed8] rounded-lg w-80 bg-gray-50 focus:ring-[#1d4ed8] focus:border-[#1d4ed8]"
    placeholder="Search for items"
  />
</div>


    </div>

    {loading ? (
      <p>Loading...</p>
    ) : error ? (
      <p className="text-[#eb6a4e]">{error}</p>
    ) : (
      <table className="w-full text-sm text-left text-gray-900">
        <thead className="text-xs uppercase bg-gray-50 text-[#eb6a4e]">
          <tr>
            <th scope="col" className="p-4"></th>
            <th scope="col" className="px-6 py-3">Title</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Category</th>
            <th scope="col" className="px-6 py-3">Price</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
    {listings.length === 0 ? (
        <tr>
            <td colSpan={6} className="text-center text-gray-500 p-4">
                Không có người dùng nào đăng bài
            </td>
        </tr>
    ) : (
        listings.map((listing) => (  
            <tr key={listing.id} className="bg-white border-b hover:bg-[#f2f2f2] hover:text-white">
                <td className="w-4 p-4">
                    <input
                        type="checkbox"
                        className="w-4 h-4 text-[#eb6a4e] bg-gray-100 border-gray-300 focus:ring-[#eb6a4e]"
                        checked={selectedListingIds.includes(listing.id)}
                        onChange={() => handleCheckboxChange(listing.id)}
                    />
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{listing.title}</td>
                <td className="px-6 py-4 text-gray-900">{listing.status}</td>
                <td className="px-6 py-4 text-gray-900">{getCategoryName(listing.categoryId)}</td>
                <td className="px-6 py-4 text-gray-900">${listing.price}</td>
                <td className="px-6 py-4">
                    <a
                        className="font-medium text-[#1a29e0] hover:underline"
                        onClick={() => handleEdit(listing.id)}
                    >
                        Edit
                    </a>
                </td>
            </tr>
        ))
    )}
</tbody>

      </table>
    )}
  </div>
);
};

export default Listings;

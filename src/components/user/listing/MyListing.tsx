import React, { useEffect, useState, useContext } from 'react';
import { deleteListings, MyListings, fetchListingsAdmin } from '../../../api/listing'; // Adjust the path as needed
import { Listing } from '../../../api/listing';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../context/AuthContext";
import DropdownFilter from './common/DropdownFilter';
import ActionDropdown from './common/ActionDropdown'; 
import ListingTable from './common/ListingTable';
// Define the interface for a listing item, adjust fields as per your API's response structure

const MyListing: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState('Last 30 days');
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
  const [selectedListingIds, setSelectedListingIds] = useState<number[]>([]);

  const handleEdit = (listingId: number) => {
    navigate(`/my-listings/edit/${listingId}`);
  };

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

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
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
        let data;
        if(authContext?.isAuthenticated){
        if (authContext.role === "ROLE_ADMIN") {
          data = await fetchListingsAdmin();
        } else {
          data = await MyListings();
        }
        setListings(data.reverse());
      }
      } catch (err) {
        console.error("Error fetching listings:", err);
        setError("You don't have any post listing. Please post one listing and back.");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, []);

  return (
    <div className="relative overflow-visible shadow-md sm:rounded-lg m-10">
      <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
        {/* Dropdown button and search input */}
        <div className="flex items-center space-x-4 ">
        <DropdownFilter selectedOption={selectedOption} onOptionChange={handleOptionChange}/>
        
          {/* Action Dropdown */}
          <ActionDropdown
            isOpen={isActionDropdownOpen}
            onToggle={handleToggleActionDropdown}
            onAction={handleAction}
          />
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
        <ListingTable
          listings={listings}
          selectedListingIds={selectedListingIds}
          handleCheckboxChange={handleCheckboxChange}
          handleEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default MyListing;

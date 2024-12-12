import React, { useEffect, useState, useContext } from 'react';
import { deleteListings, MyListings, fetchListingsAdmin } from '../../../api/listing'; // Adjust the path as needed
import { Listing } from '../../../api/listing';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../context/AuthContext";
import DropdownFilter from './common/DropdownFilter';
import ActionDropdown from './common/ActionDropdown';
import ListingTable from './common/ListingTable';
import Swal from "sweetalert2";
import { useSearch } from '../../../context/SearchContext';
import SearchBar from '../../layout/common/SearchBar';

// Define the interface for a listing item, adjust fields as per your API's response structure

const MyListing: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { query } = useSearch();
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
        Swal.fire("Notification", "Please select at least one listing to delete.", "warning");
        return;
      }

      try {
        // Call the deleteListings API
        const failedListings = await deleteListings(selectedListingIds);

        if (failedListings.length === 0) {
          // All listings deleted successfully
          Swal.fire("Notification", "Selected listings deleted successfully!", "success");

          // Update the listing state by filtering out deleted listings
          setListings((prevListings) =>
            prevListings.filter((listing) => !selectedListingIds.includes(listing.id))
          );
          setSelectedListingIds([]); // Clear selection after deletion
        } else {
          // Some listings failed to delete
          const failedTitles = failedListings.map((listing) => listing.title).join(" AND ");
          Swal.fire(
            "Notification",
            `Some listings could not be deleted because have have user buyer this listing. please reject or
            accept orders and delete them again: ${failedTitles}`,
            "error"
          );
        }
      } catch (error) {
        // Handle API error
        console.error("Error during deletion:", error);
        Swal.fire("Notification", "An error occurred while deleting listings.", "error");
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
        if (authContext?.isAuthenticated) {
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

  // Filter listings based on the query
  const filteredListings = listings.filter((listing) => {
    const lowerQuery = query.toLowerCase();

    return (
      listing.title.toLowerCase().includes(lowerQuery) ||
      listing.description.toLowerCase().includes(lowerQuery) ||
      listing.condition.toLowerCase().includes(lowerQuery) ||
      listing.status.toLowerCase().includes(lowerQuery) ||
      listing.price.toString().includes(lowerQuery)
    );
  });

  return (
    <div className="relative overflow-visible shadow-md sm:rounded-lg m-10">
      <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
        {/* Dropdown button and search input */}
        <div className="flex items-center space-x-4 ">
          <DropdownFilter selectedOption={selectedOption} onOptionChange={handleOptionChange} />

          {/* Action Dropdown */}
          <ActionDropdown
            isOpen={isActionDropdownOpen}
            onToggle={handleToggleActionDropdown}
            onAction={handleAction}
          />
        </div>

        <SearchBar />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-[#eb6a4e]">{error}</p>
      ) : (
        <ListingTable
          listings={filteredListings}
          selectedListingIds={selectedListingIds}
          handleCheckboxChange={handleCheckboxChange}
          handleEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default MyListing;

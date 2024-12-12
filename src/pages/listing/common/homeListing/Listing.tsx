import { useEffect, useState, useContext } from 'react';
import { fetchListingsNotUserId, Listing, getActiveListingByCategoryId, logoutFetchListings, getActiveListingsByCategoryIdNotUser } from '../../../../api/listing';
import { useSearch } from '../../../../context/SearchContext';
import Card from './Card';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../../context/AuthContext";
import Swal from 'sweetalert2';

const Listings: React.FC = () => {
  const { query, categoryId } = useSearch();
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) return null;

  const { isAuthenticated, logout, user } = authContext;


  // Fetch listings for logged-in users
  useEffect(() => {
    const fetchListings = async () => {
      if (!isAuthenticated) {
        try {
          setLoading(true);
          const data = categoryId
            ? await getActiveListingByCategoryId(categoryId)
            : await logoutFetchListings();
          setListings(data);
        } catch (error) {
          console.error('Logged-out fetch failed:', error);
        } finally {
          setLoading(false);
        }
      } else if (isAuthenticated) {
        try {
          setLoading(true);
          const data = categoryId
            ? await getActiveListingsByCategoryIdNotUser(categoryId, user?.id!)
            : await fetchListingsNotUserId(user?.id!);
          if (!data || data.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'No Listings Found',
              text: 'No listings are available at the moment. Please check back later.',
            });
          }
          setListings(data || []);
        } catch (error) {
          console.error('Logged-in fetch failed:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchListings();
  }, [user, categoryId]);


  // Filter listings based on search query
  useEffect(() => {
    const filterListings = () => {
      if (!query) {
        setFilteredListings(listings);
        return;
      }
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
      setFilteredListings(filteredListings);
    };

    filterListings();
  }, [query, listings]);

  if (loading) {
    return <div className="text-center mt-6 text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-6 text-red-500">{error}</div>;
  }
  if (filteredListings.length === 0) {
    return (
      <div className="text-center mt-6 text-gray-700">
        No listings match your search criteria.
      </div>
    );
  }

  return (
    <div className="font-[sans-serif] bg-gray-100">
      <div className="p-4 mx-auto lg:max-w-7xl sm:max-w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-xl:gap-4 gap-6">

          {filteredListings.map((listing) => (
            <Card
              key={listing.id}
              listing={listing}
              onClick={() => navigate(`/listings/${listing.id}`)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Listings;
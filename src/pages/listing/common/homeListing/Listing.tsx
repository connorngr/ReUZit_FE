import { useEffect, useState } from 'react';
import { fetchListings, Listing, getActiveListingByCategoryId } from '../../../../api/listing';
import { useSearch } from '/home/arty/Documents/ReUZit_FE/src/context/SearchContext.tsx';
import Card from './Card';
import { useNavigate } from 'react-router-dom';

const Listings: React.FC = () => {
    const { query, categoryId } = useSearch();
    const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadListings = async () => {
          try {
            setLoading(true);
            let data: Listing[];
    
            // Fetch listings based on the selected category
            if (categoryId) {
              data = await getActiveListingByCategoryId(categoryId);
            } else {
              data = await fetchListings();
            }
    
            setListings(data);
          } catch (err) {
            setError('Failed to load listings.');
          } finally {
            setLoading(false);
          }
        };
    
        loadListings();
      }, [categoryId])

    useEffect(() => {
        const filtered = listings.filter((listing) =>
            listing.title.toLowerCase().includes(query.toLowerCase()) // Filter listings by query
        );
        setFilteredListings(filtered);
    }, [query, listings]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>

            {filteredListings.length > 0 ? (
                filteredListings.map((listing) => (
                    <Card
                        key={listing.id}
                        listing={listing}
                        onClick={() => navigate(`/listings/${listing.id}`)} />
                ))
            ) : (
                <div>No products found.</div>
            )}
        </div>
    );
};

export default Listings;
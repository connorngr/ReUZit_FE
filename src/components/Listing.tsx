// src/components/Listings.tsx
import { useEffect, useState } from 'react';
import { fetchListings, Listing } from '../api/listing';
import Card from './common/Card';
import { useNavigate } from 'react-router-dom';
import { useSearch } from './form/SearchContext';

const Listings: React.FC = () => {
    const { searchTerm } = useSearch(); // Use searchTerm from SearchContext
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadListings = async () => {
            try {
                const data = await fetchListings();
                setListings(data);
            } catch (err) {
                setError('Failed to load listings.');
            } finally {
                setLoading(false);
            }
        };

        loadListings();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const filteredListings = listings.filter((listing) =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {filteredListings.map((listing) => (
                <Card 
                    key={listing.id}
                    listing={listing}
                    onClick={() => navigate(`/listings/${listing.id}`)}
                />
            ))}
        </div>
    );
};

export default Listings;

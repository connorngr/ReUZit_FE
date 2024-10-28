import { useEffect, useState } from 'react';
import { fetchListings, Listing } from '../api/listing';
import Card from './common/Card';

const Listings: React.FC = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            
                {listings.map((listing) => (
                    <Card 
                    key = {listing.id}
                    listing={listing}/>
                ))}
        </div>
    );
};

export default Listings;
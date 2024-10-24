// pages/index.tsx
import React, { useEffect, useState } from 'react';
import CardItem from '../components/listing/CardItem';
import { getListings } from '../api/auth';

interface Image {
  id: number;
  url: string;
}

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  condition: string;
  status: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  category: {
    name: string;
  };
  createdAt: string;
  images: Image[]; // Thêm danh sách hình ảnh
}



const Home: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings();
        console.log('Setting listings data:', data); // Log để kiểm tra dữ liệu
        setListings(data);
      } catch (error) {
        console.error('Failed to fetch listings:', error); // Log lỗi nếu có
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Listings</h1>
      <div className="grid grid-cols-1 gap-4">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <CardItem key={listing.id} listing={listing} />
          ))
        ) : (
          <p>No listings found</p>  // Hiển thị thông báo nếu không có dữ liệu
        )}
      </div>
    </div>
  );
};


export default Home;

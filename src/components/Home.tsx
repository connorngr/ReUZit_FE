<<<<<<< HEAD
// pages/index.tsx
import React, { useEffect, useState } from 'react';
import CardItem from '../components/listing/CardItem';
import { getListings } from '../api/auth';
=======
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from 'react-i18next';
import Listings from "./Listing";


const Home = () => {

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-6 pt-6 sm:px-6 lg:px-8">
            <section className="rounded bg-neutral-100 py-8 sm:py-12">
                <div className="mx-auto grid grid-cols-1 items-center justify-items-center gap-8 px-8 sm:px-16 md:grid-cols-2">
                    <div className="max-w-md space-y-4">
                        <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Discover our Curated Collection</h2>
                        <p className="text-pretty text-neutral-600">Explore our carefully selected products for your home and lifestyle.</p>
                        <a className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-900 px-6 font-medium text-neutral-50 transition-colors hover:bg-neutral-900/90 focus:outline-none focus:ring-1 focus:ring-neutral-950" href="/category/accessories">Shop Now</a>
                    </div>
                    <img alt="Cup of Coffee" loading="eager" width="450" height="450" decoding="async" data-nimg="1" className="rounded" sizes="(max-width: 640px) 70vw, 450px"
                        src="https://breakfastwithwords.wordpress.com/wp-content/uploads/2014/08/antique-store.jpg"
                    />
                </div>
            </section>
            <h1 className="text-4xl font-extrabold text-black sm:text-center sm:text-6xl m-5">Posts</h1>
            <Listings />
        </div>
    );
>>>>>>> main

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

import React from 'react';
import { API_URL } from "../../api/auth";
import { Listing } from '../../api/listing';

interface CardProps {
  listing: Listing;
  onClick?: () => void; // Add the optional onClick prop
}

const Card: React.FC<CardProps> = ({ listing, onClick }) => {
  const imageUrl = listing.images.length > 0 ? listing.images[0].url : null;

  return (
    <div onClick={onClick} className="cursor-pointer"> {/* Add onClick and cursor-pointer for clickable styling */}
      <article className="overflow-hidden rounded border bg-white">
        <div className="aspect-square w-full overflow-hidden bg-neutral-100">
          {imageUrl ? (
            <img 
              src={`${API_URL}${imageUrl}`} // Display the first image from the images array
              alt={listing.title} 
              loading="eager" 
              width="768" 
              height="768" 
              decoding="async" 
              className="group-hover:rotate hover-perspective w-full bg-neutral-100 object-cover object-center transition-opacity group-hover:opacity-75" 
              sizes="(max-width: 1024x) 100vw, (max-width: 1280px) 50vw, 700px" 
            />
          ) : (
            <div className="w-full h-full bg-neutral-200 flex items-center justify-center">No Image</div>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-neutral-700">{listing.title}</h2>
          <footer className="text-sm font-medium text-neutral-900">
          <p>{Number(listing.price).toLocaleString('vi-VN')} VND</p>
          </footer>
        </div>
      </article>
    </div>
  );
};

export default Card;

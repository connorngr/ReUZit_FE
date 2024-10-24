import React from 'react';

interface Image {
  id: number;
  url: string;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface Category {
  name: string;
}

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  condition: string;
  status: string;
  user: User;
  category: Category;
  createdAt: string;
  images: Image[]; // Thêm danh sách hình ảnh
}

interface CardItemProps {
  listing: Listing;
}

const CardItem: React.FC<CardItemProps> = ({ listing }) => {
  return (
    <div className="border p-4 rounded-md shadow-md max-w-sm">
      <h2 className="text-xl font-bold">{listing.title}</h2>
      {listing.images.length > 0 ? (
        <div className="mb-2">
          {listing.images.map((image) => (
            <img key={image.id} src={image.url} alt={listing.title} className="w-full h-48 object-cover rounded-md" />
          ))}
        </div>
      ) : (
        <p>No images available</p>
      )}
      <p>{listing.description}</p>
      <p><strong>Price:</strong> ${listing.price}</p>
      <p><strong>Condition:</strong> {listing.condition}</p>
      <p><strong>Status:</strong> {listing.status}</p>
      <p><strong>Category:</strong> {listing.category.name}</p>
      <p><strong>Seller:</strong> {listing.user.firstName} {listing.user.lastName}</p>
      <p><strong>Email:</strong> {listing.user.email}</p>
      <p><strong>Created At:</strong> {new Date(listing.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default CardItem;

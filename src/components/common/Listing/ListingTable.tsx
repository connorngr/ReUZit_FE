import React from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '../../../api/listing';
import { Category } from '../../../api/category'

interface ListingTableProps {
  listings: Listing[];
  categories: Category[];
  selectedListingIds: number[];
  handleCheckboxChange: (listingId: number) => void;
  handleEdit: (listingId: number) => void;
  getCategoryName: (categoryId: number) => string;
}

const ListingTable: React.FC<ListingTableProps> = ({
  listings,
  categories,
  selectedListingIds,
  handleCheckboxChange,
  handleEdit,
  getCategoryName,
}) => {
  return (
    <table className="w-full text-sm text-left text-gray-900">
      <thead className="text-xs uppercase bg-gray-50 text-[#eb6a4e]">
        <tr>
          <th scope="col" className="p-4"></th>
          <th scope="col" className="px-6 py-3">Title</th>
          <th scope="col" className="px-6 py-3">Status</th>
          <th scope="col" className="px-6 py-3">Category</th>
          <th scope="col" className="px-6 py-3">Price</th>
          <th scope="col" className="px-6 py-3">Action</th>
        </tr>
      </thead>
      <tbody>
        {listings.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-center text-gray-500 p-4">
              Bạn không có bài viết nào gần đây
            </td>
          </tr>
        ) : (
          listings.map((listing) => (
            <tr key={listing.id} className="bg-white border-b hover:bg-[#f2f2f2]">
              <td className="w-4 p-4">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#eb6a4e] bg-gray-100 border-gray-300 focus:ring-[#eb6a4e]"
                  checked={selectedListingIds.includes(listing.id)}
                  onChange={() => handleCheckboxChange(listing.id)}
                />
              </td>
              <td className="px-6 py-4 font-medium text-gray-900">
                <Link
                  to={`/listings/${listing.id}`}
                  className="text-[#ed663d] hover:text-[#e44717] hover:no-underline hover:text-lg transition-all duration-200"
                >
                  {listing.title}
                </Link>
              </td>
              <td className="px-6 py-4 text-gray-900">{listing.status}</td>
              <td className="px-6 py-4 text-gray-900">
                {getCategoryName(listing.categoryId)}
              </td>
              <td className="px-6 py-4 text-gray-900">${listing.price}</td>
              <td className="px-6 py-4">
                <a
                  className="font-medium text-[#1a29e0] hover:underline"
                  onClick={() => handleEdit(listing.id)}
                >
                  Edit
                </a>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default ListingTable;

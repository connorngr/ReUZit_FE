import React from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '../../../../api/listing';

interface ListingTableProps {
  listings: Listing[];
  selectedListingIds: number[];
  handleCheckboxChange: (listingId: number) => void;
  handleEdit: (listingId: number) => void;
}

const ListingTable: React.FC<ListingTableProps> = ({
  listings,
  selectedListingIds,
  handleCheckboxChange,
  handleEdit,
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
              <td className="px-6 py-4 text-gray-900">{listing.condition}</td>
              <td className="px-6 py-4 text-gray-900">
                {listing.category?.name || "No category"}
              </td>
              <td className="px-6 py-4 text-gray-900"><p>{Number(listing.price).toLocaleString('vi-VN')} VND</p></td>
              <td className="px-6 py-4">
                {listing.status === 'ACTIVE' ? (
                  <a
                    className="font-medium text-[#1a29e0] hover:underline cursor-pointer"
                    onClick={() => handleEdit(listing.id)}
                  >
                    Edit
                  </a>
                ) : (
                  <span className="text-gray-400 cursor-not-allowed">Edit</span>
                )}
              </td>

            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default ListingTable;

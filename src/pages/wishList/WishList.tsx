import React, { useEffect, useState } from 'react';
import { getAllSelectedListings, SelectedListing, deleteSelectedListing } from '../../api/wishlist';
import { API_URL } from "../../api/auth";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../assets/styles/App.css';

const WishList: React.FC = () => {
    const [selectedListings, setSelectedListings] = useState<SelectedListing[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSelectedListings = async () => {
            try {
                const data = await getAllSelectedListings();
                setSelectedListings(data.reverse());
            } catch (error) {
                console.error("Error fetching selected listings:", error);
            }
        };

        fetchSelectedListings();
    }, []);

    const handleDelete = async (id: number, event: React.MouseEvent) => {
        event.stopPropagation();
        const targetElement = document.getElementById(`listing-${id}`);
        if (targetElement) {
            targetElement.classList.add("fade-out");
        }
        const updatedListings = selectedListings.filter((listing) => listing.listing.id !== id);
        setSelectedListings(updatedListings);

        try {
            await deleteSelectedListing(id);
            Swal.fire('Success', 'Product removed successfully!', 'success');
        } catch (error) {
            console.error("Error deleting listing:", error);
            setSelectedListings([...selectedListings]);
            Swal.fire('Error', 'Failed to remove product. Please try again.', 'error');
        }
    };

    const handleViewListing = (id: number, status: string) => {
        if (status !== "ACTIVE") {
            Swal.fire({
                icon: 'info',
                title: 'Unavailable',
                text: 'Người bán đã gỡ sản phẩm khỏi page. Bạn chỉ có thể xóa sản phẩm này.',
            });
            return;
        }
        navigate(`/listings/${id}`);
    };

    return (
        <div className="font-sans bg-white max-w-6xl mx-auto p-4">
            <h3 className="text-3xl font-bold text-gray-800 ">Your Wishlist</h3>
            <div className="overflow-x-auto">
                <table className="mt-12 w-full border-collapse divide-y">
                    <thead className="whitespace-nowrap text-left">
                        <tr>
                            <th className="text-base text-gray-500 font-medium p-2">Title</th>
                            <th className="text-base text-gray-500 font-medium p-2">Category</th>
                            <th className="text-base text-gray-500 font-medium p-2">Condition</th>
                            <th className="text-base text-gray-500 font-medium p-2">Price</th>
                            <th className="text-base text-gray-500 font-medium p-2">Remove</th>
                        </tr>
                    </thead>
                    <tbody className="whitespace-nowrap divide-y">
                        {selectedListings.length > 0 ? (
                            selectedListings.map((listing) => (
                                <tr
                                    id={`listing-${listing.id}`}
                                    onClick={() => handleViewListing(listing.listing.id, listing.listing.status)}
                                    key={listing.id}
                                >
                                    <td className="px-2 py-4">
                                        <div className="flex items-center gap-4 w-max">
                                            <div className="h-32 shrink-0">
                                                <img
                                                    src={`${API_URL}${listing.listing.images[0].url}`}
                                                    alt={listing.listing.title}
                                                    className="w-full h-full object-contain rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-[#ed663d] transition-all duration-200">{listing.listing.title}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-2 py-4">
                                        <span className="text-base font-bold text-gray-800">
                                            {listing.listing.category.name}
                                        </span>
                                    </td>
                                    <td className="px-2 py-4">
                                        <span className="text-base font-bold text-gray-800">
                                            {listing.listing.condition}
                                        </span>
                                    </td>
                                    <td className="px-2 py-4">
                                        <h4 className="text-base font-bold text-gray-800">
                                            {Number(listing.listing.price).toLocaleString('vi-VN')} VND
                                        </h4>
                                    </td>
                                    <td className="px-2 py-4">
                                        <button
                                            type="button"
                                            className="bg-transparent border flex items-center justify-center w-11 h-10 rounded-lg"
                                            onClick={(event) => handleDelete(listing.listing.id, event)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 fill-red-500 inline" viewBox="0 0 24 24">
                                                <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z" />
                                                <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-4">
                                    No products in your cart.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WishList;

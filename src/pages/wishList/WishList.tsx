import React, { useEffect, useState } from 'react';
import { getAllSelectedListings, SelectedListing, deleteSelectedListing } from '../../api/wishlist';
import { API_URL } from "../../api/auth";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../assets/styles/App.css'

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
        // Add animation when delete listing
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
        navigate(`/listings/${id}`); // Redirect to the listing's detail page
    };

    return (
        <div className="font-[sans-serif] bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-50">
            <div className="max-w-7xl max-lg:max-w-4xl mx-auto p-6">
                <h2 className="text-2xl font-extrabold text-gray-800">Your shopping cart</h2>

                <div className="grid lg:grid-cols-3 gap-4 relative mt-8">
                    <div className="lg:col-span-2 space-y-4">
                        {/* Product */}
                        {selectedListings.length > 0 ? (
                            selectedListings.map((listing) => (
                                <div
                                    id={`listing-${listing.id}`}
                                    className="p-6 bg-white shadow rounded-md relative cursor-pointer"
                                    onClick={() => handleViewListing(listing.listing.id, listing.listing.status)}
                                    key={listing.id}
                                >
                                    <div className="flex items-center max-sm:flex-col gap-4 max-sm:gap-6">
                                        <div className="w-52 shrink-0">
                                            <img src={`${API_URL}${listing.listing.images[0].url}`} alt="HP ProBook 455" className="w-full h-full object-contain" />
                                        </div>

                                        <div className="sm:border-l sm:pl-4 sm:border-gray-300 w-full">
                                            <h3 className="text-xl font-bold text-gray-800">{listing.listing.title}</h3>

                                            <ul className="mt-4 text-sm text-gray-800 space-y-2">
                                                <li >
                                                    <li>{listing.listing.category.name}</li>
                                                    <li>{listing.listing.condition}</li>
                                                    <li>{listing.listing.status}</li>
                                                    <li>...</li>
                                                    <li><a href="javascript:void(0);" className="text-blue-600">(See more Specifications)</a></li>
                                                </li>
                                            </ul>

                                            <hr className="border-gray-300 my-4" />

                                            <div className="flex items-center justify-between flex-wrap gap-4">
                                                <div className="flex items-center gap-3">
                                                    <button type="button" className="font-semibold text-red-500 text-xs flex items-center gap-1 shrink-0"
                                                        onClick={(event) => handleDelete(listing.listing.id, event)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 fill-current inline" viewBox="0 0 24 24">
                                                            <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z" data-original="#000000"></path>
                                                            <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z" data-original="#000000"></path>
                                                        </svg>
                                                        REMOVE
                                                    </button>
                                                </div>

                                                <div className="flex items-center">
                                                    <h4 className="text-lg font-bold text-gray-800">${listing.listing.price}</h4>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500 absolute top-3.5 right-3.5" viewBox="0 0 320.591 320.591">
                                                        <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z" />
                                                        <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No products in your cart.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WishList;
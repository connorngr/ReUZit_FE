// ViewListing.tsx
import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListingById, Listing } from '../../api/listing';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Swiper as SwiperType } from 'swiper';
import { API_URL } from '../../api/auth'
import { addSelectedListing, deleteSelectedListing, checkIfListingIsSelected } from '../../api/wishlist';
import '../../assets/styles/App.css'
import { getCurrentUser, User } from '../../api/user';
import {useSelector} from "react-redux";
import { RootState } from '../../stores/store';
import DOMPurify from 'dompurify';

const ViewListing: React.FC = () => {

    const { listingId } = useParams<{ listingId: string }>(); // Get the listing ID from the URL params
    const navigate = useNavigate(); // useNavigate hook for redirection
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [images, setImages] = useState<string[]>([]); // State for images
    const [user, setUser] = useState<User | null>(null);
    const mainSwiperRef = useRef<SwiperType | null>(null);
    const [isAddedToSelected, setIsAddedToSelected] = useState(false);
    const { userChats } = useSelector((state: RootState) => state.chat);

    var sanitizedDescription = listing?.description
        ? DOMPurify.sanitize(listing.description)
        : '';

    const handleThumbnailClick = (index: number) => {
        setActiveIndex(index);
        if (mainSwiperRef.current) {
            mainSwiperRef.current.slideTo(index); // Cập nhật slide của Swiper chính
        }
    };

    const isChatExists = useMemo(() => {
        return userChats.some(
            (chat) =>
                chat.listingId === listing?.id &&
                chat.otherUserId === listing?.userId
        );
    }, [userChats, listing]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error('Error fetching user:', error);
                setError('Failed to fetch user information.');
            }
        };

        const fetchListing = async () => {
            try {
                // Fetch listing details
                const data = await getListingById(Number(listingId));
                setListing(data);

                // Check if listing is already in SelectedListing
                const isSelected = await checkIfListingIsSelected(Number(listingId));
                setIsAddedToSelected(isSelected);

                const imageUrls = data.images.map((image) => `${API_URL}${image.url}`);
                setImages(imageUrls);
            } catch (err) {
                setError('Failed to load listing details.');
            } finally {
                setLoading(false);
            }
        };

        if (listingId) {
            fetchUser();
            fetchListing();
        }
    }, [listingId]);

    const handleAddOrRemoveSelected = async () => {
        if (!listingId) return;

        try {
            if (isAddedToSelected) {
                // Remove listing from SelectedListing
                await deleteSelectedListing(Number(listingId));
                setIsAddedToSelected(false);
            } else {
                // Add listing to SelectedListing
                await addSelectedListing(Number(listingId));
                setIsAddedToSelected(true);
            }
        } catch (err) {
            setError('Failed to update selected listing status.');
        }
    };

    const handleStartChat = useCallback(() => {
        if (!user) {
            navigate('/login'); // Thay navigate
            return;
        }
        navigate(`/chat-dashboard?listingId=${listing?.id}&otherUserId=${listing?.userId}`);
    }, [listing, user]);

    const handleBuyNow = () => {
        navigate("/checkout", { state: { user, listing } });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            {listing ? (
                <>
                    <section className="py-24">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                <div className="slider-box w-full h-full max-lg:mx-auto mx-0">
                                    <div className="swiper main-slide-carousel swiper-container relative mb-6">
                                        <Swiper
                                            spaceBetween={10}
                                            slidesPerView={1}
                                            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                                            onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
                                        >
                                            {images.map((image, index) => (
                                                <SwiperSlide key={index}>
                                                    <div className="relative w-full h-96 flex items-center justify-center overflow-hidden rounded-2xl">
                                                        <img
                                                            src={image}
                                                            alt={`Listing image ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                    {/* Thumbnail Swiper */}
                                    <div className="nav-for-slider mt-4">
                                        <Swiper
                                            spaceBetween={10}
                                            slidesPerView={5}
                                            className="thumbs-slide"
                                            breakpoints={{
                                                640: { slidesPerView: 4 },
                                                768: { slidesPerView: 5 },
                                            }}
                                        >
                                            {images.map((image, index) => (
                                                <SwiperSlide key={index} className="flex justify-center items-center">
                                                    <img
                                                        src={image}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        className={`cursor-pointer rounded-xl object-cover w-20 h-20 border-2 transition-all duration-500 ${activeIndex === index ? 'border-indigo-600' : 'border-transparent'}`}
                                                        onClick={() => handleThumbnailClick(index)}
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center">
                                    <div
                                        className="pro-detail w-full max-lg:max-w-[608px] lg:pl-8 xl:pl-16 max-lg:mx-auto max-lg:mt-8">
                                        <div className="flex items-center justify-between gap-6 mb-6">
                                            <div className="text">
                                                <h2 className="font-manrope font-bold text-3xl leading-10 text-gray-900 mb-2">
                                                    {listing.title}
                                                </h2>
                                                <p className="font-normal text-base text-gray-500">{listing.condition}</p>
                                            </div>
                                            <button
                                                className={`group transition-all duration-500 p-0.5 rounded-full 
                                                    ${isAddedToSelected
                                                    ? 'bg-green-500 text-white cursor-pointer'
                                                    : 'bg-indigo-50 hover:bg-indigo-100 cursor-pointer'}`}
                                                onClick={handleAddOrRemoveSelected}
                                            >
                                                {isAddedToSelected ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-5 w-5 text-white"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.704 5.704a1 1 0 010 1.415L8.82 15.002a1.002 1.002 0 01-1.417 0l-3.09-3.086a1 1 0 111.415-1.414L8.11 13.179l7.18-7.179a1 1 0 011.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        Added
                                                    </span>
                                                ) : (
                                                    <svg
                                                        width="60"
                                                        height="60"
                                                        viewBox="0 0 60 60"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <circle
                                                            className="fill-indigo-50 transition-all duration-500 group-hover:fill-indigo-100"
                                                            cx="30"
                                                            cy="30"
                                                            r="30"
                                                            fill=""
                                                        />
                                                        <path
                                                            className="stroke-indigo-600 transition-all duration-500 group-hover:stroke-indigo-700"
                                                            d="M21.4709 31.3196L30.0282 39.7501L38.96 30.9506M30.0035 22.0789C32.4787 19.6404 36.5008 19.6404 38.976 22.0789C41.4512 24.5254 41.4512 28.4799 38.9842 30.9265M29.9956 22.0789C27.5205 19.6404 23.4983 19.6404 21.0231 22.0789C18.548 24.5174 18.548 28.4799 21.0231 30.9184M21.0231 30.9184L21.0441 30.939M21.0231 30.9184L21.4628 31.3115"
                                                            stroke=""
                                                            strokeWidth="1.6"
                                                            strokeMiterlimit="10"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        <div
                                            className="flex flex-col min-[400px]:flex-row min-[400px]:items-center mb-8 gap-y-3">
                                            <div className="flex items-center">
                                                <h5 className="font-manrope font-semibold text-2xl leading-9 text-gray-900">
                                                    <p>{Number(listing.price).toLocaleString('vi-VN')} VND</p>
                                                </h5>
                                            </div>
                                        </div>
                                        <div className="flex items-center flex-col min-[400px]:flex-row gap-3 mb-3 min-[400px]:mb-8">
                                            {/*  Buy listing  */}
                                            <button className="group py-3 px-5 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-lg w-full flex items-center justify-center gap-2 shadow-sm shadow-transparent transition-all duration-500 hover:shadow-indigo-300 hover:bg-indigo-100"
                                                onClick={handleBuyNow}>
                                                Buy now
                                            </button>
                                        </div>
                                        {/*<button className="text-center w-full px-5 py-4 rounded-[100px] bg-indigo-600 text-white font-semibold shadow-sm shadow-transparent transition-all duration-300 hover:shadow-indigo-300">*/}

                                        {/*    Chat*/}
                                        {/*</button>*/}
                                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                            {user && user.id !== listing.userId && (
                                                <button
                                                    onClick={handleStartChat}
                                                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg
                                         hover:bg-blue-700 transition duration-300 ease-in-out
                                         flex items-center justify-center space-x-2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                         viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd"
                                                              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                                              clipRule="evenodd"/>
                                                    </svg>
                                                    <span>{isChatExists ? 'Continue Chat' : 'Chat with Seller'}</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => navigate(-1)}
                                                className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg
                                     hover:bg-gray-50 transition duration-300 ease-in-out"
                                            >
                                                Back to Listings
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="mt-5 listing-detail-container">
                                <h2 className="text-2xl font-bold mb-4 text-center text-orange-300">Product Details</h2>
                                <div
                                    className="text-gray-700 mt-20"
                                    dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                                ></div>
                            </div>
                        </div>
                    </section>

                </>
            ) : (
                <div>Listing not found.</div>
            )}
        </div>
    );
};

export default ViewListing;

import React, { useEffect, useState } from "react";
import { API_URL } from "../../../api/auth";
import { sellerOrder, Transaction } from "../../../api/transaction";
import moment from 'moment';
import ViewAddressBuyer from '../common/ViewAddressBuyer';
import SearchBar from '../common/SearchBar'
import OrderTableSeller from '../common/OrderTableSeller';

const SellerOrder: React.FC = () => {
  const [transactionSeller, setTransactionSeller] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleAddressClick = (address: any) => {
    setSelectedAddress(address);
  };

  const closeLayout = () => {
    setSelectedAddress(null);
  };
  // Fetch orders when the component loads
  useEffect(() => {
    const fetchSellerOrder = async () => {
      try {
        const data = await sellerOrder();
        setTransactionSeller(data.reverse());
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchSellerOrder();
  }, []);
  // Filter orders based on search query
  const filteredTransaction = transactionSeller.filter((transaction) => {
    const query = searchQuery.toLowerCase();
    return (
      transaction.id.toString().includes(query) ||
      transaction.sender.email.toLowerCase().includes(query) ||
      transaction.transactionDate.toLowerCase().includes(query) ||
      transaction.payment.order.listing.title?.toLowerCase().includes(query)
    );
  });
  return (
    <div className="max-w-screen-xl bg-white">
      <div className="bg-white py-2 px-3">
        <nav className="flex flex-wrap gap-4">
          <a
            href="#"
            className="inline-flex whitespace-nowrap border-b-2 border-transparent py-2 px-3 text-sm font-medium text-gray-600 transition-all duration-200 ease-in-out hover:border-b-purple-600 hover:text-purple-600"
          >
            Setting
          </a>
          <a
            href="#"
            className="inline-flex whitespace-nowrap border-b-2 border-transparent border-b-purple-600 py-2 px-3 text-sm font-semibold text-purple-600 transition-all duration-200 ease-in-out"
          >
            Orders Managerment
          </a>
        </nav>
      </div>
      <div className="w-screen bg-gray-50">
        <div className="mx-auto max-w-screen-xl px-2 py-10">
          <div className="mt-4 w-full">
            <div className="flex w-full flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              <button
                type="button"
                className="relative mr-auto inline-flex cursor-pointer items-center rounded-full border border-gray-200 bg-white px-5 py-2 text-center text-sm font-medium text-gray-800 hover:bg-gray-100 focus:shadow sm:mr-0"
              >
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                <svg
                  className="mr-2 h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filter
              </button>
            </div>
          </div>
          <OrderTableSeller
            transactions={filteredTransaction}
            onAddressClick={handleAddressClick}
          />
          {selectedAddress && (
            <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
              <ViewAddressBuyer address={selectedAddress} onClose={closeLayout} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerOrder;

import React, { useEffect, useState } from "react";
import { API_URL } from "../../../api/auth";
import { sellerOrder, Transaction } from "../../../api/transaction";
import moment from 'moment';
import ViewAddressBuyer from '../common/ViewAddressBuyer';
import { useSearch } from '../../../context/SearchContext';
import SearchBar from '../../../components/layout/common/SearchBar';
import OrderTableSeller from '../common/OrderTableSeller';

const SellerOrder: React.FC = () => {
  const [transactionSeller, setTransactionSeller] = useState<Transaction[]>([]);
  const { query } = useSearch();
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
  // Filter orders based on the search query from context
  const filteredTransaction = transactionSeller.filter((transaction) =>
    transaction.payment.order.id.toString().includes(query) ||
    transaction.receiver.email.toLowerCase().includes(query) ||
    transaction.transactionDate.toLowerCase().includes(query) ||
    transaction.payment.order.listing.title?.toLowerCase().includes(query)
  );

  return (
    <div className="max-w-screen-xl bg-white">
      <div className="bg-white py-2 px-3">
        <nav className="flex flex-wrap gap-4">
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
            <SearchBar />
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
